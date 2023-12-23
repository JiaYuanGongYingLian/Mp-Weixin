<!-- eslint-disable no-console -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-empty -->
<!-- eslint-disable no-use-before-define -->
<!--
h5分享的链接统一通过此页面重定向
分享链接或生成二维码的链接有（示例）：
1.付款链接
https://wap.blacksilverscore.com/?redirect_url=/packageA/pages/physicalShopCheck/index&qrcode=1&shopId=1073
2.店铺分享链接
https://wap.blacksilverscore.com/?redirect_url=/packageA/pages/physicalShop/index&qrcode=1&shopId=1073
3.商品分享链接
https://wap.blacksilverscore.com/?redirect_url=/packageA/pages/productDetail/index&qrcode=1&shopId=1073&productId=100003057&shareCode='84DUO4'
 -->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { LOGO } from '@/common/config'
import { useUserStore, useConfigStore } from '@/store'
import { getQueryObject, getQueryVariable, parseParams } from '@/utils/common'
import { baseApi } from '@/api'

const userStore = useUserStore()
const configStore = useConfigStore()
async function toTargetPage(URL?: any, duration = 0) {
  await getConfig('mini_project')
  const url = URL || '/pages/index/index'
  console.log('启动页跳转至：', url)
  setTimeout(() => {
    uni.reLaunch({
      url
    })
  }, duration)
}
async function getConfig(fieldName = 'mini_project') {
  const { data } = await baseApi.getSystemConfigInfo({
    fieldName
  })
  const config = JSON.parse(data.fieldValue)
  console.log(config)
  if (config.version === configStore.version) {
    configStore.videoPageOpen = !!config.video
    configStore.hideData = !!config.hideData
    configStore.shopId = config.shopId
  }
}

const uncertainShareCodeLinks = [
  '/packageA/pages/physicalShopCheck/index',
  '/packageA/pages/physicalShop/index',
  '/packageA/pages/productDetail/index'
]
function isNoCodeLink(url: string) {
  return uncertainShareCodeLinks.some((item) => {
    return url.includes(item)
  })
}

onLoad(async (option) => {
  // #ifdef MP-WEIXIN
  const redirect_url = option?.redirect_url
  console.log('redirect_url >>> ', option?.redirect_url)
  delete option?.redirect_url
  const url_rewirte = parseParams(redirect_url, option || {})
  if (option?.shareCode) {
    uni.setStorageSync('shareCode', option?.shareCode)
  }
  uni.login({
    provider: 'weixin',
    success: async (res) => {
      uni.setStorageSync('wxCode', res.code)
      try {
        await userStore.wxMiniLogin(res.code)
        await userStore.loginByOpenId()
        await userStore.getUserInfo()
      } catch (err) {
        console.log(err)
      }
      toTargetPage(url_rewirte)
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
  let url = ''
  const origin_url = getQueryVariable('redirect_url') || ''
  const qrcode = getQueryVariable('qrcode')
  const shareCode = getQueryVariable('shareCode')
  const deviceSn = getQueryVariable('deviceSn')
  if (shareCode) {
    uni.setStorageSync('shareCode', shareCode)
    userStore.syncSetUseShareCode(true)
  } else if (isNoCodeLink(origin_url)) {
    // 扫店铺结算二维码/店铺分享码 如无shareCode，标记下来结算时不携带（防止storage存的被携带）
    userStore.syncSetUseShareCode(false)
  }
  if (deviceSn) {
    uni.setStorageSync('deviceSn', deviceSn)
  }
  const tempParams = getQueryObject(window.location.search)
  if (tempParams.redirect_url) {
    delete tempParams.redirect_url
  }
  url = parseParams(origin_url, tempParams)
  if (qrcode) {
    configStore.setEnterType('storeQrcode')
    if (origin_url === '/packageA/pages/physicalShopCheck/index') {
      // 扫店铺结算二维码的特殊处理，使结算完成跳转首页为店铺首页
      // eslint-disable-next-line no-shadow
      // const url_rewirte = parseParams('/packageA/pages/physicalShop/index', tempParams)
      // uni.setStorageSync('redirect_url', url_rewirte)
    } else {
      uni.setStorageSync('redirect_url', url)
    }
  }
  if (option?.from === 'login') {
    // eslint-disable-next-line no-shadow
    const redirect_url = uni.getStorageSync('redirect_url')
    if (redirect_url) {
      url = redirect_url
      uni.removeStorageSync('redirect_url')
    }
  }
  toTargetPage(url)
  // #endif
})
</script>

<template>
  <div class="launch">
    <view class="content" style="--num: 150">
      <image class="logo" :src="LOGO" mode="widthFix" />
      <text class="name">开心家园</text>
      <view class="dot"></view>
    </view>
    <view class="footer">
      <view class="text">Copyright © 开心家园版权所有</view>
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
    // border: 1px solid $bg-primary;
    animation: fadeIn 2s linear forwards;

    .logo {
      width: 200rpx;
      height: 200rpx;
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
      display: none;

      &::before {
        content: '';
        position: absolute;
        top: -7px;
        left: 50%;
        transform: translateX(-50%);
        width: 14px;
        height: 14px;
        background: $bg-primary;
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
