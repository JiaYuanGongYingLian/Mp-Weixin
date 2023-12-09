<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-14 15:17:59
 * @LastEditTime: 2023-12-09 17:41:09
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, orderApi, productApi } from '@/api'
import { useUserStore } from '@/store'

const shopId = 13
const userStore = useUserStore()
const current = ref(0)
const swiperCurrent = ref(0)
const tabsRef = ref()
const productList = ref([])
async function getProduct() {
  const { data } = await productApi.getShopProductList({
    noPaging: true,
    detail: false,
    shopId
  })
  productList.value = data
  productList.value.forEach((product) => {
    getSkuList(product)
  })
}
async function getSkuList(product) {
  const { data } = await productApi.getShopProductSkuList({
    noPaging: true,
    detail: false,
    shopType: 3,
    shopId,
    productId: product.id
  })
  if (data && data.length > 0) {
    data.forEach((e: { select: boolean }) => {
      e.select = false
    })
    data[0].select = true
    product.sku = data
  }
}
function tabsChange(index) {
  swiperCurrent.value = index
}
function transition(e) {
  const { dx } = e.detail
  tabsRef.value.setDx(dx)
}
function animationfinish(e) {
  tabsRef.value.setFinishCurrent(e.detail.current)
  swiperCurrent.value = e.detail.current
  current.value = e.detail.current
}
function cardClick(index: number) {
  vipList.value.forEach((item) => {
    item.select = false
  })
  vipList.value[index].select = true
}
const submit = async () => {
  if (userStore.checkLoginState()) {
    const vip = vipList.value.find((item) => item.select) || {}
    const orderData = {
      orderProductSkus: [
        {
          count: 1,
          shopProductSkuId: vip.id,
          externalData: {
            shopId
          }
        }
      ],
      detail: true
    }
    const { data } = await orderApi.orderAdd(orderData)
    uni.navigateTo({
      url: `/packageA/pages/payment/index?order=${JSON.stringify(data)}`
    })
  }
}
onLoad((option) => {
  getProduct()
})
</script>
<template>
  <div class="container">
    <hy-nav-bar
      :borderBottom="false"
      :background="{
        backgroundImage: 'linear-gradient(to right, #484b5c, #515365, #2f3b4a)'
      }"
    ></hy-nav-bar>
    <view class=""></view>
    <view class="intro">
      <view class="title">开心家园便捷生活服务</view>
      <view class="desc">用心“省”，放心“付”</view>
      <u-gap height="30"></u-gap>
      <view class="tit2"> 不定时开放优惠套餐 </view>
    </view>
    <view>
      <u-tabs-swiper
        ref="tabsRef"
        :list="productList"
        :current="current"
        @change="tabsChange"
        :is-scroll="false"
        swiperWidth="750"
      ></u-tabs-swiper>
    </view>
    <swiper
      :current="swiperCurrent"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in productList"
        :key="index"
      >
        <view class="section">
          <view class="tit">选择套餐</view>
          <view class="card">
            <view
              class="item"
              v-for="(item, index) in item.sku"
              :key="index"
              :class="{ checked: item.select }"
              @click="cardClick(index)"
            >
              <view class="name">{{ item.name }}</view>
              <view class="price"> ￥{{ item.money }}</view>
            </view>
          </view>
        </view>
      </swiper-item>
    </swiper>
    <u-button
      type="primary"
      class="hy-btn btn"
      shape="circle"
      ripple
      @click="submit"
    >
      立即购买
    </u-button>
  </div>
</template>

<style lang="scss" scoped>
.intro {
  background-image: linear-gradient(to right, #484b5c, #515365, #2f3b4a);
  color: #eecfa7;
  padding: 0 30rpx 40rpx 30rpx;
  .title {
    font-size: 46rpx;
    font-weight: bold;
    letter-spacing: 0.2ch;
  }
  .desc {
    margin-top: 10rpx;
  }
  .tit2 {
    font-size: 34rpx;
    margin-bottom: 10rpx;
  }
}
.section {
  padding: 30rpx;
  background-color: #fff;
  margin-top: 30rpx;
  .tit {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
}
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .item {
    width: 30%;
    border: 1px solid #f0e9d7;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 240rpx;
    &.checked {
      background-color: #f9f2e2;
    }
    .name {
      font-size: 28rpx;
      margin-bottom: 10rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }
  }
}
.tips {
  text-align: center;
  color: #333;
  text {
    color: #7e9eef;
  }
}
.btn {
  width: 690rpx;
  margin: 0 auto;
  margin-top: 20rpx;
  margin-bottom: 20rpx;
}
</style>
