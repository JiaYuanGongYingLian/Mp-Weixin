<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-14 15:17:59
 * @LastEditTime: 2023-11-15 17:48:54
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, orderApi, productApi } from '@/api'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { currentShop, myShopList } = storeToRefs(userStore)
const vipList = ref([])
async function getVipList() {
  const { data } = await productApi.getShopProductSkuList({
    noPaging: true,
    detail: false,
    shopType: 3,
    shopId: 1002,
    productId: 100002981
  })
  if (data && data.length > 0) {
    data.forEach((e: { select: boolean }) => {
      e.select = false
    })
    data[0].select = true
    vipList.value = data
  }
}
const showPicker = ref(false)
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
            shopId: currentShop.value.id
          }
        }
      ],
      detail: true
    }
    const { data } = await orderApi.orderAdd(orderData)
    uni.navigateTo({
      url: `/pages/payment/index?order=${JSON.stringify(data)}`
    })
  }
}
function changeShop(e: any[]) {
  const i = e[0]
  const shop = myShopList.value[i]
  userStore.syncSetCurrentShop(shop)
}
onLoad((option) => {
  getVipList()
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
      <view class="title">黑银商家VIP会员卡</view>
      <!-- <view class="desc">开心会员,是一个生活投资</view>
      <u-gap height="30"></u-gap>
      <view class="tit2">
        每周免费领<text style="font-weight: bold">3000元</text>红包</view
      >
      <view>100张x￥20/￥50/￥100</view>
      <view>100张x￥2/￥5/￥10</view> -->
    </view>
    <view>
      <view class="topName" @click="showPicker = true">
        <view class="leftName">{{ currentShop.name }} </view>
        <view>
          <u-button
            size="mini"
            type="error"
            shape="circle"
            ripple
            @click="showPicker = true"
            >切换</u-button
          >
        </view>
      </view>
      <u-picker
        mode="selector"
        v-model="showPicker"
        :default-selector="[0]"
        :range="myShopList"
        @confirm="changeShop"
        range-key="name"
      ></u-picker>
    </view>
    <view class="section">
      <view class="tit">选择会员卡套餐</view>
      <view class="card">
        <view
          class="item"
          v-for="(item, index) in vipList"
          :key="index"
          :class="{ checked: item.select }"
          @click="cardClick(index)"
        >
          <view class="name">{{ item.name }}</view>
          <view class="price"> ￥{{ item.money }}</view>
        </view>
      </view>
    </view>
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
.topName {
  font-size: 30rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 20rpx 0 20rpx;
  .leftName {
    font-weight: bold;
  }
}
</style>
