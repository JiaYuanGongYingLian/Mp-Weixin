<!-- eslint-disable no-empty -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 11:51:54
 * @LastEditTime: 2023-09-20 11:12:09
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, watch, onMounted } from 'vue'
import {
  onLoad,
  onShow,
  onReady,
  onHide,
  onShareAppMessage,
  onPullDownRefresh
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi, enumAll } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore, useConfigStore } from '@/store'
import hyNavBarSimpler from '@/components/hy-nav-bar-simpler/index.vue'
import { sharePathFormat } from '@/common/wechat-share'
import c_tabbar from './c_tabbar.vue'
import c_loading from './c_loading.vue'

const userStore = useUserStore()
const configStore = useConfigStore()
const { hasLogin, userInfo, hasNewDynamic } = storeToRefs(userStore)
const buttonRect = ref({})
// #ifdef MP-WEIXIN
buttonRect.value = wx.getMenuButtonBoundingClientRect()
// #endif
const tabList = [
  {
    name: '热门'
  },
  {
    name: '关注'
  }
]
const currentTab = ref(0)
async function change(index: any) {
  swiperList.value = []
  pageIndex.value = 1
  currentTab.value = index
  swiperCurrent.value = 0
  if (index === 1) {
    await dynamicList(null, true)
  } else {
    await dynamicList()
  }
}
const fullScreen = ref(false)
const swiperCurrent = ref(0)
const showControl = ref(true)
const swiperList = ref([])
const pageIndex = ref(1)
const pageSize = ref(100)
const finished = ref(false)
const isPreview = ref(false)
watch(hasNewDynamic, (n) => {
  if (n) {
    dynamicList()
  }
})
async function dynamicList(dynamicId?: any, isFocused?: boolean) {
  try {
    const { data } = await socialApi.dynamicList({
      pageIndex: pageIndex.value,
      pageSize: pageSize.value,
      type: 3,
      detail: true,
      status: enumAll.audit_status_enum.SUCCESS,
      focused: isFocused || null,
      otherColumns: `favorited,focused,${isFocused ? '' : 'hot'}`,
      sortJson: '[{"column":"createTime","direction":"DESC"}]'
    })
    swiperList.value.push(...randomFn(data.records))
    if (data.current < data.pages) {
      pageIndex.value += 1
    } else {
      finished.value = true
    }
    if (dynamicId) {
      const index = swiperList.value.findIndex((item) => item.id == dynamicId)
      if (index !== -1) {
        swiperCurrent.value = index
        videoPlay(index)
      } else {
        swiperCurrent.value = 0
        videoPlay(swiperCurrent.value)
      }
    }
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
function animationfinishFn() {
  opacity.value = 1
}
function swiperChange(e: { detail: { current: number } }) {
  if (swiperCurrent.value !== e.detail.current) {
    swiperCurrent.value = e.detail.current
    videoPlay(swiperCurrent.value)
  }
  if (swiperList.value.length - 1 === e.detail.current) {
    getNextFn()
  }
}
const opacity = ref(1)
function handleTrans(e: { detail: { dx: any; dy: any } }) {
  const { dy } = e.detail
  if (dy < 20) {
    opacity.value = 1
  } else if (dy < 100) {
    opacity.value = 0.5
  } else if (dy < 200) {
    opacity.value = 0.3
    showControl.value = false
  }
}
async function getNextFn() {
  console.log('加载下一页数据')
  if (!finished.value) {
    dynamicList()
  } else {
    uni.showToast({
      icon: 'none',
      title: '没有更多了'
    })
  }
}
function controlFn(e: { detail: { show: boolean } }) {
  showControl.value = e.detail.show
}
// 全屏
function fullscreenchangeFn(e: { detail: { fullScreen: boolean } }) {
  fullScreen.value = e.detail.fullScreen
}
function toBusinessCardHome(data: { userId: any }, index: any) {
  if (['preview', 'viewSingleUser'].includes(type.value)) {
    uni.navigateBack()
    return
  }
  uni.navigateTo({
    url: `/packageA/pages/businessCard/index?userId=${data.userId}&avatar=${data?.user?.avatar}&nickname=${data?.user?.nickname}`
  })
}

const type = ref('default')
function autoShowFn(name?: string) {
  if (name) {
    return name === type.value
  }
  return ['preview', 'viewSingleUser'].includes(type.value)
}
async function doLike(item: {
  favorited?: boolean
  id: any
  favoriteCount: number
}) {
  const excutor = item.favorited
    ? socialApi.dynamicFavoriteDelete
    : socialApi.dynamicFavoriteAdd
  item.favoriteCount += item.favorited ? -1 : 1
  item.favorited = !item.favorited
  const res = await excutor({
    dynamicId: item.id,
    userId: userInfo.value.id
  })
}
async function focusAdd(item: { userId: any; focused: boolean }) {
  const { code } = await socialApi.userFocusAdd({
    targetUserId: item.userId,
    userId: userInfo.value.id
  })
  if (code === 200) {
    item.focused = true
    uni.showToast({
      icon: 'none',
      title: '关注成功'
    })
  }
}
function destroyVideo() {
  swiperList.value = []
}
// 随机打乱
function randomFn(arr: any[]) {
  if (!arr) return []
  return arr.sort(() => {
    return 0.5 - Math.random()
  })
}
onLoad((option) => {
  type.value = option?.type
  if (type.value === 'preview') {
    type.value = 'preview'
    isPreview.value = true
    const video = JSON.parse(uni.getStorageSync('video') || '{}')
    swiperList.value.push(video)
  } else if (type.value === 'viewSingleUser') {
    const list = JSON.parse(uni.getStorageSync('videoList') || '[]')
    swiperList.value.push(...list)
    swiperCurrent.value = Number(option?.index)
    videoPlay(swiperCurrent.value)
  } else {
    const dynamicId = option?.dynamicId
    dynamicList(dynamicId)
  }
})
onMounted(() => {
  try {
    const info = uni.createSelectorQuery().select('.swiper')
    info
      .boundingClientRect((data) => {
        console.log(parseInt(data?.width, 10))
        console.log(parseInt(data?.height, 10))
      })
      .exec()
  } catch {}
})
onHide(() => {
  // 页面跳转，暂停视频播放
  if (swiperList.value[swiperCurrent.value]) {
    swiperList.value[swiperCurrent.value].isPlay = true
    videoPlay(swiperCurrent.value)
  }
})
onShareAppMessage((_res) => {
  const dynamic = swiperList.value[swiperCurrent.value] || {}
  return {
    title: dynamic.name || '链通家园短视频',
    content: dynamic.content,
    desc: dynamic.content,
    imageUrl: getImgFullPath(dynamic.previewImage) || '',
    path: sharePathFormat({ dynamicId: dynamic.id })
  }
})
onPullDownRefresh(() => {
  console.log('refresh')
  if (['preview', 'viewSingleUser'].includes(type.value)) return
  setTimeout(() => {
    dynamicList()
    uni.stopPullDownRefresh()
  }, 1000)
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
    <c_loading
      v-if="!swiperList.length"
      style="
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    ></c_loading>
    <swiper
      v-else
      class="swiper"
      :current="swiperCurrent"
      @change="swiperChange"
      @transition="handleTrans"
      @animationfinish="animationfinishFn"
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
          :poster="getImgFullPath(item.previewImage) + ',ar_auto'"
          :controls="showControl"
          :show-fullscreen-btn="true"
          :show-play-btn="false"
          :show-center-play-btn="false"
          :object-fit="'contain'"
          :http-cache="true"
          @controlstoggle="controlFn"
          @fullscreenchange="fullscreenchangeFn"
        ></video>
        <image
          v-show="!item.isPlay"
          @tap="videoPlay(index)"
          class="play"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/play.png"
        ></image>
        <view
          class="sideBar"
          :style="{
            opacity: opacity
          }"
          v-if="!isPreview"
        >
          <view class="avatar">
            <u-image
              :src="
                getImgFullPath(
                  item?.user?.avatar || configStore.cardDefualtAvatar
                )
              "
              width="80rpx"
              height="80rpx"
              shape="circle"
              @click="toBusinessCardHome(item, index)"
            ></u-image>
            <u-image
              width="36rpx"
              height="36rpx"
              shape="circle"
              class="icon"
              src="https://image.blacksilverscore.com/uploads/2fdc2eed-dc7a-490e-8c11-17a4668ea375.png"
              v-if="!item?.focused && item?.userId !== userInfo.id"
              @click="focusAdd(item)"
            ></u-image>
          </view>
          <view class="action" @click="doLike(item)">
            <text
              class="iconfont hy-icon-yidianzan"
              :class="{ 'is-active': item?.favorited }"
            ></text>
            <text class="num">{{ item?.favoriteCount }}</text>
          </view>
          <view class="action">
            <button open-type="share" class="shareBtn"></button>
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
          :style="{
            opacity: opacity
          }"
        >
          <view class="top">
            <view class="name" @click="toBusinessCardHome(item, index)"
              >@{{ item?.user?.nickname }}</view
            >
            <view class="textBox tit" v-if="item?.name">{{ item?.name }}</view>
            <view class="textBox">{{ item.content }}</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <c_tabbar v-if="!autoShowFn()" @hide-page="destroyVideo" />
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
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
      position: relative;
      .iconfont {
        font-size: 70rpx;
        opacity: 0.85;
        text-shadow: rgba(0, 0, 0, 0.6) 1px 1px 0px;
      }
      .num {
        text-shadow: rgba(0, 0, 0, 0.6) 1px 1px 1px;
      }
      .hy-icon-yidianzan {
        &.is-active {
          animation: heartbeat 1s;
          color: red;
        }
      }
      .shareBtn {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: 0;
        z-index: 1;
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
        &.tit {
          font-weight: bold;
          font-size: 28rpx;
        }
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
</style>
