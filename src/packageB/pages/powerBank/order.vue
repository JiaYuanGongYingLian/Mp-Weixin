<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-16 17:55:07
 * @LastEditTime: 2023-10-26 12:06:21
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { powerBankApi, orderApi } from '@/api'
import { getImgFullPath, dateFormat } from '@/utils/index'
import $orderStatus from '@/utils/order'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const tabCurrentIndex = ref(0)
const navList = reactive([
  {
    pageIndex: 1,
    status: 1,
    text: '进行中',
    loadingType: 'more',
    loaded: false,
    orderList: []
  },
  {
    pageIndex: 1,
    status: 2,
    text: '已完成',
    loadingType: 'more',
    loaded: false,
    orderList: []
  },
  {
    pageIndex: 1,
    status: 3,
    text: '已完成待支付',
    loadingType: 'more',
    loaded: false,
    orderList: []
  }
])
function reloadData() {
  const index = tabCurrentIndex.value
  const navItem = navList[index]
  navItem.pageIndex = 1
  loadData()
}
// 获取订单列表
async function loadData(source?: string | undefined) {
  // 这里是将订单挂载到tab列表下
  const index = tabCurrentIndex.value
  const navItem = navList[index]
  if (source === 'tabChange' && navItem.loaded === true) {
    // tab切换只有第一次需要加载数据
    return
  }
  if (navItem.loadingType === 'loading' || navItem.loadingType === 'noMore') {
    return
  }
  navItem.loadingType = 'loading'
  const { data } = await powerBankApi.getOrders({
    pageNo: navItem.pageIndex,
    serviceType: powerBankApi.serviceType.PORTABLE_CHARGER
  })
  if (navItem.pageIndex === 1) {
    navItem.orderList = []
  }
  const { records, current, pages } = data
  navItem.orderList.push(...records)
  if (current < pages && pages !== 0) {
    navItem.pageIndex += 1
    navItem.loadingType = 'more'
  } else {
    console.log(current, pages, 'nomore')
    navItem.loaded = true
    navItem.loadingType = 'nomore'
  }
}
// swiper 切换
function changeTab(e: { detail: { current: any } }) {
  tabCurrentIndex.value = e.detail.current
  loadData('tabChange')
}
// 顶部tab点击
function tabClick(index: any) {
  tabCurrentIndex.value = index
}
// 删除订单
async function deleteOrder(item: { id: any }) {
  uni.showLoading({
    title: '请稍后'
  })
  const { data } = await orderApi.orderDelete({
    id: item.id,
    status: $orderStatus.getDeletedStatus().type
  })
  uni.hideLoading()
  reloadData()
}
// 取消订单
async function cancelOrder(item: { id: any }) {
  uni.showLoading({
    title: '请稍后'
  })
  const { data } = await orderApi.orderUpdate({
    id: item.id,
    status: $orderStatus.getCancelStatus().type
  })
  uni.hideLoading()
  reloadData()
}
function payOrder(data: any) {
  uni.setStorageSync('orderJson', JSON.stringify(data))
  uni.navigateTo({
    url: '/pages/payment/index?type=orderList&order=true'
  })
}
function getOrderProductSkusCount(order: {
  orderProductSkus: { count: number }[]
}) {
  let count = 0
  if (!order.orderProductSkus) return count
  order.orderProductSkus.forEach((item: { count: number }) => {
    count += item.count
  })
  return count
}
function getStatusColor(order: { status: any }) {
  const { status } = order
  let ret = '#fa436a'
  switch (status) {
    case 3:
      ret = '#909399'
      break
    default:
      ret = '#fa436a'
      break
  }
  return ret
}
function getOrderStatuses(status: number) {
  return $orderStatus.getStatuses(status)
}
function toOrderDetail(order: { orderId: any }) {
  const { id } = order
  // uni.navigateTo({
  //   url: `/packageB/pages/order/detail?orderId=${id}`
  // })
}
const serviceType = ref('')

