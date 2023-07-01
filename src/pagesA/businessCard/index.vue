<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-25 09:26:40
 * @LastEditTime: 2023-07-01 18:05:28
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
import hyNavBarSimpler from '@/components/hy-nav-bar-simpler/index.vue'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const bannerList = ref([])
const tabList = ref([
  {
    name: '作品'
  },
  {
    name: '橱窗'
  }
])
const currentTab = ref(0)
function toEdit() {}
function tabChange() {}
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <hyNavBarSimpler />
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
          <text>+关注</text>
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
      ></u-tabs>
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
  overflow: hidden;
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
}
.u-tabs {
  border-bottom: 1px solid #eee;
  :deep(.u-tab-bar) {
    // transform: translateY(0) !important;
    bottom: -3px;
  }
}
</style>
