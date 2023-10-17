<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-16 17:48:25
 * @LastEditTime: 2023-10-17 18:15:08
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
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo) {
    userStore.syncSetUserInfo(userInfo)
  }
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
      <view class="top_box">
        <view class="avatar_box">
          <u-avatar
            class="avatar"
            :src="getImgFullPath(userInfo?.avatar)"
          ></u-avatar>
          <view class="name_box">
            <view class="name">kerwin</view>
            <view class="phone">17628281756</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;
  .top_bg {
    width: 100%;
    height: 440rpx;
    position: relative;
    .bg {
      width: 100%;
      height: 100%;
    }
  }
  .top_box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 30rpx;
    .avatar_box {
      display: flex;
      align-items: center;
      margin-bottom: 60rpx;
      .name_box {
        margin-left: 20rpx;
        .name {
          font-size: 30rpx;
          margin-bottom: 8rpx;
          font-weight: bold;
        }
        .phone {
          font-size: 20rpx;
          color: #999;
        }
      }
    }
  }
}

.btn {
  margin: 20rpx 40rpx 0 40rpx;
}
</style>