function getStatusTitle(status) {
  switch (status) {
    case 1:
      return '进行中'
    case 2:
      return '已完成'
    case 3:
      return '已完成待支付'
    default:
      return ''
  }
}
const dType = {
  1: '洗车',
  2: '电瓶车充电',
  3: '交流慢充',
  4: '直流快充',
  5: '上门洗车',
  6: '代洗车',
  7: '隔空无线充电',
  8: '共享充电宝'
}

onLoad((option) => {
  if (option?.status) {
    const status = option.status - 0
    for (let i = 0; i < navList.length; i += 1) {
      const item = navList[i]
      if (status === item.status) {
        tabCurrentIndex.value = i
        break
      }
      console.log(`${i}:----item.status:${item.status}  ---status:${status}`)
    }
  }
  console.log(`status:${option?.status}`)
  console.log(`tabCurrentIndex:${tabCurrentIndex.value}`)
  loadData()
})
</script>
<template>
  <div class="container">
    <hy-nav-bar :title="'订单列表'"></hy-nav-bar>
    <view class="navbar">
      <view
        v-for="(item, index) in navList"
        :key="index"
        class="nav-item"
        :class="{ current: tabCurrentIndex === index }"
        @click="tabClick(index)"
      >
        {{ item.text }}
      </view>
    </view>

    <swiper
      :current="tabCurrentIndex"
      class="swiper-box"
      duration="300"
      @change="changeTab"
    >
      <swiper-item
        class="tab-content"
        v-for="(tabItem, tabIndex) in navList"
        :key="tabIndex"
      >
        <scroll-view
          class="list-scroll-content"
          scroll-y
          @scrolltolower="loadData"
        >
          <!-- 空白页 -->
          <u-empty
            v-if="tabItem.loaded === true && tabItem.orderList.length === 0"
          ></u-empty>

          <!-- 订单列表 -->
          <view
            v-for="(item, index) in tabItem.orderList"
            :key="index"
            class="order-item"
          >
            <view class="i-top b-b">
              <text class="time">{{ item.startTime }}</text>
              <text class="state" :style="{ color: getStatusColor(item) }">{{
                getStatusTitle(item.status)
              }}</text>
            </view>
            <view class="name" @click="toOrderDetail(item)">
              {{ item.siteName }}-{{ dType[item.serviceType] }}
            </view>

            <view class="price-box">
              实付款
              <text class="price">{{ item.actualPayMoney }}</text>
            </view>
            <view class="action-box b-t">
              <button
                class="action-btn"
                @click="cancelOrder(item)"
                v-if="$orderStatus.supportCancel(item.status)"
              >
                取消订单
              </button>
              <button
                class="action-btn"
                @click="deleteOrder(item)"
                v-if="$orderStatus.supportDelete(item.status)"
              >
                删除订单
              </button>
              <button
                class="action-btn recom"
                @click="payOrder(item)"
                v-if="item.status === $orderStatus.getPayWillStatus().type"
              >
                立即支付
              </button>
            </view>
          </view>
          <u-loadmore
            margin-top="30"
            margin-bottom="30"
            :status="tabItem.loadingType"
          ></u-loadmore>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  padding: 0 20rpx;
}
.swiper-box {
  height: calc(100% - 40px);
}

.list-scroll-content {
  height: 100%;
  padding-bottom: 1px;
}

.navbar {
  display: flex;
  height: 40px;
  padding: 0 5px;
  background: #fff;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.06);
  position: relative;
  z-index: 10;

  .nav-item {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 15px;
    color: #333;
    position: relative;

    &.current {
      color: #333;

      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 0;
        transform: translateX(-50%);
        width: 44px;
        height: 0;
        border-bottom: 2px solid $uni-color-primary;
      }
    }
  }
}

.uni-swiper-item {
  height: auto;
  padding-bottom: 20rpx;
}

