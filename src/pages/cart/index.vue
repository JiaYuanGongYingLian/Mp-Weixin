<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const storeUser = useUserStore()
const { hasLogin, userInfo } = storeToRefs(storeUser)
const cartList = ref()
const allChecked = ref(false) // 全选状态  true|false
const empty = ref(false) // 空白页现实  true|false
const totalMoney = ref(0) // 总金额
const money = ref(0) // 价格
async function loadData() {
  try {
    const { data } = await productApi.productCartList({
      userId: userInfo.value.id,
      detail: true,
      noPaging: true
    })
    data.forEach((item: { count: number; selected: boolean }) => {
      if (!item.count) {
        item.count = 1
        item.selected = false
      }
    })
    cartList.value = data
    calcTotal()
    uni.$emit('cartNum', cartList.value.length)
  } catch (err) {
    console.log(err)
  }
}
function toLogin() {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}
// 更新购物车
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
  // loadData()
}
// 单选
function click_btnSelectedItem(product: { selected: boolean; id: any }) {
  cartList.value.forEach((item: { selected: boolean }) => {
    item.selected = false
  })
  product.selected = !product.selected
  // productCartUpdate(item)
  calcTotal()
}
// 全选
function click_btnSelectedAll() {
  allChecked.value = !allChecked.value
  const selected = !allChecked.value
  // productCartUpdate({ id: null, selected })
  cartList.value.forEach((item: { selected: boolean }) => {
    item.selected = allChecked.value
  })
  calcTotal()
}
// 数量
function numberChange(data: { index: string | number; value: any }) {
  const item = cartList.value[data.index]
  item.count = data.value
  productCartUpdate(item)
  calcTotal()
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
  let selected = true
  list.forEach((item: any) => {
    if (item.selected === true) {
      totalMoneyTemp += item.shopProductSku.money * item.count
    } else if (selected === true) {
      selected = false
    }
  })
  allChecked.value = selected
  totalMoney.value = Number(totalMoneyTemp.toFixed(2))
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
      name: shopProductSku.name,
      skuName: shopProductSku.name,
      skuImage: shopProductSku.productSku.image,
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
function back() {
  uni.navigateBack()
}
onShow((option) => {
  loadData()
})
</script>
<template>
  <view class="container">
    <!-- 空白页 -->
    <view v-if="!hasLogin || empty === true" class="empty">
      <u-empty text="购物车为空" mode="car"> </u-empty>
      <!-- <u-button type="primary" size="mini" @click="back">返回上一页</u-button> -->
    </view>
    <view v-else>
      <!-- 列表 -->
      <view class="cart-list">
        <block v-for="(item, index) in cartList" :key="item.id">
          <view class="cart-item">
            <view class="image-wrapper">
              <image
                class="radio"
                @click="click_btnSelectedItem(item)"
                :src="`https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/${
                  item.selected ? 'carChecked' : 'carNoChecked'
                }.png`"
              ></image>
              <image
                class="image"
                :src="getImgFullPath(item.shopProductSku?.productSku?.image)"
                mode="aspectFill"
              />
            </view>
            <view class="item-right">
              <text class="title">{{ item.shopProductSku?.name }}</text>
              <text class="attr">{{
                item.shopProductSku?.productSku?.name
              }}</text>
              <view class="price red">
                <view class="money">
                  <text
                    class="unit l"
                    v-if="!item.shopProductSku?.shopProductSkuWalletRules"
                    >¥</text
                  >
                  <text> {{ ' ' + item.shopProductSku?.money }} </text>
                  <text
                    class="unit r"
                    v-if="item.shopProductSku?.shopProductSkuWalletRules"
                    >{{
                      item.shopProductSku?.shopProductSkuWalletRules[0]
                        ?.moneyUnit
                    }}</text
                  >
                </view>
                <u-number-box
                  class="step"
                  :min="1"
                  :max="item.shopProductSku?.productSku?.count"
                  v-model="item.count"
                  :index="index"
                  @change="numberChange"
                  size="20"
                ></u-number-box>
              </view>
            </view>
            <text
              class="iconfont hy-icon-delete"
              @click="deleteCartItem(item)"
            ></text>
          </view>
        </block>
      </view>
      <!-- 底部菜单栏 -->
      <view class="action-section">
        <view class="checkbox">
          <!-- <image
            :src="`https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/${
              allChecked ? 'carChecked' : 'carNoChecked'
            }.png`"
            mode="aspectFit"
            @click="click_btnSelectedAll()"
          ></image>
          <view
            class="clear-btn"
            :class="{ show: allChecked }"
            @click="clearCart"
          >
            清空
          </view> -->
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
    <hy-tabbar></hy-tabbar>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.container {
  padding: 30rpx;
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
  padding: 30rpx 20rpx;
  background-color: #fff;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
  align-items: center;
  .image-wrapper {
    flex-shrink: 0;
    position: relative;
    padding-left: 58rpx;
    .radio {
      display: block;
      width: 42rpx;
      height: 42rpx;
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -22rpx;
    }
    .image {
      border-radius: 8rpx;
      width: 160rpx;
      height: 160rpx;
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
    padding-left: 20rpx;
    .title {
      font-size: $uni-font-size-base + 2rpx;
      color: $uni-text-color-dark;
      line-height: 40rpx;
    }
    .price {
      font-size: $uni-font-size-base + 2rpx;
      color: $uni-text-color-dark;
      font-weight: bold;
      margin-top: 10rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .money {
        flex-shrink: 0;
      }
      .unit {
        font-weight: normal;
        flex-shrink: 0;
        font-size: 22rpx;
        &.r {
          margin-left: 8rpx;
        }
      }
      .step {
        margin-left: 20rpx;
      }
    }
    .red {
      color: red;
    }
    .attr {
      font-size: $uni-font-size-sm + 2rpx;
      color: $uni-text-color-light;
      margin-top: 10rpx;
      @include ellipsis(2);
    }
  }
  .hy-icon-delete {
    font-size: 36rpx;
    align-self: start;
  }
}
/* 底部栏 */
.action-section {
  /* #ifdef H5 */
  margin-bottom: env(safe-area-inset-bottom);
  /* #endif */
  position: fixed;
  left: 0;
  bottom: 90rpx;
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
      color: $uni-text-color-red;
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
