<!-- eslint-disable no-empty -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 11:51:54
 * @LastEditTime: 2023-08-09 23:52:40
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import hyNavBarSimpler from '@/components/hy-nav-bar-simpler/index.vue'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const buttonRect = ref({})
// #ifdef MP-WEIXIN
buttonRect.value = wx.getMenuButtonBoundingClientRect()
// #endif
const tabList = [
  {
    name: '社区'
  },
  {
    name: '热门'
  }
]
const currentTab = ref(1)
function change(index: any) {
  currentTab.value = index
  if (index === 0) {
    uni.switchTab({ url: '/pages/community/index' })
  }
}
const fullScreen = ref(false)
const swiperCurrent = ref(0)
const showControl = ref(true)
const swiperList = ref([])
const isPreview = ref(false)
async function dynamicList() {
  try {
    const res1 = await socialApi.dynamicList({
      noPaging: true,
      type: 3,
      detail: true
    })
    swiperList.value = res1.data
  } catch {}
}
function videoPlay(index: any) {
  swiperList.value[index].isPlay = !swiperList.value[index].isPlay
  showControl.value = true
  const video = uni.createVideoContext(`video${index}`)
  if (swiperList.value[index].isPlay) {
    video.play()
  } else {
    video.pause()
  }
  for (let i = 0; i < swiperList.value.length; i += 1) {
    if (i !== index) {
      const otherVideo = uni.createVideoContext(`video${i}`)
      otherVideo.pause()
      swiperList.value[i].isPlay = false
    }
  }
}
function animationfinishFn(e: { detail: { current: number } }) {
  if (swiperCurrent.value !== e.detail.current) {
    swiperCurrent.value = e.detail.current
    videoPlay(swiperCurrent.value)
  }
  if (swiperList.value.length - 1 === e.detail.current) {
    getNextFn()
  }
}
async function getNextFn() {
  console.log('加载下一页数据')
}
function controlFn(e: { detail: { show: boolean } }) {
  showControl.value = e.detail.show
}
// 全屏
function fullscreenchangeFn(e: { detail: { fullScreen: boolean } }) {
  fullScreen.value = e.detail.fullScreen
}
function toBusinessCard() {
  uni.navigateTo({
    url: '/pagesA/businessCard/detail'
  })
}
function toBusinessCardHome() {
  uni.navigateTo({
    url: '/pagesA/businessCard/index'
  })
}
function toPublishCenter() {
  uni.navigateTo({
    url: '/pagesA/publish/index'
  })
}
function toMine() {
  uni.navigateTo({
    url: '/pagesA/businessCard/index'
  })
}
function toFamous() {
  uni.navigateTo({
    url: '/pagesA/famous/index'
  })
}
const type = ref('default')
function autoShowFn(name?: string) {
  if (name) {
    return name === type.value
  }
  return ['preview', 'viewSingleUser'].includes(type.value)
}
function doLike(item) {
  item.like += 1
  item.likeStatus = true
}
onLoad((option) => {
  type.value = option?.type
  if (type.value === 'preview') {
    type.value = 'preview'
    isPreview.value = true
    const video = JSON.parse(localStorage.getItem('video') || '{}')
    swiperList.value.push(video)
  } else if (type.value === 'viewSingleUser') {
    const list = JSON.parse(localStorage.getItem('videoList') || '[]')
    swiperList.value.push(...list)
    swiperCurrent.value = Number(option?.index)
    videoPlay(swiperCurrent.value)
  } else {
    dynamicList()
  }
})
</script>
<template>
  <view class="container">
    <hyNavBarSimpler
      v-if="autoShowFn()"
      backIconColor="#fff"
      title=""
      :borderBottom="false"
      :background="{ background: 'tranparent' }"
    ></hyNavBarSimpler>
    <view
      v-if="!autoShowFn()"
      class="head-view"
      fixed
      :style="{
        background: 'rgba(0,0,0,0)',
        paddingTop: buttonRect.top ? buttonRect.top + 'px' : '0',
        top: 0,
        zIndex: 10
      }"
    >
      <u-tabs
        :list="tabList"
        v-model="currentTab"
        bg-color="rgba(0,0,0,0)"
        active-color="#fff"
        inactive-color="#fff"
        font-size="34"
        @change="change"
      ></u-tabs>
    </view>
    <swiper
      class="swiper"
      :current="swiperCurrent"
      @change="animationfinishFn"
      duration="300"
      :vertical="true"
    >
      <swiper-item
        class="swiperItem"
        v-for="(item, index) in swiperList"
        :key="index"
      >
        <video
          class="video"
          :id="'video' + index"
          @tap="videoPlay(index)"
          @play="item.isPlay = true"
          :autoplay="swiperCurrent === index"
          :loop="true"
          :src="getImgFullPath(item.videoUrl)"
          :poster="getImgFullPath(item.previewImage)"
          :controls="true"
          :show-fullscreen-btn="true"
          :show-play-btn="false"
          :show-center-play-btn="false"
          @controlstoggle="controlFn"
          @fullscreenchange="fullscreenchangeFn"
        ></video>
        <image
          v-show="!item.isPlay"
          @tap="videoPlay(index)"
          class="play"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/play.png"
        ></image>
        <view class="sideBar" v-if="!isPreview">
          <view class="avatar">
            <u-image
              :src="item.avatar"
              width="80rpx"
              height="80rpx"
              shape="circle"
              @click="toBusinessCardHome"
            ></u-image>
            <u-image
              width="36rpx"
              height="36rpx"
              shape="circle"
              class="icon"
              src="https://image.blacksilverscore.com/uploads/2fdc2eed-dc7a-490e-8c11-17a4668ea375.png"
            ></u-image>
          </view>
          <view class="action" @click="doLike(item)">
            <text
              class="iconfont hy-icon-yidianzan"
              :class="{ 'is-active': item.likeStatus }"
            ></text>
            {{ item.like }}
          </view>
          <view class="action">
            <text
              class="iconfont hy-icon-fenxiangzhuanfa"
              style="font-size: 60rpx"
            ></text>
            {{ item.share }}
          </view>
        </view>
        <view
          :class="showControl ? 'footer showControl' : 'footer'"
          id="footer"
          v-if="!fullScreen"
        >
          <view class="top">
            <view class="name" @click="toBusinessCard"
              >@{{ item.nickName }}</view
            >
            <view class="textBox">{{ item.name }}</view>
            <view class="textBox">{{ item.content }}</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="tabbar" v-if="!autoShowFn()">
      <view class="item" @click="toFamous">名人</view>
      <view class="item" @click="toPublishCenter"
        ><text class="iconfont hy-icon-push"></text
      ></view>
      <view class="item" @click="toMine">我的</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: calc(100vh - env(safe-area-inset-top));
  background-color: #000;
  display: flex;
  flex-direction: column;
  .swiper {
    width: 100%;
    flex: 1;
    .swiperItem {
      .video {
        width: 100%;
        height: 100%;
      }
      .play {
        position: absolute;
        width: 152rpx;
        height: 152rpx;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        opacity: 0.6;
        z-index: 2;
      }
    }
  }
  .sideBar {
    position: absolute;
    right: 30rpx;
    top: 50%;
    transform: translateY(-50%);
    color: #fff;
    z-index: 1;
    .avatar {
      border: 2px solid #fff;
      border-radius: 50%;
      position: relative;
      width: 86rpx;
      height: 86rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 40rpx;
      .icon {
        position: absolute;
        left: 50%;
        bottom: 0;
        color: red;
        z-index: 1;
        transform: translateX(-50%) translateY(40%);
      }
    }
    .action {
      display: flex;
      flex-direction: column;
      font-size: 20rpx;
      text-align: center;
      margin-top: 30rpx;
      .iconfont {
        font-size: 70rpx;
      }
      .hy-icon-yidianzan {
        &.is-active {
          animation: heartbeat 1s;
          color: red;
        }
      }
      @keyframes heartbeat {
        0% {
          transform: scale(1);
        }
        10% {
          transform: scale(1.25);
        }
        100% {
          transform: scale(1);
        }
      }
    }
  }
  .footer {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    z-index: 1;
    &.showControl {
      bottom: 50rpx;
    }
    .top {
      padding: 0 30rpx 20rpx 30rpx;
      box-sizing: border-box;
      background: linear-gradient(
        180deg,
        rgba(0, 0, 0, 0) 0%,
        rgba(0, 0, 0, 0.06) 46%,
        rgba(0, 0, 0, 0.08) 100%
      );
      .labelBox {
        color: #b3b3b3;
        font-size: 24rpx;
      }
      .name {
        color: #ffffff;
        font-size: 30rpx;
        font-weight: bold;
        margin-top: 16rpx;
      }
      .textBox {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 16rpx;
        color: #ffffff;
        .p {
          max-width: 525rpx;
          font-size: 28rpx;
          line-height: normal;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
        .btn {
          color: #ffffff;
          font-size: 26rpx;
          line-height: normal;
        }
      }
      .openBox {
        margin-top: 16rpx;
        .p {
          display: block;
          color: #ffffff;
          font-size: 26rpx;
          line-height: normal;
          word-break: break-all;
          white-space: pre-line;
          word-wrap: break-word;
        }
        .btn {
          color: #ffffff;
          font-size: 26rpx;
          line-height: normal;
          display: block;
          text-align: right;
        }
      }
    }

    .bottom {
      background-color: #fff;
      padding: 20rpx 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        padding-left: 30rpx;
        display: flex;
        justify-content: center;
        align-items: center;
        .pic {
          width: 48rpx;
          height: 48rpx;
          margin-right: 10rpx;
        }
        .num {
          color: #636366;
          font-size: 24rpx;
        }
      }
      .right {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        width: 500rpx;
        box-sizing: border-box;
        padding-right: 30rpx;
        .box {
          position: relative;
          margin-right: 20rpx;
          overflow: visible;
          .btn {
            display: block;
            width: 130rpx;
            height: 100%;
            background-color: rgba(0, 0, 0, 0);
            padding: 0;
            margin: 0;
            text-align: center;
            line-height: normal;
            .pic {
              width: 40rpx;
              height: 40rpx;
              display: inline-block;
              vertical-align: middle;
              position: relative;
              z-index: 2;
              margin-right: 8rpx;
            }
            .text {
              vertical-align: middle;
              display: inline-block;
              color: #636366;
              font-size: 24rpx;
              height: 40rpx;
              line-height: 40rpx;
            }
          }
          .wechat {
            width: 174rpx;
            .pic {
              width: 174rpx;
              height: 56rpx;
            }
          }
          .btn:after {
            border: none;
          }
        }
        .box:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
.tabbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: #fff;
  /* #ifdef MP-WEIXIN */
  height: 110rpx;
  padding-top: 26rpx;
  /* #endif */
  /* #ifdef H5 */
  height: 100rpx;
  /* #endif */
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
  z-index: 1000;
  .item {
    font-size: 30rpx;
    font-weight: 500;
    .hy-icon-push {
      font-size: 52rpx;
      font-weight: normal;
    }
  }
}
</style>
