<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistances } from '@/utils/index'
import { useUserStore } from '@/store'

const storeUser = useUserStore()
const { hasLogin } = storeToRefs(storeUser)
const cartList = ref()
const allChecked = ref(false) // 全选状态  true|false
const empty = ref(false) // 空白页现实  true|false
const totalMoney = ref(0) // 总金额
const money = ref(0) // 价格
async function loadData() {
  try {
    const { data } = await productApi.productCartList({
      detail: true,
      noPaging: true
    })
    cartList.value = data
  } catch (err) {
    console.log(err)
  }
}
function toLogin() {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}
// 选中状态处理
async function productCartUpdate(item: {
  id: any
  selected: any
  count?: any
}) {
  uni.showLoading({ title: '请稍后' })
  await productApi.productCartUpdate({
    id: item.id,
    selected: item.selected,
    count: item.count
  })
  uni.hideLoading()
  loadData()
}
// 单选
function click_btnSelectedItem(item: { selected: boolean; id: any }) {
  item.selected = !item.selected
  productCartUpdate(item)
}
// 全选
function click_btnSelectedAll() {
  const selected = !allChecked.value
  productCartUpdate({ id: null, selected })
}
// 数量
function numberChange(data: { index: string | number; number: any }) {
  const item = cartList.value[data.index]
  item.count = data.number
  productCartUpdate({ id: item.id, selected: null, count: item.count })
}
// 删除
function deleteCartItem(item) {
  uni.showModal({
    content: '确定删除？',
    success: async (e) => {
      if (e.confirm) {
        uni.showLoading({ title: '请稍后' })
        await productApi.productCartDelete({
          id: item.id
        })
        uni.hideLoading()
        loadData()
      }
    }
  })
}
// 清空
function clearCart() {
  uni.showModal({
    content: '清空购物车？',
    success: async (e) => {
      if (e.confirm) {
        uni.showLoading({ title: '请稍后' })
        await productApi.productCartDelete({})
        uni.hideLoading()
        loadData()
      }
    }
  })
}
// 计算总价
function calcTotal() {
  const list = cartList.value
  if (list.length === 0) {
    empty.value = true
    return
  }
  let totalMoneyTemp = 0
  let moneyTemp = 0
  let selected = true
  list.forEach((item: any) => {
    if (item.selected === true) {
      totalMoneyTemp += item.totalMoneyTemp * item.count
      moneyTemp += item.money * item.count
    } else if (selected === true) {
      selected = false
    }
  })
  allChecked.value = selected
  totalMoney.value = Number(totalMoneyTemp.toFixed(2))
  money.value = Number(moneyTemp.toFixed(2))
}
// 创建订单
function createOrder() {
  if (!cartList.value || !cartList.value.length) return
  const order = { orderProductSkus: [], status: 0 }
  for (let i = 0; i < cartList.value.length; i += 1) {
    const cartItem = cartList.value[i]
    if (!cartItem.selected) continue
    const { shopProductSku } = cartItem
    if (!shopProductSku) continue
    let shopProductSkuWalletRule = {}
    if (shopProductSku.shopProductSkuWalletRules) {
      shopProductSku.shopProductSkuWalletRules.forEach((item) => {
        if (item.uniqueness) {
          shopProductSkuWalletRule = item
        }
      })
    }
    const orderProductSku = {
      shopProductSku,
      name: cartItem.name,
      skuName: cartItem.skuName,
      skuImage: cartItem.skuImage,
      money: shopProductSku.money,
      moneyUnit: shopProductSkuWalletRule.moneyUnit,
      count: cartItem.count,
      shopProductSkuId: cartItem.shopProductSkuId,
      cartId: cartItem.id,
      status: 0
    }
    order.orderProductSkus.push(orderProductSku)
  }
  if (order.orderProductSkus.length <= 0) {
    uni.showToast({
      icon: 'none',
      title: '请选择商品！'
    })
    return
  }
  const orderJson = JSON.stringify(order)
  uni.navigateTo({
    url: `/pages/productCheckout/index?orderData=${orderJson}`
  })
}
onLoad((option) => {
  loadData()
})
</script>
<template>
  <div class="container">
    <!-- 空白页 -->
    <view v-if="!hasLogin || empty === true" class="empty">
      <image src="/static/emptyCart.jpg" mode="aspectFit"></image>
      <view v-if="hasLogin" class="empty-tips"> 空空如也 </view>
      <view v-else class="empty-tips">
        空空如也
        <view class="navigator" @click="toLogin">去登陆></view>
      </view>
    </view>
    <view v-else>
      <!-- 列表 -->
      <view class="cart-list">
        <block v-for="(item, index) in cartList" :key="item.id">
          <view
            class="cart-item"
            :class="{ 'b-b': index !== cartList.length - 1 }"
          >
            <view class="image-wrapper">
              <image
                class="loaded"
                :src="getImgFullPath(item.skuImage)"
                mode="aspectFill"
              />
              <view
                class="yticon icon-xuanzhong2 checkbox"
                :class="{ checked: item.selected }"
                @click="click_btnSelectedItem(item)"
              ></view>
            </view>
            <view class="item-right">
              <text class="clamp title">{{ item.name }}</text>
              <text class="attr">{{ item.skuName }}</text>
              <text class="price">¥{{ item.money }}</text>
              <text class="price red">{{
                item.installationMoney
                  ? `安装费：¥${item.installationMoney}`
                  : ''
              }}</text>
              <uni-number-box
                class="step"
                :min="1"
                :max="item.skuCount"
                :value="item.count > item.skuCount ? item.skuCount : item.count"
                :isMax="item.count >= item.skuCount ? true : false"
                :isMin="item.count === 1"
                :index="index"
                @eventChange="numberChange"
              ></uni-number-box>
            </view>
            <text
              class="del-btn yticon icon-fork"
              @click="deleteCartItem(item)"
            ></text>
          </view>
        </block>
      </view>
      <!-- 底部菜单栏 -->
      <view class="action-section">
        <view class="checkbox">
          <image
            :src="allChecked ? '/static/selected.png' : '/static/select.png'"
            mode="aspectFit"
            @click="click_btnSelectedAll()"
          ></image>
          <view
            class="clear-btn"
            :class="{ show: allChecked }"
            @click="clearCart"
          >
            清空
          </view>
        </view>
        <view class="total-box">
          <text class="price">{{ totalMoney ? `¥${totalMoney}` : '' }}</text>
          <!-- <text class="coupon">
						已优惠
						<text>74.35</text>
						元
					</text> -->
        </view>
        <button
          type="primary"
          class="no-border confirm-btn"
          @click="createOrder"
        >
          去结算
        </button>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding-bottom: 134rpx;
  /* 空白页 */
  .empty {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100vh;
    padding-bottom: 100rpx;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    background: #fff;
    image {
      width: 240rpx;
      height: 160rpx;
      margin-bottom: 30rpx;
    }
    .empty-tips {
      display: flex;
      font-size: $uni-font-size-sm + 2rpx;
      color: $uni-text-color-disable;
      .navigator {
        color: $uni-text-color-primary;
        margin-left: 16rpx;
      }
    }
  }
}
/* 购物车列表项 */
.cart-item {
  display: flex;
  position: relative;
  padding: 30rpx 40rpx;
  .image-wrapper {
    width: 230rpx;
    height: 230rpx;
    flex-shrink: 0;
    position: relative;
    image {
      border-radius: 8rpx;
    }
  }
  .checkbox {
    position: absolute;
    left: -16rpx;
    top: -16rpx;
    z-index: 8;
    font-size: 44rpx;
    line-height: 1;
    padding: 4rpx;
    color: $uni-text-color-disable;
    background: #fff;
    border-radius: 50px;
  }
  .item-right {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    position: relative;
    padding-left: 30rpx;
    .title {
      font-size: $uni-font-size-base + 2rpx;
      color: $uni-text-color-dark;
      height: 40rpx;
      line-height: 40rpx;
    }
    .price {
      font-size: $uni-font-size-base - 2rpx;
      color: $uni-text-color-dark;
      height: 35rpx;
      line-height: 35rpx;
    }
    .red {
      color: red;
    }
    .attr {
      font-size: $uni-font-size-sm + 2rpx;
      color: $uni-text-color-light;
      height: 40rpx;
      line-height: 40rpx;
    }
  }
  .del-btn {
    padding: 4rpx 10rpx;
    font-size: 34rpx;
    height: 50rpx;
    color: $uni-text-color-light;
  }
}
/* 底部栏 */
.action-section {
  /* #ifdef H5 */
  margin-bottom: 100rpx;
  /* #endif */
  position: fixed;
  left: 0;
  bottom: 0rpx;
  z-index: 95;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100rpx;
  padding: 0 30rpx;
  background: rgba(255, 255, 255, 0.9);
  .checkbox {
    height: 52rpx;
    position: relative;
    image {
      width: 52rpx;
      height: 100%;
      position: relative;
      z-index: 5;
    }
  }
  .clear-btn {
    position: absolute;
    left: 26rpx;
    top: 0;
    z-index: 4;
    width: 0;
    height: 52rpx;
    line-height: 52rpx;
    padding-left: 38rpx;
    font-size: $uni-font-size-base;
    color: #fff;
    background: $uni-text-color-disable;
    border-radius: 0 50px 50px 0;
    opacity: 0;
    transition: 0.2s;
    &.show {
      opacity: 1;
      width: 120rpx;
    }
  }
  .total-box {
    flex: 1;
    display: flex;
    flex-direction: column;
    text-align: right;
    padding-right: 40rpx;
    .price {
      font-size: $uni-font-size-lg;
      color: $uni-text-color-dark;
    }
    .coupon {
      font-size: $uni-font-size-sm;
      color: $uni-text-color-light;
      text {
        color: $uni-text-color-dark;
      }
    }
  }
  .confirm-btn {
    padding: 0 38rpx;
    margin: 0;
    border-radius: 100px;
    height: 76rpx;
    line-height: 76rpx;
    font-size: $uni-font-size-base + 2rpx;
    background-color: #f74e3f;
  }
}
/* 复选框选中状态 */
.action-section .checkbox.checked,
.cart-item .checkbox.checked {
  color: $uni-color-primary;
}
</style>
