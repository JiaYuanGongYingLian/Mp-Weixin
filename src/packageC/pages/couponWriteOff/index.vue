<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-15 14:03:12
 * @LastEditTime: 2023-11-13 16:09:49
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { productApi, couponApi } from '@/api'
import { checkLoginState, dateFormat } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { currentShop, myShopList, userInfo } = storeToRefs(userStore)
async function getShopList() {
  if (!checkLoginState()) return
  const { data } = await productApi.getShopList({
    nopaging: true,
    shopType: 3,
    userId: userInfo.value.id,
    status: 20,
    otherColumns: 'vipReserve'
  })
  if (data && data.records) {
    myShopList.value = data.records
    userStore.syncSetMyShopList(myShopList.value)
    if (myShopList.value.length > 0) {
      userStore.syncSetCurrentShop(myShopList.value[0])
    }
  }
}
const coupon = ref({ id: '' })
async function getCouponInfo() {
  if (!checkLoginState()) return
  const { data, code } = await couponApi.userCouponInfo({
    detail: 1,
    id: coupon.value.id
  })
  if (code === 200) {
    coupon.value = data
  }
}
function confirm() {
  uni.showModal({
    content: '确定验券吗？',
    success: async (e) => {
      if (e.confirm) {
        const { code } = await couponApi.userCouponUse({
          shopId: currentShop.value.id,
          id: coupon.value.id
        })
        if (code === 200) {
          uni.showToast({
            title: '验券成功！',
            icon: 'none'
          })
        }
      }
    }
  })
}
onLoad((option) => {
  if (option) {
    const { cardId } = option
    coupon.value.id = cardId
    getCouponInfo()
  }
  getShopList()
})
</script>
<template>
  <hy-nav-bar
    title="验券"
    :borderBottom="true"
    :background="{
      background: '#fff'
    }"
  ></hy-nav-bar>
  <view class="container">
    <view class="tips">
      <u-icon
        class="icon"
        name="checkmark-circle-fill"
        color="#2979ff"
        size="40"
      ></u-icon>
      <text>二维码扫描正确，是否验券？</text>
    </view>
    <view class="card">
      <view>优惠描述：{{ coupon.name }}</view>
      <view
        >领取时间：{{
          coupon.createTime
            ? dateFormat(new Date(coupon.createTime * 1000), 'yyyy-MM-dd hh:mm')
            : ''
        }}</view
      >
      <view class="gap"></view>
      <view>券码：{{ coupon.id }}</view>
    </view>
    <u-button
      shape="circle"
      class="hy-btn"
      ripple
      @click="confirm"
      :disabled="coupon.status !== 1"
      >{{ coupon.status !== 1 ? '已验券' : '确认验券' }}</u-button
    >
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 0 40rpx;
}
.tips {
  font-size: 28rpx;
  color: red;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20rpx;
  font-weight: bold;
  .icon {
    margin-right: 10rpx;
  }
}
.card {
  width: 640rpx;
  margin: 0 auto;
  margin-top: 40rpx;
  border-radius: 10rpx;
  box-shadow: 0 0 15rpx 0 rgba(0, 0, 0, 0.05);
  padding: 40rpx 30rpx;
  background: #fff;
  line-height: 60rpx;
  .gap {
    margin: 10rpx 0;
    background-color: #f0f0f0;
    height: 2rpx;
    width: 100%;
  }
}
.hy-btn {
  margin-top: 200rpx;
}
</style>
