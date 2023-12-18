<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-12-16 17:33:11
 * @LastEditTime: 2023-12-18 21:57:18
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { userApi, orderApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const orderData = ref({})
const orderPayInfoMoney = ref({})
async function getOrderMoney() {
  const { data } = await orderApi.orderMoney(orderData.value)
  const { orderMonies, totalMoney, payMoney, money, moneyUnit } = data
  orderData.value.orderMonies = orderMonies
  orderData.value.totalMoney = totalMoney
  orderData.value.payMoney = payMoney
  orderData.value.money = money
  orderData.value.moneyUnit = moneyUnit
}
// 创建订单
async function creatOrder() {
  uni.redirectTo({
    url: `/packageB/pages/pinTuan/checkout?orderId=${orderData.value.id}`
  })
}

function onSubmit() {
  creatOrder()
}

async function getOrderInfo(orderId) {
  const { data } = await orderApi.orderInfo({
    id: orderId,
    detail: true,
    otherColumns: 'user,order,completedPayInfos',
    orderType: 2 // 拼团
  })
  orderData.value = data
  orderPayInfoMoney.value = orderData.value.orderExternals.find((item) => {
    return item.fieldName === 'orderPayInfoMoney'
  })
}

onLoad(async (option) => {
  if (option?.orderId) {
    await getOrderInfo(option?.orderId)
    await getOrderMoney()
  }
})
</script>
<template>
  <div class="container">
    <view class="goods-section">
      <!-- 商品列表 -->
      <view
        class="g-item"
        v-for="item in orderData.orderProductSkus"
        :key="item.id"
      >
        <image :src="getImgFullPath(item.skuImage)"></image>
        <view class="right">
          <view class="title-wrapper">
            <text class="title clamp">{{ item.name }}</text>
          </view>
          <view class="spec">{{ item.skuName }}</view>
          <view class="price-box">
            <text class="price">{{ item.money }} {{ item.moneyUnit }}</text>
            <text class="number">x {{ item.count }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 金额明细 -->
    <view class="yt-list">
      <view
        class="yt-list-cell"
        v-for="(item, index) in orderData.orderMonies"
        :key="index"
      >
        <text class="cell-tit clamp">{{ item.name }}</text>
        <text class="cell-tip num">{{ item.money }}</text>
      </view>
      <view class="yt-list-cell">
        <text class="cell-tit clamp">运费</text>
        <text class="cell-tip num">{{ '免运费' }}</text>
      </view>
      <view class="yt-list-cell desc-cell">
        <text class="cell-tit clamp">备注信息</text>
        <input
          class="desc"
          type="text"
          maxlength="150"
          disabled
          v-model="orderData.remark"
          placeholder=""
          placeholder-class="placeholder"
        />
      </view>
    </view>
    <view class="yt-list">
      <view class="yt-list-cell">
        <text class="cell-tit clamp">拼团价</text>
        <text class="cell-tip num red"
          >{{ orderPayInfoMoney.fieldValue }} 积分</text
        >
      </view>
    </view>
    <!-- 底部 -->
    <view class="footer">
      <view class="avatars">
        <image
          v-for="(item, index) in orderData?.completedPayInfos"
          :src="getImgFullPath(item?.user?.avatar)"
          mode="scaleToFill"
          :key="index"
          :style="{ left: index * 40 + 'rpx', zIndex: index }"
        />
      </view>
      <text class="submit" @click="onSubmit">立即拼团</text>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.goods-section {
  width: 710rpx;
  margin: 20rpx auto;
  box-sizing: border-box;
  background: #fff;
  border-radius: 24rpx;

  .g-header {
    display: flex;
    align-items: center;
    height: 84rpx;
    padding: 0 30rpx;
    position: relative;
  }

  .logo {
    display: block;
    width: 50rpx;
    height: 50rpx;
    border-radius: 100px;
  }

  .name {
    font-size: 30rpx;
    color: #606266;
    margin-left: 24rpx;
  }

  .g-item {
    display: flex;
    padding: 40rpx 30rpx;

    image {
      flex-shrink: 0;
      display: block;
      width: 140rpx;
      height: 140rpx;
      border-radius: 4rpx;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      flex: 1;
      padding-left: 24rpx;
      overflow: hidden;
    }

    .title-wrapper {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #f92c1d;
    }

    .tag {
      flex-shrink: 0;
    }

    .title {
      font-size: 30rpx;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .spec {
      font-size: 26rpx;
      color: #909399;
      line-height: 50rpx;
      height: 50rpx;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
      overflow: hidden;
    }

    .price-box {
      display: flex;
      align-items: center;

      .price {
        font-size: 36rpx;
        color: #ec4738;
        font-weight: bold;

        .unit {
          font-size: 28rpx;
        }
      }

      .number {
        font-size: 26rpx;
        color: #939399;
        margin-left: 20rpx;
      }
    }

    .step-box {
      position: relative;
    }
  }
}

.yt-list {
  margin: 20rpx auto;
  background: #fff;
  border-radius: 24rpx;
  width: 710rpx;
}

.yt-list-cell {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  position: relative;

  &.cell-hover {
    background: #fafafa;
  }

  .cell-icon {
    height: 32rpx;
    width: 32rpx;
    font-size: 22rpx;
    color: #fff;
    text-align: center;
    line-height: 32rpx;
    background: #f85e52;
    border-radius: 8rpx;
    margin-right: 12rpx;

    &.hb {
      background: #ffaa0e;
    }

    &.lpk {
      background: #3ab54a;
    }
  }

  .cell-more {
    align-self: center;
    font-size: 24rpx;
    color: #909399;
    margin-left: 8rpx;
    margin-right: -10rpx;
  }

  .cell-tit {
    flex: 1;
    font-size: 26rpx;
    color: #909399;
    margin-right: 10rpx;
  }

  .cell-tip {
    font-size: 26rpx;
    color: #303133;

    &.disabled {
      color: #909399;
    }

    &.active {
      color: #ec4738;
      font-weight: bold;
      font-size: 26rpx;
    }

    &.red {
      color: #ec4738;
      font-size: 26rpx;
      font-weight: bold;
    }

    &.num {
      color: #252526;
      font-size: 26rpx;
      font-weight: bold;
    }
  }

  &.desc-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    border-bottom: none;

    .desc {
      width: 490rpx;
      color: #252526;
      font-size: 26rpx;
      text-align: right;
    }
  }
}

.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
  padding: 10rpx 30rpx;
  background-color: #fff;
  z-index: 99;
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));

  .price-content {
    color: #252526;
    font-size: 32rpx;
  }

  .price-tip {
    color: #ec4738;
    font-size: 32rpx;
  }

  .price {
    font-size: 36rpx;
    color: #ec4738;
    font-weight: bold;

    .unit {
      font-size: 28rpx;
    }
  }

  .submit {
    width: 230rpx;
    height: 78rpx;
    line-height: 78rpx;
    border-radius: 39rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    background-color: #f74e3f;
    margin-left: 30rpx;
  }
  .avatars {
    padding-left: 50rpx;
    position: relative;
    height: 70rpx;
    width: 350rpx;
    overflow: hidden;
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
}
</style>
