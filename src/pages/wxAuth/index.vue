<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { baseApi, productApi } from '@/api';
import { getImgFullPath, getDistances } from '@/utils/index';
const bannerList = ref([])
const info = ref()
function getUserProfileFn() {
  uni.getUserProfile({
    desc: '用于完善个人信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    lang: 'zh_CN',
    success: (res) => {
      console.log(res);
      if (res.signature) {
        // _this.$store.commit('setAuthorize', true);
        // _this.$store.commit('setWxUserInfo', res.userInfo);
        // if (_this.isBindPhone) {
        //   _this.upDateFn();
        // } else {
        //   _this.$store.commit('setBindPhone', false);

        // }
        uni.redirectTo({
          url: "/pages/wxAuth/bindPhone"
        })
      }
    }
  })
}
function goback() {
  const pages = getCurrentPages(); // 当前页面栈
  if (pages.length > 1) {
    uni.navigateBack({
      delta: 1
    });
  } else {
    uni.reLaunch({
      url: '/pages/launch/index'
    });
  }
}
onLoad((option) => {
  const { shopId } = option
  productApi.getShopInfo({
    id: shopId
  })
})
</script>
<template>
  <view class="authorize">
    <image
      class="img"
      src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/home/login.png"
    ></image>
    <button class="btn" @tap="getUserProfileFn">授权微信用户信息</button>
    <view class="back" @tap="goback">暂不授权</view>
  </view>
</template>

<style lang="scss" scoped>
.authorize {
  padding-top: 268rpx;

  .img {
    display: block;
    margin: 0 auto;
    width: 318rpx;
    height: 84rpx;
  }

  .btn {
    display: block;
    width: 600rpx;
    height: 100rpx;
    line-height: 100rpx;
    text-align: center;
    color: #fff;
    background: linear-gradient(218deg, #41d8ae 0%, #23c0c0 100%);
    border-radius: 55rpx;
    margin: 0 auto;
    margin-top: 230rpx;
    font-size: 34rpx;
    border: none;
  }

  .back {
    color: #a3a9ad;
    text-align: center;
    font-size: 30rpx;
    margin-top: 28rpx;
  }
}
</style>