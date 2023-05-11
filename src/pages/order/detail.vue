<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, orderApi } from '@/api'
import { getImgFullPath, dateFormat } from '@/utils/index'
import $orderStatus from '@/utils/order'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const orderData = ref({})
const baseUrl = 'https://osx.yishengyue.cn/'
const orderImgs = {
  notSend: `${baseUrl}/public/frontend/orders/not-send.gif`,
  wasSend: `${baseUrl}/public/frontend/orders/was-send.gif`,
  notPay: `${baseUrl}/public/frontend/orders/not-pay.gif`,
  wasDown: `${baseUrl}/public/frontend/orders/was-down.gif`,
  notAssess: `${baseUrl}/public/frontend/orders/not-assess.gif`
}
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <view class="state-box">
      <image
        v-if="orderData.status_pic != ''"
        class="state-pic"
        :src="orderData.status_pic"
      ></image>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  padding: 0 20rpx;
}
.state-box {
  display: flex;
  align-items: center;
  height: 150rpx;
  padding-left: 30rpx;
  background: #e93323;

  .left {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 24rpx;
    color: #fff;
    padding-left: 24rpx;
  }

  .state {
    font-size: 30rpx;
    margin-bottom: 8rpx;
  }

  .state-pic {
    width: 100rpx;
    height: 100rpx;
  }
}
</style>
