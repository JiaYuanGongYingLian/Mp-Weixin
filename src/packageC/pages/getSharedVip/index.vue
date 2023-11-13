<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-15 10:52:15
 * @LastEditTime: 2023-11-13 16:29:37
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, userApi } from '@/api'
import { checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const shopId = ref('')
const shopInfo = ref({})
async function getShopInfo() {
  // if (!checkLoginState()) return
  try {
    const { data } = await productApi.getShopInfo({
      id: shopId.value,
      detail: true
    })
    shopInfo.value = data
  } catch {}
}
async function getVip() {
  if (checkLoginState()) {
    try {
      const { code, msg } = await userApi.roleUpdate({
        shopId: shopId.value
      })
      if (code === 200) {
        uni.showToast({
          icon: 'none',
          title: '会员领取成功!'
        })
      } else {
        uni.showToast({
          icon: 'none',
          title: msg
        })
      }
    } catch {}
  }
}
onLoad((option) => {
  if (option) {
    shopId.value = option.shopId
  }
  getShopInfo()
})
</script>
<template>
  <div class="container">
    <hy-nav-bar
      :borderBottom="false"
      :background="{
        background: 'inherit'
      }"
    ></hy-nav-bar>
    <view class="section">
      <view class="con">
        <view class="des">
          <!-- <u-icon :name="getImgFullPath(shopInfo.avatar)"></u-icon> -->
          <text>{{ shopInfo.name }} 给您赠送了VIP!</text>
        </view>
        <u-button
          class="btn"
          type="error"
          shape="circle"
          @click="getVip"
          ripple
          animate="iteration-infinite swing"
          >立即领取</u-button
        >
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.container {
  background-image: url('https://image.blacksilverscore.com/uploads/e04a0a42-6816-486b-8178-7e12b9f58df8.png');
  background-size: cover;
  background-repeat: repeat;
  height: 100vh;
}
.section {
  padding-bottom: env(safe-area-inset-bottom);
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  left: 0;
  .con {
    width: 640rpx;
    min-height: 100rpx;
    padding: 30rpx;
    background-color: rgba(206, 5, 5, 0.452);
    margin: 0 calc((100% - 640rpx) / 2);
    border-radius: 10rpx;
    border: 1px solid rgba(149, 6, 6, 0.903);
    margin-bottom: 100rpx;
    .des {
      color: #fff;
      margin-bottom: 20rpx;
      text-align: center;
    }
    .btn {
      margin-top: 20rpx;
    }
  }
}
</style>
