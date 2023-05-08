<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-empty -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import logo from '@/static/ic_launcher.png'
import { useUserStore } from '@/store'

const userStore = useUserStore()
function toTargetPage(url = '/pages/index/index', duration = 0) {
  setTimeout(() => {
    uni.reLaunch({
      url
    })
  }, duration)
}

onLoad(async (option) => {
  // #ifdef MP-WEIXIN
  uni.login({
    provider: 'weixin',
    success: async (res) => {
      uni.setStorageSync('wxCode', res.code)
      await userStore.wxMiniLogin(res.code)
      await userStore.loginByOpenId()
      toTargetPage()
    },
    fail: () => {
      uni.hideLoading()
      uni.showToast({
        title: '请检查网络，退出后重新进入！',
        icon: 'none',
        duration: 2000
      })
    }
  })
  // #endif
  // #ifdef H5
  const { code } = await userStore.wxAuth()
  await userStore.wxWebLogin(code)
  await userStore.loginByOpenId()
  toTargetPage()
  // #endif
})
</script>

<template>
  <div class="launch">
    <view class="content" style="--num: 150">
      <image class="logo" :src="logo" mode="widthFix" />
      <text class="name">黑银生活</text>
      <view class="dot"></view>
    </view>
    <view class="footer">
      <view class="text">Copyright © 黑银生活版权所有</view>
    </view>
  </div>
</template>
<style scoped lang="scss">
.launch {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  .content {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 420rpx;
    height: 420rpx;
    border-radius: 50%;
    border: 1px solid $bg-primary;
    animation: fadeIn 2s linear forwards;

    .logo {
      width: 200rpx;
      height: 200rpx;
      border-radius: 50%;
      margin-top: 20rpx;
    }

    .name {
      font-size: 32rpx;
      margin-top: 20rpx;
      font-weight: bold;
    }

    .dot {
      position: absolute;
      inset: 0rpx;
      z-index: 10;
      animation: animateDot 3s linear forwards;

      &::before {
        content: '';
        position: absolute;
        top: -7px;
        left: 50%;
        transform: translateX(-50%);
        width: 14px;
        height: 14px;
        background: #00a6bc;
        border-radius: 50%;
      }
    }
  }

  .footer {
    width: 100%;
    position: absolute;
    margin: auto;
    bottom: calc(50rpx + env(safe-area-inset-bottom));

    .text {
      margin-top: 20rpx;
      text-align: center;
      color: #9f9f9f;
      font-size: 22rpx;
    }
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes animateDot {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(calc(3.6deg * var(--num)));
    /* 360 / 100 = 3.6deg */
  }
}
</style>
