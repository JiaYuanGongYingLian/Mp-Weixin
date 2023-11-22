<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const bannerList = ref([])
const info = ref()
const hongbaoshow = ref(false)
const value2 = ref()
const value3 = ref()
function sethongbaoshow() {
  value2.value = ''
  value3.value = 0
  hongbaoshow.value = !hongbaoshow.value
}
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <u-popup
      v-model="hongbaoshow"
      mode="bottom"
      length="100%"
      duration="200"
      :mask="false"
      z-index="10100"
    >
      <view
        style="width: 100%; height: 100%; background-color: rgba(237, 237, 237)"
      >
        <u-top-tips ref="uTips"></u-top-tips>
        <u-navbar
          back-icon-name="close"
          back-icon-size="30"
          title="发红包"
          :background="ryStore.head_background"
          :title-bold="true"
          :custom-back="sethongbaoshow"
        ></u-navbar>
        <view class="sendhongbao">
          <view class="item">
            <view class="label">金额</view>
            <view class="content-text">
              <u-input
                type="digit"
                :clearable="false"
                maxlength="10"
                v-model="value2"
                input-align="right"
                placeholder="0.00"
              />
            </view>
            <view class="foot">元</view>
          </view>
          <view class="item" style="height: 130rpx">
            <view class="content-textarea">
              <u-input
                v-model="ps"
                :custom-style="input_style2"
                :auto-height="true"
                type="textarea"
                maxlength="16"
                placeholder-style="font-size: 35rpx;"
                placeholder="恭喜发财,大吉大利"
              />
            </view>
          </view>
          <view class="money">¥ {{ value3.toFixed(2) }}</view>
          <view class="buttom">
            <button :style="[buttomStyle]" class="anniu" @tap="submithb">
              塞钱进红包
            </button>
          </view>
        </view>
      </view>
    </u-popup>
    <u-popup
      v-model="openhongbao"
      width="80%"
      height="60%"
      negative-top="35%"
      border-radius="16"
      mode="center"
    >
      <view class="openhongbao">
        <view class="bj"></view>
        <view class="head">
          <view class="title">{{ hongbaoinfo.sendnickname }}发出的红包</view>
          <view class="info">{{ hongbaoinfo.hongbaops }}</view>
        </view>
        <view class="an">
          <view class="an1" @click="receive_hongbao(hongbaoinfo.hongbaoid)"
            >開</view
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.sendhongbao {
  width: 100%;
  height: 100%;
  padding: 30rpx 40rpx;

  .item {
    width: 100%;
    height: 100rpx;
    margin-bottom: 40rpx;
    display: inline-flex;
    background-color: #ffffff;
    border-radius: 12rpx;

    .label {
      padding-left: 20rpx;
      display: inline-flex;
      align-items: center;
      font-size: 35rpx;
    }

    .content-text {
      padding-left: 20rpx;
      display: inline-flex;
      align-items: center;
      position: relative;
      right: -170rpx;
    }

    .content-textarea {
      padding: 10rpx;
      width: 100%;
      font-size: 35rpx;
    }

    .foot {
      padding-left: 20rpx;
      display: inline-flex;
      align-items: center;
      font-size: 35rpx;
      position: relative;
      right: -180rpx;
    }
  }

  .money {
    display: flex;
    margin-top: 50rpx;
    justify-content: center;
    font-size: 80rpx;
    font-weight: bold;
  }

  .buttom {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;

    .anniu {
      background-color: #e0c0b5;
      // background-color: #da6844;
      width: 350rpx;
      border: none;
      color: #ffffff;
    }
  }
}
</style>