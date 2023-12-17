<!-- eslint-disable consistent-return -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-14 15:17:59
 * @LastEditTime: 2023-12-12 11:54:29
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
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
const account = ref()
const clickable = computed(() => {
  return account.value
})
async function getProduct() {
  const { data } = await productApi.getShopProductList({
    noPaging: true,
    detail: false,
    shopId,
    shopType: 3,
    dynamicPrice: false
  })
  productList.value = data
  productList.value.forEach((product, index) => {
    getSkuList(product)
    if (product.name.indexOf('电') > -1) {
      product.placeholder = '请输入用电户号'
    } else if (product.name.indexOf('气') > -1) {
      product.placeholder = '请输入燃气户号'
    } else if (product.name.indexOf('话费') > -1) {
      product.placeholder = '请输入手机号码'
      swiperCurrent.value = index
      current.value = index
      account.value =
        uni.getStorageSync('lastPhone') || userStore.userInfo.phone
    } else {
      account.value = ''
    }
  })
}
function reset(product: { name: string | string[] }) {
  if (product.name.indexOf('电') > -1) {
    account.value = uni.getStorageSync('lasteAcount') || ''
  } else if (product.name.indexOf('气') > -1) {
    account.value = uni.getStorageSync('lastgAcount') || ''
  } else if (product.name.indexOf('话费') > -1) {
    account.value = uni.getStorageSync('lastPhone') || userStore.userInfo.phone
  } else {
    account.value = ''
  }
}
async function getSkuList(product: never) {
  const { data } = await productApi.getShopProductSkuList({
    noPaging: true,
    detail: true,
    shopType: 3,
    shopId,
    productId: product.productId
  })
  data.sort((a: { money: number }, b: { money: number }) => {
    return a.money - b.money
  })
  product.sku = data || []
}
function tabsChange(index: number) {
  swiperCurrent.value = index
  reset(productList.value[index])
}
function transition(e: { detail: { dx: any } }) {
  const { dx } = e.detail
  tabsRef.value.setDx(dx)
}
function animationfinish(e: { detail: { current: number } }) {
  tabsRef.value.setFinishCurrent(e.detail.current)
  swiperCurrent.value = e.detail.current
  current.value = e.detail.current
}
function cardClick(index: number) {
  if (!clickable.value) {
    uni.showToast({
      icon: 'none',
      title: `请输入正确的${productList.value[
        current.value
      ].placeholder.substring(3)}`
    })
    return false
  }
  uni.showModal({
    title: '请确认充值账户',
    content: `${account.value}\r\n 充值成功后无法退款`,
    cancelText: '取消充值',
    confirmText: '确认充值',
    success: ({ confirm, cancel }) => {
      if (confirm) {
        submit(index)
      }
    }
  })
}
const submit = async (i: number) => {
  const orderData = {
    orderProductSkus: [
      {
        count: 1,
        shopProductSkuId: productList.value[current.value]?.sku[i].id,
        externalData: {
          account: account.value
        }
      }
    ],
    detail: true
  }
  const { data } = await orderApi.orderAdd(orderData)
  uni.setStorageSync('orderJson', JSON.stringify(data))
  uni.navigateTo({
    url: '/packageA/pages/payment/index?order=true'
  })
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
    <view class="intro">
      <view class="title">开心家园便捷生活服务</view>
      <view class="desc">省心、省时、省力</view>
      <u-gap height="30"></u-gap>
      <!-- <view class="tit2"> 不定时开放优惠套餐 </view> -->
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
      style="height: 700rpx"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in productList"
        :key="index"
      >
        <view class="section">
          <view class="inpt">
            <view style="flex: 1">
              <u-input
                v-model="account"
                :placeholder="item.placeholder"
                :border="false"
                height="100rpx"
                placeholder-style="
                  fontWeight: bold;
                  fontSize: 40rpx;
                  letterSpacing: 0.1ch
                "
              />
            </view>

            <u-icon name="edit-pen" size="38" color="#ccc"></u-icon>
          </view>

          <view class="tit">选择金额</view>
          <view class="card">
            <view
              class="item"
              v-for="(s, index) in item.sku"
              :key="index"
              :class="{ able: clickable }"
              @click="cardClick(index)"
            >
              <!-- <view class="name">{{ s.name }}</view> -->
              <view class="price">
                <text>{{ s.money }}</text
                >元</view
              >
            </view>
          </view>
        </view>
        <view class="remark">{{ item.remark }}</view>
      </swiper-item>
    </swiper>
    <!-- <u-button
      type="primary"
      class="hy-btn btn"
      shape="circle"
      ripple
      @click="submit"
    >
      立即购买
    </u-button> -->
  </div>
</template>

<style lang="scss" scoped>
.intro {
  background-image: linear-gradient(to right, #484b5c, #515365, #2f3b4a);
  color: #eecfa7;
  padding: 20rpx 30rpx 40rpx 30rpx;
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
  padding-top: 60rpx;
  .tit {
    font-size: 30rpx;
    font-weight: bold;
    margin-bottom: 30rpx;
  }
  .inpt {
    display: flex;
    align-items: center;
    border-bottom: 4rpx solid #ccc;
    padding-bottom: 16rpx;
    margin-bottom: 30rpx;
    :deep(.u-input) {
      input {
        font-size: 40rpx;
        font-weight: bold;
      }
    }
  }
}
.card {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 30rpx;
  .item {
    width: 30%;
    border: 1px solid #f5f5f5;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100rpx;
    color: #bbb;
    &.able {
      background-color: #f5f5f5;
      color: #333;
    }
    .name {
      font-size: 28rpx;
      margin-bottom: 10rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
    }
    .price {
      font-size: 30rpx;
      text {
        font-size: 36rpx;
        font-weight: bold;
      }
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
:deep(.uni-modal) {
  .uni-modal__bd {
    color: #333;
    font-size: 30rpx;
    font-weight: bold;
  }
}
.remark {
  padding: 30rpx;
  font-size: 24rpx;
  color: #f90;

}
</style>
