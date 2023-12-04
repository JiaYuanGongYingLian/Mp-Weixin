<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-12-04 15:57:32
 * @LastEditTime: 2023-12-04 18:09:54
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi, enumAll } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import { route } from '@/utils/common'

const userStore = useUserStore()
const form = ref()
const list = [
  {
    name: '余额钱包'
  }
]
function toWithdraw() {
  route({
    url: '/packageA/pages/wallet/withdraw'
  })
}
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <u-tabs-swiper
      ref="tabs"
      :list="list"
      active-color="#F1B44F"
      :is-scroll="false"
    ></u-tabs-swiper>
    <view class="main">
      <view class="name">余额（元）</view>
      <view class="restBox">
        <view class="num">0.14</view>
        <view @click="toWithdraw"
          >提现 <u-icon name="arrow-right" size="30"></u-icon>
        </view>
      </view>
      <view class="bot">
        <view class="det">
          <view>0.00</view>
          <view>今日收入</view>
        </view>
        <view class="det">
          <view>0.00</view>
          <view>今日收入</view>
        </view>
        <view class="det">
          <view>0.00</view>
          <view>今日收入</view>
        </view>
      </view>
    </view>
    <view class="list">
      <view class="item">
        <view class="data">
          <view class="top">
            <view class="tit">排队金额到余额+</view>
            <view class="money">0.02</view>
          </view>
          <view class="mid">排队金额到余额+</view>
          <view class="bot">2023-11-3016:42</view>
        </view>
        <u-icon name="arrow-right" size="28"></u-icon>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.main {
  background: $bg-primary;
  width: 686rpx;
  margin: 0 auto;
  border-radius: 12rpx;
  padding: 20rpx;
  color: #fff;
  margin-top: 20rpx;
  .name {
    font-size: 28rpx;
    margin-bottom: 60rpx;
  }
  .restBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 40rpx;
    .num {
      font-size: 50rpx;
      font-weight: bold;
    }
  }
  .bot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .det {
      text-align: center;
      font-size: 26rpx;
    }
  }
}
.list {
  margin-top: 30rpx;
  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f6f6f6;
    background: #fff;
    padding: 20rpx;
    .data {
      flex: 1;
      margin-right: 20rpx;
      .top {
        display: flex;
        justify-content: space-between;
        font-size: 30rpx;
        margin-bottom: 16rpx;
        .money {
          color: red;
        }
      }
      .mid {
        margin-bottom: 10rpx;
        color: #666;
      }
      .bot {
        text-align: right;
        color: #666;
      }
    }
  }
}
</style>
