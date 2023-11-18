<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-14 11:31:39
 * @LastEditTime: 2023-11-13 16:07:06
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { couponApi, productApi } from '@/api'
import { dateFormat } from '@/utils/index'
import { useUserStore } from '@/store'

const store = useUserStore()
const { userInfo } = storeToRefs(store)
const couponList = ref<any>([])
const currentTab = ref(0)
const tabs = [
  {
    name: '待使用',
    status: 1
  },
  {
    name: '已使用',
    status: 2
  },
  {
    name: '已过期',
    status: 3
  }
]
couponList.value = tabs.map((item) => {
  return {
    pageIndex: 1,
    pageSize: 10,
    finished: false,
    status: 'loadmore',
    list: []
  }
})
async function getCouponList() {
  const item = couponList.value[currentTab.value]
  const tab = tabs[currentTab.value]
  const { pageIndex, pageSize, finished, list } = item
  if (finished) return
  item.status = 'loading'
  const { data } = await couponApi.userCouponList({
    pageIndex,
    pageSize,
    detail: 'true',
    status: tab.status,
    userId: userInfo.value.id
  })
  const { records, current, pages } = data
  list.push(...records)
  if (current < pages) {
    item.pageIndex += 1
  } else {
    item.finished = true
    item.status = 'nomore'
  }
}
function changeTab(i: number) {
  currentTab.value = i
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
  getCouponList()
}
// 点击去核券
function showCoupon(obj: any) {
  const coupon = JSON.stringify(obj)
  uni.navigateTo({ url: `/pages/couponQrcode/index?coupon=${coupon}` })
}
// 优惠券状态
function getStatus(status: number) {
  const statusObj = tabs.find((item) => item.status === status)
  return statusObj?.name
}

onLoad((option) => {
  getCouponList()
})
onReachBottom(() => {
  getCouponList()
})
</script>
<template>
  <view class="container">
    <view class="tabs">
      <u-subsection
        :list="tabs"
        v-model="currentTab"
        @change="changeTab"
      ></u-subsection>
    </view>
    <view v-for="(item, index) in couponList" :key="index">
      <view class="tabBox" v-if="currentTab === index">
        <view class="coupon" v-for="coupon in item.list" :key="coupon.id">
          <image class="icon" src="@/static/icon/card_logo.png" mode="widthFix" />
          <view class="con">
            <view class="name">{{ coupon.name }}</view>
            <view class="date">
              有效时间：
              {{
                coupon.limitEndTime
                  ? dateFormat(
                      new Date(coupon.limitEndTime * 1000),
                      'yyyy-MM-dd hh:mm'
                    )
                  : '--'
              }}
            </view>
          </view>
          <u-button
            class="btn"
            type="primary"
            ripple
            size="mini"
            @click="showCoupon(coupon)"
            :disabled="coupon.status !== 1"
            >{{ getStatus(coupon.status) }}</u-button
          >
        </view>
        <u-loadmore v-if="item.list.length > 3" :status="item.status" />
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tabs {
  position: sticky;
  top: 0;
  z-index: 2;
}
.tabBox {
  padding: 30rpx;
  .coupon {
    display: flex;
    align-items: center;
    padding: 30rpx;
    border-radius: 10rpx;
    background: #fff;
    margin-bottom: 20rpx;
    .icon {
      width: 120rpx;
      height: 120rpx;
    }
    .con {
      flex: 1;
      margin-left: 30rpx;
      .date {
        font-size: 26rpx;
        color: #999;
        margin-top: 10rpx;
      }
    }
  }
}
</style>
