<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance, checkLoginState } from '@/utils/index'

const bannerList = ref([])
const info = ref()
onLoad((option) => {})
function goUrlFn(e: { currentTarget: { dataset: { url: any } } }) {
  const { url } = e.currentTarget.dataset
  if (checkLoginState()) {
    if (url) {
      uni.navigateTo({
        url
      })
    }
  }
}
function loginOutFn() {
  uni.showLoading({ title: '', mask: true })
  uni.setStorage({ key: 'localUserInfo', data: '[]', success: () => {} })
  uni.setStorage({
    key: 'localSourceToken',
    data: '[]',
    success: () => {
      uni.reLaunch({
        url: '/pages/mine/index'
      })
    }
  })
}
</script>
<template>
  <div class="container">
    <view class="box">
      <view
        class="list"
        @tap="goUrlFn"
        data-url="/pages/addressList/index?type=mine&id=''"
      >
        <view class="left">地址管理</view>
        <image
          class="right"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
        ></image>
      </view>
    </view>
    <view class="box">
      <view class="list" style="border-bottom: 1px solid #f0f5f4">
        <button class="feedback" open-type="feedback">建议反馈</button>
        <view class="left">建议反馈</view>
        <image
          class="right"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
        ></image>
      </view>
      <view class="list" @tap="goUrlFn" data-url="/pages/about/index">
        <view class="left">联系我们</view>
        <image
          class="right"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
        ></image>
      </view>
    </view>
    <view class="btn" @tap="loginOutFn">退出登录</view>
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;
  .box {
    margin-top: 20rpx;
    background-color: #fff;
    padding: 0 30rpx 0 40rpx;
    .list {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      padding: 35rpx 0;
      .left {
        font-size: 34rpx;
        color: #242426;
      }
      .right {
        width: 16rpx;
        height: 28rpx;
      }
      .feedback {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 2;
        left: 0;
        top: 0;
        opacity: 0;
      }
    }
  }
  .btn {
    width: 100%;
    height: 120rpx;
    line-height: 120rpx;
    text-align: center;
    font-size: 34rpx;
    color: #242426;
    background-color: #fff;
    margin-top: 20rpx;
  }
}
</style>
