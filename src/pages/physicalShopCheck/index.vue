<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { orderApi, productApi } from '@/api'
import { useConfigStore } from '@/store'
import { storeToRefs } from 'pinia'

const configStore = useConfigStore()
const { enterByStoreQrcode, isWeChatBrowser } = storeToRefs(configStore)
const info = reactive({
  name: '',
  shopId: '',
  shopMoneyRules: []
})
const money = ref()
const orderData = ref({})
const moneyRuleId = ref(null)
// 创建订单
async function creatOrder() {
  try {
    const { data } = await orderApi.orderAdd(orderData.value)
    uni.navigateTo({
      url: `/pages/payment/index?order=${JSON.stringify(data)}`
    })
  } catch (err) {
    console.log(err)
  }
  uni.hideLoading()
}
async function toPayment() {
  if (!money.value) {
    uni.showToast({
      icon: 'none',
      title: '请输入支付金额'
    })
    return
  }
  uni.showLoading({ title: '', mask: true })
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
        moneyRuleId: moneyRuleId.value,
        dynamicPric: true
      }
    ]
  }
  creatOrder()
}

async function getShopInfo() {
  const { data } = await productApi.getShopInfo({
    id: info.shopId,
    detail: true,
    otherColumns: 'moneyRuleDetails'
  })
  const { name, shopMoneyRules } = data
  info.name = name
  if(shopMoneyRules && shopMoneyRules.length>0) {
    info.shopMoneyRules = shopMoneyRules
    moneyRuleId.value = shopMoneyRules[0].moneyRuleId
  }
}
function radioGroupChange(e: any) {
  console.log(e);
}

onLoad(async (option) => {
  if (option) {
    const { name, shopId } = option
    info.shopId = shopId
    if (name) {
      info.name = name
    } else {
      getShopInfo()
    }
  }
})
</script>
<template>
  <div class="physicalShopCheck">
    <u-navbar
      back-text=""
      :title="'店铺付款'"
      :title-bold="true"
      :is-back="!enterByStoreQrcode"
      v-if="!isWeChatBrowser"
      color="#333"
    ></u-navbar>
    <text class="name">{{ info.name }}</text>
    <view class="inptBox">
      <u-input v-model="money" type="digit" inputmode="decimal" focus pattern="number" placeholder="请输入支付金额"
        input-align="center" />
      <text class="unit">(元)</text>
    </view>
    <view class="radioBox" v-if="info.shopMoneyRules && info.shopMoneyRules.length>1">
      <u-radio-group v-model="moneyRuleId" @change="radioGroupChange" :wrap="true">
        <u-radio v-for="(item, index) in info.shopMoneyRules" :key="index" :name="item.moneyRuleId">
          {{ item.userMoneyRuleName }}
        </u-radio>
      </u-radio-group>
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
  .radioBox {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40rpx;
    :deep(.u-radio) {
      justify-content: center;
    }
  }

  .hy-btn {
    margin-top: 200rpx;
  }
}
</style>
