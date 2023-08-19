<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, orderApi, socialApi } from '@/api'
import { getImgFullPath, dateFormat } from '@/utils/index'
import $orderStatus from '@/utils/order'
import { useUserStore } from '@/store'
import config from '@/common/jim/config.js'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const tabCurrentIndex = ref(0)
const navList = reactive([
  {
    pageIndex: 1,
    status: 60,
    text: '对接中',
    loadingType: 'more',
    loaded: false,
    orderList: []
  },
  {
    pageIndex: 1,
    status: 20,
    text: '待对接',
    loadingType: 'more',
    loaded: false,
    orderList: []
  }
])
const needShopId = ref(false)
const userShopId = ref('') // 名人的个人店铺
async function getUserDetailInfo() {
  if (!needShopId.value) return
  const { data } = await socialApi.userDetailInfo({
    userId: userInfo.value.id,
    detail: true
  })
  userShopId.value = data?.shopId
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
  if (needShopId.value && !userShopId.value) return
  navItem.loadingType = 'loading'
  const { data } = await orderApi.orderList({
    pageIndex: navItem.pageIndex,
    detail: true,
    statuses: getOrderStatuses(navItem.status),
    userId: needShopId.value ? null : userStore.userInfo.id,
    categoryId: 600001,
    shopId: needShopId.value ? userShopId.value : null,
    otherColumns: 'user'
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
function reloadData() {
  const index = tabCurrentIndex.value
  const navItem = navList[index]
  navItem.pageIndex = 1
  loadData()
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
async function updateOrder(item: { id: any }, type: string) {
  uni.showLoading({
    title: '请稍后'
  })
  const { data } = await orderApi.orderUpdate({
    id: item.id,
    status: type === 'agree' ? 60 : 80
  })
  uni.hideLoading()
  reloadData()
}
function getOrderStatuses(status: number) {
  return $orderStatus.getStatuses(status)
}
function toOrderDetail(order: { orderId: any }) {
  // const { id } = order
  // uni.navigateTo({
  //   url: `/packageB/pages/order/detail?orderId=${id}`
  // })
}
function toChat(data) {
  if (needShopId.value) {
    uni.navigateTo({
      url: `/packageA/pages/chat/index?username=hy_${data?.user?.id}`
    })
  } else {
    uni.navigateTo({
      url: `/packageA/pages/chat/index?username=hy_${data?.orderProductSkus[0]?.shopProductSku?.shop?.userId}`
    })
  }
}
const statusMap = {
  20: '待对接',
  60: '对接中'
}
function getStatusTitle(status) {
  return statusMap[status]
}

onLoad(async (option) => {
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
  if (option?.passive) {
    needShopId.value = true
  }
  await getUserDetailInfo()
  await loadData()
})
</script>
<template>
  <div class="container">
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
            text="暂无数据"
            v-if="tabItem.loaded === true && tabItem.orderList.length === 0"
          ></u-empty>

          <!-- 订单列表 -->
          <view
            v-for="(item, index) in tabItem.orderList"
            :key="index"
            class="order-item"
          >
            <view class="i-top b-b">
              <text class="time">{{
                dateFormat(new Date(item.createTime * 1000), 'yyyy-MM-dd hh:mm')
              }}</text>
              <text class="state">{{ getStatusTitle(item.status) }}</text>
            </view>
            <view @click="toOrderDetail(item)">
              <view v-if="needShopId">
                <view class="goods-box-single">
                  <image
                    class="goods-img"
                    :src="
                      getImgFullPath(
                        item?.user?.avatar || config.$defaultAvatar
                      )
                    "
                    mode="aspectFill"
                  ></image>
                  <view class="right">
                    <text class="title clamp">{{ item?.user?.nickname }}</text>
                    <view class="info">
                      <text class="lab">实际支付：</text>
                      <text class="val">{{ item?.money }} 元</text>
                    </view>
                    <view class="info">
                      <text class="lab">对接时间：</text>
                      <text class="val">{{
                        dateFormat(
                          new Date(item.createTime * 1000),
                          'yyyy-MM-dd hh:mm'
                        )
                      }}</text>
                    </view>
                  </view>
                </view>
              </view>
              <view v-else>
                <view
                  class="goods-box-single"
                  v-for="(
                    orderProductSkuItem, goodsIndex
                  ) in item?.orderProductSkus"
                  :key="goodsIndex"
                >
                  <image
                    class="goods-img"
                    :src="getImgFullPath(orderProductSkuItem.skuImage)"
                    mode="aspectFill"
                  ></image>
                  <view class="right">
                    <text class="title clamp">{{
                      orderProductSkuItem?.shopProductSku?.shop?.name
                    }}</text>
                    <view class="info">
                      <text class="lab">实际支付：</text>
                      <text class="val"
                        >{{ orderProductSkuItem?.money }} 元</text
                      >
                    </view>
                    <view class="info">
                      <text class="lab">对接时间：</text>
                      <text class="val">{{
                        dateFormat(
                          new Date(item.createTime * 1000),
                          'yyyy-MM-dd hh:mm'
                        )
                      }}</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
            <view class="action-box">
              <u-button
                class="action-btn"
                @click="toChat(item)"
                v-if="item.status === 60"
                size="mini"
                type="primary"
                ripple
              >
                去聊天
              </u-button>
              <u-button
                class="action-btn"
                @click="updateOrder(item, 'refuse')"
                size="mini"
                type="warning"
                ripple
                style="margin-right: 20rpx"
                v-if="item.status === 20 && needShopId"
              >
                拒绝对接
              </u-button>
              <u-button
                class="action-btn"
                @click="updateOrder(item, 'agree')"
                size="mini"
                type="primary"
                ripple
                v-if="item.status === 20 && needShopId"
              >
                同意对接
              </u-button>
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
      color: #2979ff;
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

  /* 多条商品 */
  .goods-box {
    height: 160upx;
    padding: 20upx 0;
    white-space: nowrap;

    .goods-item {
      width: 120upx;
      height: 120upx;
      display: inline-block;
      margin-right: 24upx;
    }

    .goods-img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  /* 单条商品 */
  .goods-box-single {
    display: flex;
    padding: 20upx 0;
    margin-top: 10rpx;
    .goods-img {
      display: block;
      width: 120upx;
      height: 120upx;
      border-radius: 8rpx;
    }

    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 0 30upx 0 24upx;
      overflow: hidden;

      .title {
        font-size: 28rpx;
        color: #000;
        margin-bottom: 10rpx;
        font-weight: bold;
      }
      .info {
        line-height: 46rpx;
        .lab {
          color: #666;
        }
        .val {
          color: #000;
        }
      }
    }
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
    position: relative;
    border-color: $uni-border-color-light;
    padding: 20rpx 0;
  }

  .action-btn {
    margin: 0;
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
