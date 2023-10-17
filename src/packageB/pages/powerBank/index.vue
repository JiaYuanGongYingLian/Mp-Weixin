<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { BrowserMultiFormatReader } from '@zxing/library'
import { baseApi, powerBankApi, userApi } from '@/api'
import { checkLoginState, getImgFullPath } from '@/utils/index'
import { upload } from '@/common/ali-oss'
import { useUserStore, useChatStore } from '@/store'
import { getQueryObject, parseParams } from '@/utils/common'

const userStore = useUserStore()
const chatStore = useChatStore()
const { userInfo } = storeToRefs(userStore)

const mapOption = reactive({
  id: 0, // 使用 marker点击事件 需要填写id
  title: 'map',
  latitude: 39.909,
  longitude: 116.39742,
  scale: 9,
  showLocation: true,
  covers: []
})
function getLocation() {
  uni.getLocation({
    type: 'gcj02',
    success(res) {
      if (res.errMsg === 'getLocation:ok') {
        const { latitude, longitude } = res
        mapOption.latitude = latitude
        mapOption.longitude = longitude
        uni.setStorageSync('currentLocation', { latitude, longitude })
        getMarkers()
      }
    },
    fail(res) {
      if (res.errMsg === 'getLocation:fail auth deny') {
        uni.showModal({
          content: '检测到您没打开获取位置信息功能权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: () => {
                  console.log('确定')
                }
              })
            } else {
              console.log('取消')
            }
          }
        })
      }
    }
  })
}
const cover = {
  latitude: '',
  longitude: '',
  iconPath:
    'https://image.blacksilverscore.com/uploads/b6562e03-f39d-4648-b7ad-7ff8164ca495.png',
  callout: {
    content: '',
    color: '#ffffff',
    fontSize: 14,
    borderRadius: 5,
    borderWidth: '10',
    bgColor: '#56D369',
    display: 'ALWAYS'
  }
}
async function getMarkers() {
  uni.showLoading()
  const { data } = await powerBankApi
    .siteList({
      latitude: mapOption.latitude,
      longitude: mapOption.longitude
    })
    .finally(() => {
      uni.hideLoading()
    })
  const covers = data.map((item) => {
    const temp = JSON.parse(JSON.stringify(cover))
    temp.latitude = item.latitude
    temp.longitude = item.longitude
    temp.callout.content = item.name
    return temp
  })
  mapOption.covers = covers
}
const codeReader = ref()
const deviceId = ref()
const showScan = ref(false)
async function initReader() {
  codeReader.value = new BrowserMultiFormatReader()
  codeReader.value
    .listVideoInputDevices()
    .then((videoInputDevices) => {
      deviceId.value = videoInputDevices[0].deviceId
      if (videoInputDevices.length > 1) {
        // 判断是否后置摄像头
        videoInputDevices.forEach((element) => {
          if (element.label.indexOf('back') > -1) {
            deviceId.value = element.deviceId
          }
        })
      }
    })
    .catch((err) => {
      uni.showModal({
        title: '提示',
        content: '当前浏览器环境不支持获取扫码通道',
        showCancel: false
      })
      console.log(err)
    })
}
function openScan() {
  showScan.value = true
  codeReader.value.reset() // 重置
  codeReader.value.decodeFromVideoDevice(
    deviceId.value,
    'video_id',
    (res: { text: string }, err: any) => {
      if (res) {
        console.log(122, res)
        showScan.value = false
        toDetail(getQueryObject(res.text))
      }
      if (err && !err) {
        uni.showModal({
          title: '扫码失败结果',
          content: JSON.stringify(err)
        })
      }
    }
  )
}
function close() {
  showScan.value = false
}
function toDetail(data = {}) {
  uni.navigateTo({
    url: parseParams('/packageB/pages/powerBank/detail', data)
  })
}
function jump() {
  uni.navigateTo({
    url: '/packageB/pages/powerBank/mine'
  })
}
onLoad((option) => {
  const currentLocation = uni.getStorageSync('currentLocation')
  if (currentLocation) {
    mapOption.latitude = currentLocation.latitude
    mapOption.longitude = currentLocation.longitude
    getMarkers()
  } else {
    getLocation()
  }

  initReader()
})
onMounted(() => {
  const video = document.querySelector('.uni-video-video')
  video?.setAttribute('id', 'video_id')
  video?.setAttribute('class', 'video_class')
})
</script>
<template>
  <view class="container">
    <map
      style="width: 100%; height: 100vh"
      :latitude="mapOption.latitude"
      :longitude="mapOption.longitude"
      :markers="mapOption.covers"
      :scale="mapOption.scale"
      :show-location="mapOption.showLocation"
      @callouttap="toDetail"
    >
    </map>
    <view class="location-btn mine" @click="jump">
      <u-image
        width="50rpx"
        height="50rpx"
        src="https://image.blacksilverscore.com/uploads/4a8fd3b1-197e-48cc-b13f-5bf1a28b7eea.png"
      ></u-image>
    </view>
    <view class="location-btn" @click="getLocation">
      <u-image
        width="50rpx"
        height="50rpx"
        src="https://image.blacksilverscore.com/uploads/7da3c965-4a2a-493b-8b42-fc1df4a9dfbc.png"
      ></u-image>
    </view>
    <u-button
      ripple
      :hair-line="false"
      class="btn"
      :custom-style="{ background: '#50939c', color: '#fff' }"
      @click="openScan"
      >扫码启动</u-button
    >
    <!-- 扫码区域 -->
    <view class="scan-box" v-show="showScan">
      <image
        @click="close"
        class="close"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/close.png"
      ></image>
      <view class="box">
        <view class="line"></view>
        <view class="angle"></view>
      </view>
      <view class="video-wrap">
        <video
          ref="video"
          id="video"
          class="scan-video"
          :controls="false"
          :show-center-play-btn="false"
        ></video>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;

  .location-btn {
    position: fixed;
    bottom: 400rpx;
    z-index: 3;
    right: 40rpx;
    background-color: #fff;
    border-radius: 50%;
    padding: 8rpx;
    &.mine {
      bottom: 500rpx;
    }
  }

  .btn {
    position: fixed;
    bottom: 120rpx;
    left: 50%;
    transform: translateX(-50%);
    width: 600rpx;
    height: 120rpx;
    border-radius: 20rpx;
    border: none;
    box-shadow: 4rpx 4rpx 16rpx 2rpx rgba(0, 0, 0, 0.2);
  }
}
.scan-box {
  height: 100vh;
  width: 100%;
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  background: #000;
  .close {
    position: absolute;
    top: 50rpx;
    right: 50rpx;
    z-index: 15;
    width: 80rpx;
    height: 80rpx;
  }
}
.video-wrap {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 11;
  .scan-video {
    width: 250px;
    height: 250px;
  }
}
.box {
  width: 213px;
  height: 213px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  border: 0.1rem solid rgba(0, 255, 51, 0.2);
  z-index: 12;
}

