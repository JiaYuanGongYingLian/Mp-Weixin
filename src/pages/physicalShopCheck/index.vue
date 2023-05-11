<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, orderApi, productApi } from '@/api'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const info = reactive({})
const money = ref()
const orderData = ref({})
// 创建订单
async function creatOrder() {
  const { data } = await orderApi.orderAdd(orderData.value)
  uni.redirectTo({
    url: `/pages/payment/index?order=${JSON.stringify(data)}`
  })
}
async function toPayment() {
  if (!money.value) {
    uni.showToast({
      icon: 'none',
      title: '请输入支付金额'
    })
    return
  }
  const { data } = await productApi.getShopProductSkuList({
    detail: false,
    dynamicPrice: true,
    shopId: info.shopId
  })
  if (data.records) {
    const productSku = data.records[0]
    orderData.value.orderProductSkus = [
      {
        count: 1,
        money: money.value,
        shopProductSkuId: productSku.id,
        moneyRuleId: productSku.moneyRuleId,
        dynamicPric: true
      }
    ]
  }
  creatOrder()
}

onLoad(async (option) => {
  const { name, shopId } = option
  info.name = name
  info.shopId = shopId
})
</script>
<template>
  <div class="physicalShopCheck">
    <text class="name">{{ info.name }}</text>
    <view class="inptBox">
      <u-input
        v-model="money"
        type="digit"
        inputmode="decimal"
        focus
        pattern="number"
        placeholder="请输入支付金额"
        input-align="center"
      />
      <text class="unit">(元)</text>
    </view>
    <u-button class="hy-btn" type="primary" ripple @click="toPayment">
      结算
    </u-button>
  </div>
</template>

<style lang="scss" scoped>
.physicalShopCheck {
  padding: 30rpx;
  text-align: center;

  .name {
    font-size: 32rpx;
    font-weight: bold;
  }

  .inptBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0;
    border-top: 1px solid #8080802e;
    border-bottom: 1px solid #8080802e;
    position: relative;
    margin-top: 40rpx;

    .unit {
      position: absolute;
      right: 0;
      top: 36rpx;
    }
  }

  .hy-btn {
    margin-top: 200rpx;
  }
}
</style>
