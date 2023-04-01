<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistances } from '@/utils/index'

const info = reactive({})
const money = ref()
async function toPayment() {
  if (!money.value) {
    uni.showToast({
      icon: 'none',
      title: '请输入支付金额'
    })
    return
  }
  const { data } = await productApi.getShopSkuList({
    detail: true,
    dynamicPrice: true,
    shopId: info.shopId,
  })
  uni.navigateTo({
    url: `/pages/payment/index?money=${money.value}`
  })
}
onLoad((option) => {
  const { name, shopId } = option
  info.name = name
  info.shopId = shopId
})
</script>
<template>
  <div class="physicalShopCheck">
    <text class="name">{{ info.name }}</text>
    <view class="inptBox">
      <u-input v-model="money" type="number" :border="false" placeholder="请输入支付金额" input-align="center" />
      <text class="unit">(元)</text>
    </view>
    <u-button class="hy-btn" type="primary" ripple @click="toPayment"> 结算 </u-button>
  </div>
</template>

<style lang="scss" scoped>
.physicalShopCheck {
  padding: 30rpx;
  text-align: center;

  .name {
    font-size: 36rpx;
  }

  .inptBox {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20rpx 0;
    border-top: 1px solid $uni-border-color-light;
    border-bottom: 1px solid $uni-border-color-light;
    position: relative;
    margin-top: 30rpx;

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
