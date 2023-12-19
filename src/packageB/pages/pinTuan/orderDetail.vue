<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-12-18 13:42:20
 * @LastEditTime: 2023-12-18 22:31:32
 * @LastEditors:  Please set LastEditors
-->
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
const orderData = ref({})
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
const statusMap = {
  20: {
    icon: 'daishouhuo',
    value: 20,
    label: '拼团进行中'
  },
  30: {
    icon: 'daishouhuo',
    value: 30,
    label: '恭喜！您已拼得此商品，商家发货中'
  },
  60: {
    icon: 'yiwancheng',
    value: 60,
    label: '恭喜！，您已拼得此商品，拼团已完成'
  },
  93: {
    icon: 'info-circle',
    value: 93,
    label: '很遗憾，您未拼中'
  }
}
const orderPayInfoCount = ref({})
async function getPayInfo(orderNo: any) {
  const { data } = await orderApi.payInfoInfo({
    orderNo,
    detail: true,
    userId: userStore.userInfo.id,
    otherColumns: 'user,order,completedPayInfos,address',
    orderType: 2 // 拼团
  })
  orderData.value = data
  statusObject.value = statusMap[data.status] || {
    icon: '',
    label: '拼团进行中'
  }
  orderPayInfoCount.value = data.order.orderExternals.find(
    (item) => item.fieldName === 'orderPayInfoCount'
  )
}
function navToProductDetail(data) {
  const { shopId, productId } = data
  uni.navigateTo({
    url: `/packageB/pages/pinTuan/checkout?shopId=${shopId}&productId=${productId}`
  })
}
onLoad((option) => {
  if (option) {
    const { orderNo } = option
    if (orderNo) {
      getPayInfo(orderNo)
    }
  }
})
</script>
<template>
  <view class="container">
    <view class="state-box">
      <u-icon
        custom-prefix="custom-icon"
        :name="statusObject?.icon"
        size="52"
        color="#FEA917"
        class="icon"
      ></u-icon>
      <text class="state"
        >{{ statusObject?.label }}
        {{
          statusObject?.value === 20
            ? `,还差 ${orderPayInfoCount.fieldValue} 人可成团`
            : ''
        }}</text
      >
    </view>
    <!-- 地址 -->
    <view class="address-section section" v-if="orderData?.address">
      <view class="order-content">
        <text class="iconfont hy-icon-address"></text>
        <view class="cen">
          <view class="top">
            <text class="name">{{ orderData?.address?.name }}</text>
            <text class="mobile">{{ orderData?.address?.phone }}</text>
          </view>
          <text class="address"
            >{{
              orderData?.address?.provinceName +
              orderData?.address?.cityName +
              orderData?.address?.districtName +
              orderData?.address?.street
            }}{{ orderData?.address?.other }}</text
          >
        </view>
      </view>
    </view>
    <!-- 商品信息 -->
    <view class="section" style="border-top: 1upx">
      <!-- 商品列表 -->
      <view class="pName"> 拼团商品 </view>
      <view class="g-list">
        <view
          class="g-item"
          v-for="(item, index) in orderData?.order?.orderProductSkus"
          :key="index"
          @click="navToProductDetail(item)"
        >
          <image :src="getImgFullPath(item?.skuImage)"></image>
          <view class="right">
            <view class="cell">
              <text class="title">{{ item?.name }}</text>
            </view>
            <text class="spec">{{ item?.skuName || item.name }}</text>
            <view class="bot">
              <text class="price"
                >{{ item?.money }}{{ item?.moneyUnit || '' }}</text
              >
              <text class="num">x {{ item?.count }}</text>
            </view>
          </view>
        </view>
      </view>
      <!-- 消费明细 -->
      <view class="yh-item" v-if="orderData?.completedPayInfos">
        <view class="tit">拼团用户</view>
        <view class="avatars">
          <image
            v-for="(item, index) in orderData?.completedPayInfos"
            :src="getImgFullPath(item?.user?.avatar)"
            mode="scaleToFill"
            :key="index"
            :style="{ left: index * 40 + 'rpx', zIndex: index }"
          />
        </view>
      </view>
      <view class="yh-item last">
        <text class="tit">实际支付</text>
        <text class="price"
          >{{ orderData.money }}{{ orderData?.order?.moneyUnit || '' }}</text
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

  .pName {
    padding: 0 30rpx;
    font-weight: bold;
    font-size: 30rpx;
  }
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

.yh-item {
  font-size: 26rpx;
  color: #555;
  padding: 30rpx;
  position: relative;

  &.last {
    justify-content: flex-end;
    text-align: right;

    .tit {
      text-align: right;
      margin-right: 20upx;
      font-size: 26rpx;
    }

    .price {
      font-size: 34upx;
      color: red;

      &:before {
        content: '';
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
    font-size: 30rpx;
    font-weight: bold;
  }
}

.avatars {
  padding-left: 50rpx;
  position: relative;
  height: 70rpx;

  image {
    width: 70rpx;
    height: 70rpx;
    border-radius: 50%;
    background-color: #f6f6f6;
    flex-shrink: 0;
    position: absolute;
    left: 0;
    z-index: 0;
  }
}
</style>
