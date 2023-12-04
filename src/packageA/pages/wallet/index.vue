<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-12-04 15:57:32
 * @LastEditTime: 2023-12-04 23:30:53
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onReachBottom, onPageScroll } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { moneyApi } from '@/api'
import { getImgFullPath, dateFormat } from '@/utils/index'
import { useUserStore } from '@/store'
import { route } from '@/utils/common'

const userStore = useUserStore()
const form = ref()
const list = ref([
  {
    name: '余额钱包'
  }
])
const walletInfo = ref({})
async function getShopWalletInfo() {
  const { data } = await moneyApi.walletInfo({
    objectType: 13,
    objectId: userStore.currentShop.id,
    noPaging: true,
    detail: true
  })
  walletInfo.value = data
  getWalletFlow()
}
async function getWalletInfo() {
  const { data } = await moneyApi.walletInfo({
    detail: true
  })
  walletInfo.value = data
  getWalletFlow()
}
const flowList = reactive({
  pageIndex: 1,
  pageSize: 18,
  list: []
})
const status = ref('loadmore')
async function getWalletFlow() {
  if (status.value === 'nomore') return
  status.value = 'loading'
  const { data } = await moneyApi.walletFlowList({
    pageIndex: flowList.pageIndex,
    pageSize: flowList.pageSize,
    detail: true,
    walletId: walletInfo.value.id
  })
  const { records, current, pages } = data
  flowList.list.push(...records)
  if (current < pages) {
    flowList.pageIndex += 1
  } else {
    status.value = 'nomore'
  }
}
function toWithdraw() {
  // route({
  //   url: '/packageA/pages/wallet/withdraw'
  // })
}
const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})
onLoad((option) => {
  if (option?.isShop) {
    list.value = [
      {
        name: '门店钱包'
      }
    ]
    getShopWalletInfo()
  } else {
    getWalletInfo()
  }
})
onReachBottom(() => {
  getWalletFlow()
})
</script>
<template>
  <view class="container">
    <u-tabs-swiper
      ref="tabs"
      :list="list"
      active-color="#F1B44F"
      bg-color="transparent"
      :is-scroll="false"
    ></u-tabs-swiper>
    <view class="main">
      <view class="name">余额（元）</view>
      <view class="restBox">
        <view class="num">{{ walletInfo?.money || 0.0 }}</view>
        <view @click="toWithdraw"
          >提现 <u-icon name="arrow-right" size="30"></u-icon>
        </view>
      </view>
      <view class="bot">
        <view class="det">
          <view>{{ walletInfo?.dayIncome || 0.0 }}</view>
          <view>今日收入</view>
        </view>
        <view class="det">
          <view>{{ walletInfo?.monthIncome || 0.0 }}</view>
          <view>当月收入</view>
        </view>
        <view class="det">
          <view>{{ walletInfo?.totalIncome || 0.0 }}</view>
          <view>历史收入</view>
        </view>
      </view>
    </view>
    <view class="list">
      <view class="item" v-for="item in flowList.list" :key="item.id">
        <view class="data">
          <view class="top">
            <view class="tit">{{ item.name }}</view>
            <view class="money">0.02</view>
          </view>
          <view class="mid">{{ item.remark }}</view>
          <view class="bot">{{
            dateFormat(new Date(item.createTime * 1000), 'yyyy-MM-dd hh:mm')
          }}</view>
        </view>
        <u-icon name="arrow-right" size="28"></u-icon>
      </view>
    </view>
    <u-loadmore :status="status" />
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 0 30rpx 30rpx 30rpx;
}
.main {
  background: $bg-primary;
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
  border-radius: 12rpx;
  overflow: hidden;
  margin-bottom: 20rpx;
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
