<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { Md5 } from "ts-md5";
import { userApi } from '@/api';

onLoad((option) => {
  const { shopId } = option;
});
const form = reactive({
  username: '',
  password: ''
});
//手机号验证
function mobileBlurFn() {
  const telReg = /^1[3456789]\d{9}$/;
  if (form.username != '') {
    if (!telReg.test(form.username)) {
      uni.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
    }
  } else {
    uni.showToast({
      title: '请输入手机号',
      icon: 'none'
    });
  }
}
function clearFn() {
  form.username = '';
}
async function submit() {
  await userApi.login({
    type: 10,
    username: form.username,
    code: Md5.hashStr(form.password)
  })
}
</script>
<template>
  <view class="form">
    <view class="inputBox">
      <!--                <view class="label">手机号</view>-->
      <input class="inpt phone" type="number" v-model="form.username" maxlength="11" @blur="mobileBlurFn"
        placeholder-class="placeholderStyle" placeholder-style="color: #D3DBE0;font-size: 34rpx;font-weight: normal;"
        placeholder="请输入手机号" />
      <cover-image v-if="form.username" @tap="clearFn" class="close"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/close.png"></cover-image>
    </view>
    <view class="inputBox">
      <!--                <view class="label">验证码</view>-->
      <input class="inpt code" type="text" maxlength="20" v-model="form.password" placeholder-class="placeholderStyle"
        placeholder-style="color: #D3DBE0;font-size: 34rpx;font-weight: normal;" placeholder="请输入密码" />
    </view>
    <view class="btn checked" @tap="submit">登录</view>
  </view>
</template>

<style lang="scss" scoped>
.placeholderStyle {
  color: #d3dbe0;
  font-size: 34rpx;
  font-weight: normal;
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

.btn {
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  color: #fff;
  background: #d9dadb;
  font-size: 34rpx;
  border-radius: 55rpx;
  margin: 70rpx 0 30rpx 0;
}

.btn.checked {
  background: linear-gradient(218deg, #41d8ae 0%, #23c0c0 100%);
}
</style>
