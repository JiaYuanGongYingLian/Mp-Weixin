<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-25 09:26:40
 * @LastEditTime: 2023-07-10 17:52:47
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onPageScroll } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import hyNavBarSimpler from '@/components/hy-nav-bar-simpler/index.vue'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const videoList = reactive({
  list: [],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const tabList = ref([
  {
    name: '作品'
  },
  {
    name: '橱窗'
  }
])
const currentTab = ref(0)
async function dynamicList() {
  try {
    const res1 = await socialApi.dynamicList({
      noPaging: true,
      type: 3,
      userId: userInfo.value.id,
      detail: true
    })
    videoList.list = [...res1.data]
  } catch {}
}
function toEdit() {}
function tabChange() {}
function toView(index: number) {
  localStorage.setItem('videoList', JSON.stringify(videoList.list))
  uni.navigateTo({
    url: `/pagesA/shortVideo/index?type=viewSingleUser&index=${index}`
  })
}
onLoad((option) => {
  dynamicList()
})

const show = ref(true)
const status = ref('loadmore')
const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
  if (e.scrollTop > 50) {
    show.value = false
  } else {
    show.value = true
  }
})
</script>
<template>
  <view class="container">
    <hyNavBarSimpler v-show="show" />
    <view class="topView">
      <u-image
        src="https://oss.wyh139.com/Uploads/null/20230615/1686806973000776.png"
        width="100%"
        height="460rpx"
      ></u-image>
      <view class="headBox">
        <view class="avatar">
          <u-image
            src="https://oss.wyh139.com/Uploads/null/20230615/1686806973000776.png"
            width="200rpx"
            height="200rpx"
            shape="circle"
            @click="toEdit"
          ></u-image>
        </view>
        <view class="info">
          <view class="name">微观世界</view>
        </view>
      </view>
    </view>
    <view class="main">
      <view class="section">
        <view class="accountInfo">
          <view class="item">
            <text class="val">94.0万</text>
            <text class="label">获赞</text>
          </view>
          <view class="item">
            <text class="val">10</text>
            <text class="label">关注</text>
          </view>
          <view class="item">
            <text class="val">32.6</text>
            <text class="label">粉丝</text>
          </view>
        </view>
        <view class="remark">
          "人生道路，选择大于努力，格局决定结局，心态决定一切！"
        </view>
        <view class="subscribe">
          <text class="text">+关注</text>
        </view>
      </view>
      <u-tabs
        active-color="#333"
        :list="tabList"
        :is-scroll="false"
        v-model="currentTab"
        bar-width="200"
        item-width="50%"
        @change="tabChange"
        sticky
        :style="{ top: '0', zIndex: 2 }"
      ></u-tabs>
      <view class="zuopin" v-if="currentTab === 0">
        <view class="videoList">
          <view
            class="video-item"
            v-for="(item, index) in videoList.list"
            :key="item.id"
          >
            <u-image
              width="100%"
              height="360rpx"
              :src="getImgFullPath(item.previewImage)"
              @click="toView(index)"
            ></u-image>
            <view class="like">
              <text class="iconfont hy-icon-like-line"></text>
              <text>{{ item.like || 123 }}</text>
            </view>
          </view>
        </view>
        <u-loadmore :status="status" />
        <u-back-top :scroll-top="scrollTop"></u-back-top>
      </view>

      <view class="cc" v-else> 橱窗 </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.topView {
  position: relative;
  .headBox {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 60rpx 40rpx;
    display: flex;
    align-items: center;
    box-shadow: inset 0rpx -100rpx 20rpx -10rpx rgba(0, 0, 0, 0.1);
    .avatar {
      width: 200rpx;
      height: 200rpx;
      border: 2px solid #fff;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30rpx;
    }
    .info {
      .name {
        color: #fff;
        font-size: 36rpx;
        font-weight: bold;
      }
    }
  }
}
.main {
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  position: relative;
  top: -30rpx;
  background: #fff;
  flex: 1;
  box-shadow: 0rpx 30rpx 0rpx 0 rgb(255, 255, 255);
  .section {
    padding: 40rpx 30rpx;
  }
  .accountInfo {
    display: flex;
    align-items: center;
    gap: 30rpx;
    .val {
      font-size: 34rpx;
      font-weight: bold;
      margin-right: 10rpx;
    }
    .label {
      color: #666;
    }
  }
  .remark {
    padding: 30rpx 0 20rpx 0;
  }
}
.subscribe {
  background-color: #fc2b55;
  border-radius: 6rpx;
  color: #fff;
  text-align: center;
  line-height: 60rpx;
  font-weight: bold;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.3);
  &:active {
    box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
    transform: translateY(0em) scale(0.99);
    transition: background-color 150ms ease-out, box-shadow 150ms ease-out,
      transform 150ms ease-out;
  }
}
.u-tabs {
  border-bottom: 1px solid #ccc;
  :deep(.u-tab-bar) {
    // transform: translateY(0) !important;
    bottom: -3px;
  }
}
.videoList {
  display: flex;
  flex-wrap: wrap;
  gap: 1px;
  margin-top: 2px;
  .video-item {
    width: calc((100% - 2px) / 3);
    position: relative;
    // border-radius: 8rpx;
    overflow: hidden;
    .like {
      display: flex;
      position: absolute;
      left: 20rpx;
      bottom: 16rpx;
      align-items: center;
      color: #fff;
      .hy-icon-like-line {
        font-size: 28rpx;
        color: #fff;
        margin-right: 10rpx;
      }
    }
  }
}
</style>
