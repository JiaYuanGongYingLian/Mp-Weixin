<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onShareAppMessage } from '@dcloudio/uni-app'
import logo from '@/static/ic_launcher.png'

const version = ref('0001')
const phoneNumber = ref('4006381238')
function mobileFn() {
  uni.makePhoneCall({
    phoneNumber: phoneNumber.value
  })
}
onLoad((option) => {})
onShareAppMessage((_res) => {
  const sourceTime = new Date().getTime()
  return {
    title: '链通家园',
    path: `/pages/launch/index?sourceTime=${sourceTime}`
  }
})
</script>
<template>
  <div class="container about">
    <hy-nav-bar :title="'关于我们'"></hy-nav-bar>
    <image :src="logo" class="logo"></image>
    <view class="tit">链通家园</view>
    <view class="ver">V{{ version }}</view>
    <view class="content"
      >提供优质商品，高性价比服务，让人人0元参与创业，就业，共创共富，轻松赚钱的副业服务平台!</view
    >
    <!-- <view class="btnBox" @tap="mobileFn">
      <view>商务合作</view>
      <view
        >{{ phoneNumber
        }}<image
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
        ></image
      ></view>
    </view> -->
  </div>
</template>

<style lang="scss" scoped>
.about {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 0 76rpx;
  padding-top: 144rpx;
  box-sizing: border-box;
  .logo {
    display: block;
    margin: 0 auto;
    width: 160rpx;
    height: 160rpx;
    border-radius: 10rpx;
  }
  .tit {
    font-weight: bold;
    color: #28aaff;
    font-size: 40rpx;
    text-align: center;
    margin-top: 40rpx;
    letter-spacing: 5rpx;
  }
  .ver {
    color: #888;
    font-size: 28rpx;
    margin-top: 20rpx;
    text-align: center;
  }
  .content {
    color: #888;
    font-size: 28rpx;
    margin-top: 150rpx;
    padding: 0 20rpx;
  }
  .btnBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    border-radius: 10rpx;
    font-size: 36rpx;
    color: 333;
    padding: 24rpx 28rpx;
    box-sizing: border-box;
    margin-top: 40rpx;
    font-weight: bold;
    image {
      margin-left: 20rpx;
      width: 12rpx;
      height: 21rpx;
      margin-right: 0;
      vertical-align: 4rpx;
    }
  }
}
</style>
