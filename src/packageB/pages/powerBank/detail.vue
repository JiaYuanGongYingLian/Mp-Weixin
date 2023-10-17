<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-13 11:41:12
 * @LastEditTime: 2023-10-17 10:30:04
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
async function getDetail(deviceSn: any) {
  const { data } = await powerBankApi.getDeviceDetail({
    deviceSn
  })
  deviceInfo.value = data?.device
  siteInfo.value = data?.site
}
async function start() {
  const { data, code, message } = await powerBankApi.deviceStart({
    deviceSn: deviceSn.value,
    serviceType: serviceType.value
  })
  if (code === 0) {
    uni.showModal({
      title: message,
      content: '',
      showCancel: false,
      confirmText: '确认',
      success: ({ confirm }) => {
        if (confirm) {
          uni.navigateBack()
        }
      }
    })
  }
}
onLoad((option) => {
  deviceSn.value = option?.deviceSn
  serviceType.value = option?.serviceType
  getDetail(option?.deviceSn)
})
</script>
<template>
  <view class="container">
    <view class="topBox">
      <view class="tit">{{ siteInfo.name }}</view>
      <view class="wrap">
        <view>设备使用说明</view>
        <view>1.设备弹出后开始计费</view>
        <view>2.使用完毕后在归还设备，结束计费</view>
      </view>
    </view>
    <!-- <view class="section">
      <view class="tit">支付方式说明</view>
      <view> 余额:余额中扣除费用 </view>
      <view> 优惠券:优惠券在洗车过程中会被优先抵扣使用 </view>
    </view> -->
    <view class="img_box">
      <image
        src="https://image.blacksilverscore.com/uploads/88b4d5ba-0361-4482-85bf-fc449361f0ae.jpg"
        mode="scaleToFill"
        class="img"
      />
    </view>
    <u-button
      ripple
      :hair-line="false"
      class="btn"
      :custom-style="{ background: '#50939c', color: '#fff' }"
      @click="start"
      >点击取出充电宝</u-button
    >
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #fff;
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
  .section {
    padding: 30rpx;
    line-height: 50rpx;
  }
  .img_box {
    .img {
      width: 100%;
      margin-top: 200rpx;
    }
  }
}

.btn {
  margin: 200rpx 30rpx 0 30rpx;
  // position: absolute;
  bottom: 0;
  left: 0;
  // width: 100%;
  height: 85rpx;
  border-radius: 16rpx;
}
</style>
