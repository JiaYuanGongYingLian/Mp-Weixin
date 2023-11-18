<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { dateFormat } from '@/utils/index'
import { useUserStore } from '@/store'
import qrcode from '@/components/hy-qrcode'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const coupon = ref({})
const qrCodeText = ref('heiyinjifen://ShopCouponUser')

onLoad((option) => {
  coupon.value = JSON.parse(option?.coupon)
  coupon.value.limitEndTime = dateFormat(
    new Date(coupon.value.limitEndTime * 1000),
    'yyyy-MM-dd hh:mm'
  )
  qrCodeText.value = `${qrCodeText.value}?cardId=${coupon.value.id}&overtime=${coupon.value.limitEndTime}`
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
    <view>
      <view class="coupon_voucher">
        <view class="line"></view>
        <view class="coupon_voucher_head">
          <image
            class="icon"
            src="@/static/icon/card_logo.png"
            mode="widthFix"
          />
          <view class="con">
            <view class="name">{{ coupon.name }}</view>
            <view class="date">有效时间：{{ coupon.limitEndTime }}</view>
          </view>
        </view>
        <view class="coupon_voucher_main">
          <view class="name">{{ coupon.name }}</view>
          <view class="qrcode">
            <qrcode cid="qrcode2229" makeOnLoad :text="qrCodeText"></qrcode>
          </view>
          <view class="code">券码：{{ coupon.id }}</view>
        </view>
      </view>
      <view class="tips">
        使用规则： 向商家出示二维码或券码即可消费，到店前请勿提供！
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
}
.tips {
  width: 500rpx;
  margin: 0 auto;
  color: #fff;
  margin-top: 40rpx;
}
.coupon_voucher {
  width: 500rpx;
  margin: 0 auto;
  padding: 30rpx;
  position: relative;
  background-image: radial-gradient(
      circle at left 200rpx,
      #162c55,
      #162c55 36rpx,
      transparent 11px
    ),
    radial-gradient(
      circle at right 200rpx,
      #2c3e70,
      #33507a 36rpx,
      transparent 11px
    );
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.5);
  &_head {
    display: flex;
    justify-content: center;
    align-items: center;
    .icon {
      width: 130rpx;
      margin-right: 20rpx;
    }
    .con {
      .date {
        font-size: 24rpx;
        color: $uni-text-color-light;
        margin-top: 6rpx;
      }
    }
  }
  &_main {
    margin-top: 100rpx;
    text-align: center;
    padding-bottom: 30rpx;
    .qrcode {
      margin: 20rpx 0;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
.coupon_voucher > .line {
  position: absolute;
  top: 200rpx;
  left: 36rpx;
  width: calc(100% - 72rpx);
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
.coupon_voucher:after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 10px;
  background: radial-gradient(
    circle at bottom,
    #17274f,
    #17274f 8px,
    transparent 8px
  );
  background-size: 14px 14px;
}
</style>