.order-item {
  display: flex;
  flex-direction: column;
  padding: 0 30rpx;
  background: #fff;
  margin-top: 16upx;

  .i-top {
    display: flex;
    align-items: center;
    height: 80upx;
    font-size: 24rpx;
    color: #333;
    position: relative;
    border-color: $uni-border-color-light;

    .time {
      flex: 1;
    }

    .state {
      color: #333;
    }

    .del-btn {
      padding: 10upx 0 10upx 36upx;
      font-size: 36rpx;
      color: #f0f0f0;
      position: relative;

      &:after {
        content: '';
        width: 0;
        height: 30upx;
        border-left: 1px solid #333;
        position: absolute;
        left: 20upx;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }

  .name {
    margin-top: 30rpx;
  }

  .price-box {
    display: flex;
    justify-content: flex-end;
    align-items: baseline;
    padding: 20upx 30upx;
    font-size: 26rpx;
    color: $uni-text-color-grey;

    .num {
      margin: 0 8upx;
      color: #333;
    }

    .price {
      font-size: 36rpx;
      color: #333;

      &:before {
        content: '￥';
        font-size: 24rpx;
        margin: 0 2upx 0 8upx;
      }
    }
  }

  .action-box {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 100upx;
    position: relative;
    padding-right: 30upx;
    border-color: $uni-border-color-light;
  }

  .action-btn {
    width: 160upx;
    height: 60upx;
    margin: 0;
    margin-left: 24upx;
    padding: 0;
    text-align: center;
    line-height: 60upx;
    font-size: 26rpx;
    color: #333;
    background: #fff;
    border-radius: 100px;

    &:after {
      border-radius: 100px;
    }

    &.recom {
      background: #fff9f9;
      color: #333;

      &:after {
        border-color: #f7bcc8;
      }
    }
  }
}

/* load-more */
.uni-load-more {
  display: flex;
  flex-direction: row;
  height: 80upx;
  align-items: center;
  justify-content: center;
}

.uni-load-more__text {
  font-size: 28upx;
  color: #999;
}

.uni-load-more__img {
  height: 24px;
  width: 24px;
  margin-right: 10px;
}

.uni-load-more__img > view {
  position: absolute;
}

.uni-load-more__img > view view {
  width: 6px;
  height: 2px;
  border-top-left-radius: 1px;
  border-bottom-left-radius: 1px;
  background: #999;
  position: absolute;
  opacity: 0.2;
  transform-origin: 50%;
  animation: load 1.56s ease infinite;
}

.uni-load-more__img > view view:nth-child(1) {
  transform: rotate(90deg);
  top: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(2) {
  transform: rotate(180deg);
  top: 11px;
  right: 0;
}

.uni-load-more__img > view view:nth-child(3) {
  transform: rotate(270deg);
  bottom: 2px;
  left: 9px;
}

.uni-load-more__img > view view:nth-child(4) {
  top: 11px;
  left: 0;
}

.load1,
.load2,
.load3 {
  height: 24px;
  width: 24px;
}

.load2 {
  transform: rotate(30deg);
}

.load3 {
  transform: rotate(60deg);
}

.load1 view:nth-child(1) {
  animation-delay: 0s;
}

.load2 view:nth-child(1) {
  animation-delay: 0.13s;
}

.load3 view:nth-child(1) {
  animation-delay: 0.26s;
}

.load1 view:nth-child(2) {
  animation-delay: 0.39s;
}

.load2 view:nth-child(2) {
  animation-delay: 0.52s;
}

.load3 view:nth-child(2) {
  animation-delay: 0.65s;
}

.load1 view:nth-child(3) {
  animation-delay: 0.78s;
}

.load2 view:nth-child(3) {
  animation-delay: 0.91s;
}

.load3 view:nth-child(3) {
  animation-delay: 1.04s;
}

.load1 view:nth-child(4) {
  animation-delay: 1.17s;
}

.load2 view:nth-child(4) {
  animation-delay: 1.3s;
}

.load3 view:nth-child(4) {
  animation-delay: 1.43s;
}

@-webkit-keyframes load {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0.2;
  }
}
</style>
