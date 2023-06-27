<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 11:51:54
 * @LastEditTime: 2023-06-27 18:05:24
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const bannerList = ref([])
const info = ref()
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
    uni.switchTab({ url: '/pagesA/community/index' })
  }
}
const fullScreen = ref(false)
const swiperCurrent = ref(0)
const showControl = ref(true)
const swiperList = ref([
  {
    nickName: 'kerwin',
    avatar: 'https://oss.wyh139.com/Uploads/null/20230529/1685354933000790.png',
    cover:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/0488fb493270835009490686338/coverBySnapshot/coverBySnapshot_10_0.jpg',
    title: '所有孩子都不想被比较我们需要多关心孩子（家庭教育）',
    share: 661,
    video:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/0488fb493270835009490686338/v.f30.mp4',
    like: 881
  },
  {
    nickName: 'kerwin1',
    avatar: 'https://oss.wyh139.com/Uploads/null/20230518/1684380540000557.png',
    cover:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/0488fb493270835009490686338/coverBySnapshot/coverBySnapshot_10_0.jpg',
    title: '玖玖乐房车俱乐部欢迎您，新时代的房车轻奢生活，带你体验美好生活',
    share: 661,
    video:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/afeba9213270835009088706262/v.f30.mp4',
    like: 900
  },
  {
    nickName: 'kerwin',
    avatar: 'https://oss.wyh139.com/Uploads/null/20230611/168647138800031.png',
    cover:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/0488fb493270835009490686338/coverBySnapshot/coverBySnapshot_10_0.jpg',
    title: '道德经赋能导师汉字解码解读道德经赋能老师起名赐字引领财富和好运',
    share: 1001,
    video:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/46a4a2eb3270835009674597344/v.f30.mp4',
    like: 2500
  },
  {
    avatar: 'https://oss.wyh139.com/Uploads/null/20230615/1686806973000776.png',
    cover:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/0488fb493270835009490686338/coverBySnapshot/coverBySnapshot_10_0.jpg',
    title:
      '对接名人首席王牌新经济导师，对接名人《名人故事栏目》负责人，对接名人成都金牛运营中心负责人，成都锦城铭仁信息技术有限公司董事长',
    share: 889,
    video:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/d022022d3270835009581248959/v.f30.mp4',
    like: 922
  },
  {
    avatar: 'https://oss.wyh139.com/Uploads/null/20230615/1686806973000776.png',
    cover:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/0488fb493270835009490686338/coverBySnapshot/coverBySnapshot_10_0.jpg',
    title:
      '对接名人首席王牌新经济导师，对接名人《名人故事栏目》负责人，对接名人成都金牛运营中心负责人，成都锦城铭仁信息技术有限公司董事长',
    share: 889,
    video:
      'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/7cf0d1703270835009960299469/v.f30.mp4',
    like: 922
  }
])
const footerHeight = ref(0)
function videoPlay(index: any) {
  swiperList.value[index].isPlay = !swiperList.value[index].isPlay
  showControl.value = true
  const video = uni.createVideoContext(`video${index}`)
  const isPlay = swiperList.value[index]
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
  getFooterFn()
}
// 获取底部高度
function getFooterFn() {
  setTimeout(() => {
    uni
      .createSelectorQuery()
      .select('#footer')
      .boundingClientRect((rect) => {
        footerHeight.value = rect.height * 2
      })
      .exec()
  }, 500)
}
// 全屏
function fullscreenchangeFn(e: { detail: { fullScreen: boolean } }) {
  fullScreen.value = e.detail.fullScreen
}
function getNextFn(id) {}
function animationfinishFn(e: { detail: { current: number } }) {
  if (swiperCurrent.value !== e.detail.current) {
    swiperCurrent.value = e.detail.current
    videoPlay(swiperCurrent.value)
  }
  if (swiperList.value.length - 1 === e.detail.current) {
    getNextFn(swiperList.value[e.detail.current].id)
  }
}
function controlFn(e: { detail: { show: boolean } }) {
  showControl.value = e.detail.show
}
function toBusinessCard() {
  uni.navigateTo({
    url: '/pagesA/businessCard/detail'
  })
}
function toPublishCenter() {
  uni.navigateTo({
    url: '/pagesA/publishCenter/detail'
  })
}
function toMine() {
  uni.switchTab({
    url: '/pages/mine/index'
  })
}
function toFamous() {
  uni.navigateTo({
    url: '/pagesA/famous/index'
  })
}
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <hy-nav-bar
      title=""
      :background="{ background: 'rgba(0,0,0,0)' }"
      :isBack="false"
      :immersive="true"
      :borderBottom="false"
    ></hy-nav-bar>
    <view class="head-view">
      <u-tabs
        :list="tabList"
        fixed
        style="top: 0; z-index: 1000"
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
      @animationfinish="animationfinishFn"
      interval="3000"
      duration="500"
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
          :src="item.video"
          :poster="item.cover"
          :controls="true"
          :show-fullscreen-btn="true"
          :show-play-btn="false"
          :show-center-play-btn="false"
          @controlstoggle="controlFn"
          @fullscreenchange="fullscreenchangeFn"
        ></video>
        <cover-image
          v-show="!item.isPlay"
          @tap="videoPlay(index)"
          class="play"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/play.png"
        ></cover-image>
        <view class="sideBar">
          <view class="avatar">
            <u-image
              :src="item.avatar"
              width="80rpx"
              height="80rpx"
              shape="circle"
            ></u-image>
            <u-icon class="icon" name="plus-circle-fill" color="red"></u-icon>
          </view>
          <view class="action">
            <u-icon></u-icon>
            {{ item.like }}
          </view>
          <view class="action">
            <u-icon></u-icon>
            {{ item.share }}
          </view>
        </view>
        <view
          :class="showControl ? 'footer showControl' : 'footer'"
          id="footer"
          v-if="!fullScreen"
          @click="toBusinessCard"
        >
          <view class="top">
            <view class="name">@{{ item.nickName }}</view>
            <view class="textBox">{{ item.title }}</view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <view class="tabbar">
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
      .icon {
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateY(-50%) translateX(-50%);
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
  height: 90rpx;
  padding-bottom: env(safe-area-inset-bottom);
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
