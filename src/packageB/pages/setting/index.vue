<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, userApi } from '@/api'
import { checkLoginState, getImgFullPath } from '@/utils/index'
import { upload } from '@/common/ali-oss'
import { useUserStore, useChatStore } from '@/store'
import {
  isWeChat,
  base64ToFile,
  imageUrlToFile,
  wxUploadImage
} from '@/utils/common'

const userStore = useUserStore()
const chatStore = useChatStore()
const { userInfo } = storeToRefs(userStore)
function goUrlFn(url: any) {
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
  userStore.syncClearToken()
  userStore.syncClearUserInfo()
  chatStore.jimLoginOut()
  uni.reLaunch({
    url: '/pages/mine/index'
  })
  uni.hideLoading()
}
async function onChooseAvatar(e: { detail: { avatarUrl: any } }) {
  const { avatarUrl } = e.detail
  userInfo.value.avatar = avatarUrl
  console.log('url', e, avatarUrl)
  upload({
    filePath: avatarUrl,
    onSuccess: async () => {
      const { data } = await userApi.userInfoUpdate({
        avatar: url
      })
    },
    onError() {
      uni.showToast({
        title: '上传失败'
      })
    }
  })
}
const avatarTempUrl = ref('')
function onChooseImage() {
  uni.chooseImage({
    count: 1,
    success(res) {
      avatarTempUrl.value = res.tempFiles[0].path
      // res.tempFiles[0]
    }
  })
}
function uploadImage(file: any) {
  upload({
    file,
    onSuccess: async (ret: { url: any }) => {
      successFn(ret.url)
    },
    onError() {
      uni.showToast({
        title: '上传失败'
      })
    }
  })
}

async function cutConfirm(e: any) {
  // #ifdef H5
  const file = base64ToFile(e.detail.tempFilePath, `${new Date()}`)
  uploadImage(file)
  // #endif
  // #ifdef MP-WEIXIN
  const res = await wxUploadImage(e.detail.tempFilePath)
  successFn(res.data)
  // #endif
}
function cutCancel() {
  avatarTempUrl.value = ''
}
async function successFn(url: any) {
  await userApi.userInfoUpdate({
    avatar: url
  })
  await userStore.getUserInfo()
}
onLoad((option) => {})
</script>
<template>
  <div class="container">
    <hy-nav-bar :title="'设置'"></hy-nav-bar>
    <u-cell-group>
      <!-- <button
        class="customBtn"
        open-type="chooseAvatar"
        @chooseavatar="onChooseAvatar"
      ></button> -->
      <button class="customBtn" @click="onChooseImage"></button>

      <u-cell-item title="头像" hover-class="cell-hover-class">
        <!-- #ifdef H5 -->
        <u-avatar :src="getImgFullPath(userInfo.avatar)"></u-avatar>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <u-avatar
          :src="getImgFullPath(userInfo.avatar)"
          v-if="userInfo.avatar"
        ></u-avatar>
        <view v-else class="avatar">
          <open-data type="userAvatarUrl"></open-data>
        </view>
        <!-- #endif -->
      </u-cell-item>
    </u-cell-group>
    <hy-image-cropper
      :src="avatarTempUrl"
      @cancel="cutCancel"
      @confirm="cutConfirm"
    ></hy-image-cropper>

    <view class="gap"></view>
    <u-cell-group>
      <u-cell-item
        title="地址管理"
        hover-class="cell-hover-class"
        @click="goUrlFn(`/packageB/pages/addressList/index?type=mine&id=''`)"
      >
      </u-cell-item>
    </u-cell-group>
    <view class="gap"></view>
    <u-cell-group>
      <u-cell-item title="建议反馈" hover-class="cell-hover-class">
        <button class="customBtn" open-type="feedback"></button>
      </u-cell-item>
      <u-cell-item
        title="联系我们"
        hover-class="cell-hover-class"
        @click="goUrlFn(`/packageB/pages/about/index`)"
      >
      </u-cell-item>
    </u-cell-group>
    <!-- #ifdef H5 -->
    <view class="btn" @tap="loginOutFn" v-if="!isWeChat()">退出登录</view>
    <!-- #endif -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
  }

  .gap {
    margin-bottom: 20rpx;
  }

  .customBtn {
    padding: 0;
    border: 0;
    background-color: inherit;
    position: absolute;
    top: 0;
    right: 0;
    width: 200rpx;
    height: 100%;
    z-index: 1;
    opacity: 0;

    &:after {
      border: none;
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
