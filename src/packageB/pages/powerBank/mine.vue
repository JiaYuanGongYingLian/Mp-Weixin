<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-16 17:48:25
 * @LastEditTime: 2023-10-16 18:13:00
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
  wxUploadImage
} from '@/utils/common'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const deviceInfo = ref({})
const siteInfo = ref({})
const deviceSn = ref()
const serviceType = ref()
onLoad((option) => {
})
</script>
<template>
  <view class="container">
    <view class="top_bg">
      <image
        src="https://image.blacksilverscore.com/uploads/08f5b73f-85c9-4a99-8dde-c6ba05b6a17c.png"
        mode="scaleToFill"
        class="bg"
      />
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;
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
}

.btn {
  margin: 20rpx 40rpx 0 40rpx;
}
</style>
