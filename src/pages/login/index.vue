<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { Md5 } from 'ts-md5'
import { useUserStore } from '@/store'
import { userApi } from '@/api'
import logo from '@/static/ic_launcher.png'

onLoad((option) => {})
const store = useUserStore()
const { count } = storeToRefs(store)
const form = reactive({
  username: '17628281574',
  password: '123456'
})
// 手机号验证
function mobileBlurFn() {
  const telReg = /^1[3456789]\d{9}$/
  if (form.username != '') {
    if (!telReg.test(form.username)) {
      uni.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
    }
  } else {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    })
  }
}
function clearFn() {
  form.username = ''
}
async function submit() {
  const { data } = await userApi.login({
    type: 10,
    username: form.username,
    code: Md5.hashStr(form.password)
  })
  store.$patch((v) => {
    v.accessToken = data.accessToken
    uni.setStorageSync('accessToken', data.accessToken)
  })
  uni.navigateBack()
}
</script>
<template>
  <image class="logo" :src="logo" mode="widthFix" />
  <view class="form">
    <view class="inputBox">
      <!--                <view class="label">手机号</view>-->
      <input
        class="inpt phone"
        type="number"
        v-model="form.username"
        maxlength="11"
        @blur="mobileBlurFn"
        placeholder-class="placeholderStyle"
        placeholder-style="color: #D3DBE0;font-size: 34rpx;font-weight: normal;"
        placeholder="请输入手机号"
      />
      <cover-image
        v-if="form.username"
        @tap="clearFn"
        class="close"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/close.png"
      ></cover-image>
    </view>
    <view class="inputBox">
      <!--                <view class="label">验证码</view>-->
      <input
        class="inpt code"
        type="text"
        maxlength="20"
        v-model="form.password"
        placeholder-class="placeholderStyle"
        placeholder-style="color: #D3DBE0;font-size: 34rpx;font-weight: normal;"
        placeholder="请输入密码"
      />
    </view>
    <u-button class="hy-btn" :ripple="true" @click="submit">登录</u-button>
  </view>
</template>

<style lang="scss" scoped>
.placeholderStyle {
  color: #d3dbe0;
  font-size: 34rpx;
  font-weight: normal;
}

.logo {
  display: block;
  width: 200rpx;
  height: 200rpx;
  margin: 0 auto;
  margin-top: 100rpx;
  border-radius: 10rpx;
}

.form {
  padding: 200rpx 75rpx;
}

.inputBox {
  position: relative;
  border-bottom: 2rpx solid #e6ecf0;
  margin-bottom: 20rpx;

  .label {
    font-size: 36rpx;
    color: #333;
    font-weight: bold;
  }

  .inpt {
    display: block;
    width: 500rpx;
    padding: 30rpx 0;
    color: #242426;
    font-weight: bold;
    font-size: 34rpx;
  }

  .close {
    width: 28rpx;
    height: 28rpx;
    position: absolute;
    bottom: 0;
    right: 0;
    top: 0;
    margin: auto;
    z-index: 2;
  }
}

.hy-btn {
  margin: 70rpx 0 30rpx 0;
}
</style>
