<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { userApi, orderApi } from '@/api'
import { getImgFullPath, getDistances } from '@/utils/index'

const addressData = ref({})
const orderData = ref({})
async function getAddressList() {
  const { data } = await userApi.getAddressList({
    noPaging: true,
    detail: true
  })
  const defaultAddress = data.find(
    (item: { [x: string]: any }) => item.defaultAddress
  )?.address
  if (defaultAddress) {
    addressData.value = defaultAddress
    orderData.value.addressId = defaultAddress.id
  }
}
async function getOrderMoney() {
  const { data } = await orderApi.orderMoney(orderData.value)
  const { orderMonies, totalMoney, payMoney, money, moneyUnit } = data
  orderData.value.orderMonies = orderMonies
  orderData.value.totalMoney = totalMoney
  orderData.value.payMoney = payMoney
  orderData.value.money = money
  orderData.value.moneyUnit = moneyUnit
}
function toAddressList() {
  uni.navigateTo({
    url: '/pages/addressList/index?type=setAddress',
    success: () => {
      uni.$once('/pages/productCheckout/index', (data: { address: {} }) => {
        console.log('addressData:>>', data)
        setAddress(data)
      })
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function setAddress(data: { address: {} }) {
  addressData.value = data.address
  orderData.value.addressId = data.address.id
  getOrderMoney()
}
defineExpose({
  setAddress,
  addressData
})
// 数量
function numberChange(data) {
  orderData.value.orderProductSkus[data.index].count = data.number
}

// 创建订单
async function creatOrder() {
  const { data } = await orderApi.orderAdd(orderData.value)
  uni.redirectTo({
    url: `/pages/payment/index?order=${JSON.stringify(data)}`
  })
}

function onSubmit() {
  if (!orderData.value.addressId) {
    uni.showToast({
      icon: 'none',
      title: '请填写收货地址！'
    })
    return
  }
  creatOrder()
}

onLoad(async (option) => {
  orderData.value = JSON.parse(option?.orderData)
  console.log( orderData.value)
  await getAddressList()
  await getOrderMoney()
})
</script>
<template>
  <div class="container">
    <!-- 地址 -->
    <view class="address-section" @click="toAddressList">
      <view class="order-content">
        <image
          class="location"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/yue/icon_13.png"
        ></image>
        <view class="cen" v-if="addressData.id">
          <view class="top">
            <text class="name">{{ addressData.name }}</text>
            <text class="mobile">{{ addressData.phone }}</text>
          </view>
          <text class="address"
            >{{ addressData.provinceName }}{{ addressData.cityName
            }}{{ addressData.districtName }} {{ addressData.street }}</text
          >
        </view>
        <view class="cen address-empty" v-else>
          <text>请选择收货地址</text>
        </view>
        <image
          class="rightImg"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
        ></image>
      </view>
      <image
        class="a-bg"
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAAFCAYAAAAaAWmiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Rjk3RjkzMjM2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Rjk3RjkzMjQ2NzMxMTFFOUI4RkU4OEZGMDcxQzgzOEYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOTdGOTMyMTY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOTdGOTMyMjY3MzExMUU5QjhGRTg4RkYwNzFDODM4RiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrEOZlQAAAiuSURBVHjazJp7bFvV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"
      ></image>
    </view>
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
        v-for="item in orderData.orderMonies"
        :key="item.id"
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
          v-model="orderData.remark"
          placeholder="请填写备注信息，150字以内"
          placeholder-class="placeholder"
        />
      </view>
    </view>
    <!-- 底部 -->
    <view class="footer">
      <view class="price-content">
        <text>实付款 </text>
        <text
          class="price-tip"
          v-if="
            orderData.orderProductSkus &&
            !orderData.orderProductSkus[0].moneyUnit
          "
          >￥</text
        >
        <text class="price"
          >{{ orderData.payMoney }}
          <text v-if="orderData.orderProductSkus">{{
            orderData.orderProductSkus[0].moneyUnit
          }}</text></text
        >
      </view>
      <text class="submit" @click="onSubmit">提交订单</text>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.address-section {
  padding: 30rpx 0;
  background: #fff;
  position: relative;
  min-height: 140rpx;
  display: block;
  box-sizing: border-box;
  width: 710rpx;
  margin: 20rpx auto;
  border-radius: 24rpx;
  overflow: hidden;

  .order-content {
    display: flex;
    align-items: center;
  }

  .osx-shouhuodizhi {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90rpx;
    color: #888;
    font-size: 44rpx;
  }
  .location {
    display: inline-block;
    width: 76rpx;
    height: 76rpx;
    padding: 0 22rpx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 32rpx;
    color: #252526;
  }
  .address-empty {
    flex: 1;
    font-size: 32rpx;
    color: #909399;
    text-align: right;
    margin-right: 20rpx;
    line-height: 1;
  }
  .name {
    font-size: 34rpx;
    margin-right: 24rpx;
  }

  .address {
    margin: 12rpx 0 4rpx;
    margin-right: 20rpx;
    color: #626266;
    font-size: 28rpx;
    word-break: break-all;
  }

  .osx-you {
    font-size: 32rpx;
    color: #909399;
    margin-right: 30rpx;
  }
  .rightImg {
    display: inline-block;
    width: 12rpx;
    height: 21rpx;
    margin-right: 20rpx;
    margin-left: 20rpx;
    vertical-align: -1rpx;
  }

  .a-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 8rpx;
  }
}

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
  justify-content: flex-end;
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
}
</style>
