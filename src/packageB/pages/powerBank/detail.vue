<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-13 11:41:12
 * @LastEditTime: 2023-10-18 17:44:46
 * @LastEditors:  Please set LastEditors
-->
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
import { useUserStore } from '@/store'
import {
  isWeChat,
  base64ToFile,
  imageUrlToFile,
  wxUploadImage,
  getCookie,
  browserVersion
} from '@/utils/common'

const userStore = useUserStore()
const { userInfo, hasLogin } = storeToRefs(userStore)
const deviceInfo = ref({})
const siteInfo = ref({})
const deviceSn = ref('')
const serviceType = ref()
const loading = ref(false)
async function getDetail() {
  uni.showLoading({
    mask: true
  })
  const { data } = await powerBankApi
    .getDeviceDetail({
      deviceSn: deviceSn.value
    })
    .finally(() => {
      uni.hideLoading()
    })
  deviceInfo.value = data?.device
  siteInfo.value = data?.site
}
async function start() {
  uni.showLoading({
    title: '启动中'
  })
  loading.value = true
  const { data, code, message } = await powerBankApi
    .deviceStart({
      deviceSn: deviceSn.value,
      serviceType: serviceType.value
    })
    .finally(() => {
      loading.value = false
      uni.hideLoading()
    })
  if (code === 0) {
    uni.showModal({
      title: message,
      content: '',
      showCancel: false,
      confirmText: '确认',
      success: ({ confirm }) => {
        if (confirm) {
          uni.redirectTo({ url: '/packageB/pages/powerBank/index' })
        }
      }
    })
  }
}

function jump() {
  uni.navigateTo({
    url: '/packageB/pages/powerBank/mine'
  })
}

onLoad((option) => {
  deviceSn.value = option?.deviceSn
  serviceType.value = option?.serviceType
  console.log('deviceSn==>', deviceSn.value)
  console.log('serviceType==>', serviceType.value)
  const isApp = option?.from || browserVersion().isHeiyin
  if (isApp) {
    // #ifdef H5
    console.log('前端注册回调时机==》', new Date())
    window.JSBridge.registerEvent('HYUserEvent', getDetail)
    // #endif
  } else {
    getDetail()
  }
})
</script>
<template>
  <view class="container">
    <view class="topBox">
      <view class="action">
        <view class="location-btn mine" @click="jump">
          <u-image
            width="50rpx"
            height="50rpx"
            src="https://image.blacksilverscore.com/uploads/4a8fd3b1-197e-48cc-b13f-5bf1a28b7eea.png"
          ></u-image>
        </view>
      </view>
      <view class="tit">{{ siteInfo.name }}</view>
      <view class="wrap">
        <view>设备使用说明</view>
        <view>1.设备弹出后开始计费</view>
        <view>2.使用完毕后归还设备，结束计费</view>
      </view>
    </view>
    <!-- <view class="section">
      <view class="tit">支付方式说明</view>
      <view> 余额:余额中扣除费用 </view>
      <view> 优惠券:优惠券在洗车过程中会被优先抵扣使用 </view>
    </view> -->
    <view class="img_box">
      <image
        src="https://image.blacksilverscore.com/uploads/88b4d5ba-0361-4482-85bf-fc449361f0ae.jpg"
        mode="scaleToFill"
        class="img"
      />
    </view>
    <u-button
      ripple
      :hair-line="false"
      class="btn"
      :custom-style="{ background: '#50939c', color: '#fff' }"
      @click="start"
      :loading="loading"
      >点击取出充电宝</u-button
    >
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #fff;
  .topBox {
    background: #50939c;
    padding: 40rpx;
    .tit {
      font-size: 36rpx;
      color: #fff;
    }
    .wrap {
      background: rgba(255, 255, 255, 0.4);
      border-radius: 20rpx;
      color: #fff;
      padding: 10rpx 20rpx;
      line-height: 44rpx;
      margin-top: 20rpx;
      font-size: 26rpx;
    }
  }
  .section {
    padding: 30rpx;
    line-height: 50rpx;
  }
  .img_box {
    .img {
      width: 100%;
      margin-top: 200rpx;
    }
  }
}

.btn {
  margin: 200rpx 30rpx 0 30rpx;
  // position: absolute;
  bottom: 0;
  left: 0;
  // width: 100%;
  height: 85rpx;
  border-radius: 16rpx;
}
</style>
