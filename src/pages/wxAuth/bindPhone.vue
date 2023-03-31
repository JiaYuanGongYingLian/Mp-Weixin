<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { baseApi, productApi } from '@/api';
import { getImgFullPath, getDistances } from '@/utils/index'

const bannerList = ref([]);
const info = ref();
function getPhoneNumber(res) {
  console.log(res)
}
onLoad((option) => {
  const { shopId } = option;
})
</script>
<template>
  <view class="authorize">
    <image
      src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/home/login.png"
      class="img"
    ></image>
    <button
      class="btn"
      open-type="getPhoneNumber"
      @getphonenumber="getPhoneNumber"
    >
      微信用户一键登录
    </button>
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
}
</style>