.box:before,
.angle:before {
  left: 0;
  border-left-color: #00ff33;
}

.box:after,
.box:before {
  top: 0;
  border-top-color: #00ff33;
}

.box:after,
.angle:after {
  right: 0;
  border-right-color: #00ff33;
}

.box:after,
.box:before {
  top: 0;
  border-top-color: #00ff33;
}

.box:after,
.box:before,
.angle:after,
.angle:before {
  content: '';
  display: block;
  position: absolute;
  width: 3vw;
  height: 3vw;
  border: 0.2rem solid transparent;
}

.line {
  height: calc(100% - 2px);
  width: 100%;
  background: linear-gradient(180deg, rgba(0, 255, 51, 0) 43%, #00ff33 211%);
  border-bottom: 3px solid #00ff33;
  transform: translateY(-100%);
  /* -webkit-animation: radar-beam-data-v-741647e8 2s infinite alternate; */
  animation: aa 2s infinite alternate;
  /* -webkit-animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99); */
  animation-timing-function: cubic-bezier(0.53, 0, 0.43, 0.99);
  /* -webkit-animation-delay: 1.4s; */
  animation-delay: 1.4s;
}

@keyframes aa {
  0% {
    transform: translateY(-100%);
  }

  100% {
    transform: translateY(0);
  }
}
</style>
