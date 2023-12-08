<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { orderApi } from '@/api'
import { getImgFullPath, dateFormat } from '@/utils/index'
import $orderStatus from '@/utils/order'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const orderData = ref({
  address: {}
})
const baseUrl = 'https://osx.yishengyue.cn/'
const orderImgs = {
  notSend: `${baseUrl}/public/frontend/orders/not-send.gif`,
  wasSend: `${baseUrl}/public/frontend/orders/was-send.gif`,
  notPay: `${baseUrl}/public/frontend/orders/not-pay.gif`,
  wasDown: `${baseUrl}/public/frontend/orders/was-down.gif`,
  notAssess: `${baseUrl}/public/frontend/orders/not-assess.gif`
}
const statusObject = ref({})
const navBackground = {
  backgroundColor: '#E93526'
}
async function getOderInfo(id: any) {
  const { data } = await orderApi.orderInfo({
    id,
    detail: true
  })
  orderData.value = data
  statusObject.value = $orderStatus.getOrderStatus(data.status)
  switch (data.status) {
    case 90:
      statusObject.value.status_pic = orderImgs.notAssess
      break
    default:
      statusObject.value.status_pic = orderImgs.wasDown
  }
}
function navToProductDetail(data) {
  const { shopId, productId } = data
  uni.navigateTo({
    url: `/packageA/pages/productDetail/index?shopId=${shopId}&productId=${productId}`
  })
}
onLoad((option) => {
  if (option) {
    const { orderId } = option
    if (orderId) {
      getOderInfo(option.orderId)
    }
  }
})
</script>
<template>
  <view class="container">
    <u-navbar
      back-text=""
      title="订单详情"
      :title-bold="true"
      v-if="!userStore.isWeChatBrowser"
      color="#fff"
      :background="navBackground"
      title-color="#fff"
      :border-bottom="false"
      back-icon-color="#fff"
    ></u-navbar>
    <view class="state-box">
      <image
        v-if="statusObject.status_pic != ''"
        class="state-pic"
        :src="statusObject.status_pic"
      ></image>
      <text class="state">{{ statusObject.name }}</text>
    </view>
    <!-- 地址 -->
    <view class="address-section section" v-if="orderData.address">
      <view class="order-content">
        <text class="iconfont hy-icon-address"></text>
        <view class="cen">
          <view class="top">
            <text class="name">{{ orderData.address.name }}</text>
            <text class="mobile">{{ orderData.address.phone }}</text>
          </view>
          <text class="address"
            >{{
              orderData.address.provinceName +
              orderData.address.cityName +
              orderData.address.districtName +
              orderData.address.street
            }}{{ orderData.address.other }}</text
          >
        </view>
      </view>
    </view>
    <!-- 商品信息 -->
    <view class="section" style="border-top: 1upx">
      <!-- 商品列表 -->
      <view class="g-list">
        <view
          class="g-item"
          v-for="(item, index) in orderData.orderProductSkus"
          :key="index"
          @click="navToProductDetail(item)"
        >
          <image :src="getImgFullPath(item.skuImage)"></image>
          <view class="right">
            <view class="cell">
              <text class="title">{{ item.name }}</text>
            </view>
            <text class="spec">{{
              item.skuName ? item.skuName : item.name
            }}</text>
            <view class="bot">
              <text class="price"
                >{{ item.moneyUnit ? '' : '￥' }}{{ item.money
                }}{{ item.moneyUnit ? item.moneyUnit : '元' }}</text
              >
              <text class="num">x {{ item.count }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 消费明细 -->
      <!-- <view class="yh-item">
        <text class="tit">运费</text>
        <text class="price">￥{{ orderData.pay_postage | price }}元</text>
      </view> -->
      <view class="yh-item last">
        <text class="tit">实际支付</text>
        <text class="price"
          >{{ orderData.totalMoney
          }}{{ orderData.moneyUnit ? orderData.moneyUnit : '元' }}</text
        >
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  // padding: 0 20rpx;
}
.section {
  padding: 30rpx 0;
  background: #fff;
  margin-top: 16rpx;
}
.state-box {
  display: flex;
  align-items: center;
  height: 150rpx;
  padding-left: 30rpx;
  background: #e93323;

  .state {
    font-size: 30rpx;
    margin-bottom: 8rpx;
    margin-left: 24rpx;
    color: #fff;
  }

  .state-pic {
    width: 100rpx;
    height: 100rpx;
  }
}
.address-section {
  padding: 30rpx 0;
  background: #fff;
  position: relative;

  .order-content {
    display: flex;
    align-items: center;
  }

  .hy-icon-address {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90rpx;
    color: #888;
    font-size: 44rpx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 28rpx;
    color: #333;
    position: relative;
    padding-right: 30upx;
  }

  .name {
    font-size: 30rpx;
    margin-right: 24rpx;
  }

  .address {
    margin-top: 16rpx;
    color: #909090;
  }
}
.g-list {
  background: #fff;
}

.g-item {
  display: flex;
  padding: 24upx 30upx;
  position: relative;

  &:last-child:after {
    border: 0;
  }

  image {
    flex-shrink: 0;
    display: block;
    width: 138upx;
    height: 138upx;
    border-radius: 4px;
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: column;
    padding-left: 24upx;
    overflow: hidden;
  }

  .cell {
    display: flex;
    align-items: center;
    font-size: 26upx;
    color: #909399;
  }

  .tag {
    flex-shrink: 0;
    font-size: 28rpx;
    color: #f92c1d;
  }

  .title {
    font-size: 30upx;
    color: #303133;
    flex: 1;
  }

  .spec {
    font-size: 24upx;
    color: #909399;
    margin-right: 16upx;
    margin-top: 8upx;
    min-height: 32upx;
  }

  .bot {
    display: flex;
    align-items: flex-end;
    font-size: 26upx;
    color: #909399;
    margin-top: 6upx;
  }

  .price {
    font-size: 30upx;
    color: #303133;
    margin-right: 20upx;
  }

  .num {
    flex: 1;
  }

  .eva-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24upx;
    height: 52upx;
    align-items: center;
    justify-content: center;
    border-radius: 100px;
    border-width: 1px;
    border-style: solid;
    border-color: #d6d6d6;
    margin-left: 20upx;
    font-size: 26upx;
    color: #333;

    &.active {
      color: red;
      border-color: #fdb1ac;
    }
  }
}

/* 优惠消费明细 */
.yh-item {
  display: flex;
  align-items: center;
  height: 80upx;
  font-size: 26upx;
  color: #555;
  padding: 0 30upx;
  position: relative;

  &.last {
    justify-content: flex-end;

    .tit {
      text-align: right;
      margin-right: 20upx;
    }

    .price {
      font-size: 34upx;
      color: red;

      &:before {
        content: '￥';
        font-size: 24upx;
      }
    }
  }

  &:after {
    content: '';
    position: absolute;
    left: 30upx;
    right: 30upx;
    top: 0;
    border-top: 1px dashed #ddd;
    transform: scaleY(0.5);
  }

  .tit {
    flex: 1;
  }
}
</style>
