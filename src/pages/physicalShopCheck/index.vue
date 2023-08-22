<!-- eslint-disable eqeqeq -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { orderApi, productApi } from '@/api'
import { useConfigStore, useUserStore } from '@/store'
import hyDownloadTips from '@/components/hy-download-tips/index.vue'

const configStore = useConfigStore()
const userStore = useUserStore()
const { enterByStoreQrcode, isWeChatBrowser, isAlipayClient } =
  storeToRefs(configStore)
const { accessToken } = storeToRefs(userStore)
const info = reactive({
  name: '',
  shopId: '',
  shopMoneyRules: []
})
const money = ref()
const orderData = ref({
  remark: ''
})
const moneyRuleId = ref(null)
// 创建订单
async function creatOrder() {
  try {
    const { data } = await orderApi.orderAdd(orderData.value)
    if (data) {
      uni.setStorageSync('orderDataString', JSON.stringify(data))
      uni.navigateTo({
        url: '/pages/payment/index?order=true'
      })
    }
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
  try {
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
    // 卖手推荐的门店，卖手获得收益
    if (uni.getStorageSync('shareCode')) {
      orderData.value.orderProductSkus[0].externalData = {
        userShareCode: uni.getStorageSync('shareCode')
      }
    }
    creatOrder()
  } catch (err) {
    uni.hideLoading()
  }
}

async function getShopInfo() {
  const { data } = await productApi.getShopInfo({
    id: info.shopId,
    detail: true,
    otherColumns: 'moneyRuleDetails'
  })
  const { name, shopMoneyRules, code, user } = data
  uni.setStorageSync('shopCode', code)
  uni.setStorageSync('shopOwnerShareCode', user.shareCode)
  info.name = name
  if (shopMoneyRules && shopMoneyRules.length > 0) {
    if (moneyRuleId.value) {
      // 判断url携带的moneyRuleId是否还存在（可能规则已删除，但是码或者链接存在滞后）
      const rule = shopMoneyRules.find(
        (item: { moneyRuleId: null }) => item.moneyRuleId == moneyRuleId.value
      )
      if (!rule) {
        info.shopMoneyRules = shopMoneyRules
        moneyRuleId.value = shopMoneyRules[0].moneyRuleId
      }
    } else {
      info.shopMoneyRules = shopMoneyRules
      moneyRuleId.value = shopMoneyRules[0].moneyRuleId
    }
  }
}
watch(accessToken, (newValue, oldValue) => {
  getShopInfo()
})
function radioGroupChange(e: any) {
  console.log(e)
}
onLoad(async (option) => {
  if (option) {
    const { shopId } = option
    info.shopId = shopId
    if (option.moneyRuleId) {
      moneyRuleId.value = option.moneyRuleId
    }
    getShopInfo()
  }
  if (!userStore.hasLogin) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
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
      v-if="!isWeChatBrowser && !isAlipayClient"
      color="#333"
    ></u-navbar>
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
    <view
      class="radioBox"
      v-if="info.shopMoneyRules && info.shopMoneyRules.length > 1"
    >
      <u-radio-group
        v-model="moneyRuleId"
        @change="radioGroupChange"
        :wrap="true"
      >
        <u-radio
          v-for="(item, index) in info.shopMoneyRules"
          :key="index"
          :name="item.moneyRuleId"
        >
          {{ item.userMoneyRuleName }}
        </u-radio>
      </u-radio-group>
    </view>
    <u-form-item
      label-width="auto"
      label-position="top"
      :border-bottom="false"
      label="备注："
      ><u-input type="textarea" v-model="orderData.remark"
    /></u-form-item>
    <u-button class="hy-btn" type="primary" ripple @click="toPayment">
      结算
    </u-button>
    <!-- #ifdef H5 -->
    <hyDownloadTips />
    <!-- #endif -->
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
