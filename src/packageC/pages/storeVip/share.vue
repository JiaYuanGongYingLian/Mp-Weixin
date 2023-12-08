<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-14 18:20:41
 * @LastEditTime: 2023-12-09 02:41:38
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { dateFormat } from '@/utils/index'
import { useUserStore } from '@/store'
import qrcode from '../../components/hy-qrcode/index.vue'

const userStore = useUserStore()
const { currentShop, myShopList } = storeToRefs(userStore)
const coupon = ref({})
const qrCodeText = ref('https://wap.blacksilverscore.com/')
const showPicker = ref(false)
function changeShop(e: any[]) {
  const i = e[0]
  const shop = myShopList.value[i]
  userStore.syncSetCurrentShop(shop)
}
onLoad((option) => {
  qrCodeText.value = `${qrCodeText.value}?redirect_url=/packageC/pages/getSharedVip/index&shopId=${currentShop.value.id}`
  uni.showLoading({
    mask: true
  })
  setTimeout(() => {
    uni.hideLoading()
  }, 500)
})
</script>
<template>
  <div class="container">
    <view class="name">
      <view class="leftName">{{ currentShop.name }} </view>
      <view>
        <u-button
          size="mini"
          type="error"
          shape="circle"
          ripple
          @click="showPicker = true"
          >切换</u-button
        >
      </view>
    </view>
    <u-picker
      mode="selector"
      v-model="showPicker"
      :default-selector="[0]"
      :range="myShopList"
      @confirm="changeShop"
      range-key="name"
    ></u-picker>
    <!-- <view class="line"></view> -->
    <view>
      <view class="coupon_voucher">
        <view class="coupon_voucher_main">
          <view class="name">{{ coupon.name }}</view>
          <view class="qrcode">
            <qrcode
              cid="qrcode2229"
              makeOnLoad
              :text="qrCodeText"
              :size="200"
            ></qrcode>
          </view>
          <view class="code">{{ `${currentShop.name}-分享VIP` }}</view>
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-image: url('https://image.blacksilverscore.com/uploads/fc4a0a12-312b-430d-97cc-b21676d271ee.png');
  background-position: center;
  background-position: center;
  background-size: cover;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .name {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;
    background-color: rgba(255, 255, 255, 0.9);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
    .leftName {
      color: #333;
      font-weight: bold;
    }
  }
}
.tips {
  width: 500rpx;
  margin: 0 auto;
  color: #fff;
  margin-top: 40rpx;
}
.coupon_voucher {
  width: 460rpx;
  margin: 0 auto;
  padding: 30rpx;
  position: relative;
  background: #fff;
  border-radius: 16rpx;
  overflow: hidden;
  &_main {
    text-align: center;
    .qrcode {
      margin: 20rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.line {
  position: absolute;
  top: 80rpx;
  width: 100%;
  height: 1px;
  background-image: linear-gradient(
    to right,
    #909399 0%,
    #909399 50%,
    transparent 50%
  );
  background-size: 12px 1px;
  background-repeat: repeat-x;
}
</style>
