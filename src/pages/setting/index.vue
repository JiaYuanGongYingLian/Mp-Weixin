<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi, userApi } from '@/api'
import { checkLoginState } from '@/utils/index'
import { upload } from '@/common/ali-oss'
import { useUserStore } from '@/store'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
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
  uni.reLaunch({
    url: '/pages/mine/index'
  })
  uni.hideLoading()
}
async function onChooseAvatar(e: { detail: { avatarUrl: any } }) {
  const { avatarUrl } = e.detail
  userInfo.value.avatar = avatarUrl
  console.log('url', e, avatarUrl)
  const url = await upload({
    file: avatarUrl,
    uploadPath: '',
    onSuccess: async () => {
      const { data } = await userApi.userInfoUpdate({
        avatar: url
      })
    },
    onError: function (arg0: string) {
      uni.showToast({
        title: '上传失败'
      })
    }
  })

}
onLoad((option) => { })
</script>
<template>
  <div class="container">
    <u-cell-group>
      <button class="customBtn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
        <u-cell-item title="头像" hover-class="cell-hover-class">
          <u-avatar :src="userInfo.avatar"></u-avatar>
        </u-cell-item>
      </button>
    </u-cell-group>
    <view class="gap"></view>
    <u-cell-group>
      <u-cell-item title="地址管理" hover-class="cell-hover-class"
        @click="goUrlFn(`/pages/addressList/index?type=mine&id=''`)">
      </u-cell-item>
    </u-cell-group>
    <view class="gap"></view>
    <u-cell-group>
      <button class="customBtn" open-type="feedback">
        <u-cell-item title="建议反馈" hover-class="cell-hover-class">
        </u-cell-item>
      </button>
      <u-cell-item title="联系我们" hover-class="cell-hover-class" @click="goUrlFn(`/pages/about/index`)">
      </u-cell-item>
    </u-cell-group>
    <!-- <view class="btn" @tap="loginOutFn">退出登录</view> -->
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;

  .gap {
    margin-bottom: 20rpx;
  }

  .customBtn {
    padding: 0;
    border: 0;
    background-color: inherit;

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
