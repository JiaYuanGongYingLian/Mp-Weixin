<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, couponApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  handleMapLocation,
  getDistanceMatrix
} from '@/utils/index'
import { useUserStore } from '@/store'
import { makePhoneCall } from '@/utils'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const shopList = ref<object[]>([])
const tabs = ref([])
const currentTab = ref(0)
const currentLocation = ref()
const keyword = ref('')
const status = ref('loadmore')
function initData() {
  return tabs.value.map((item) => {
    return {
      tab: item,
      list: [],
      loading: true,
      finished: false,
      pageIndex: 1,
      pageSize: 20
    }
  })
}
async function getTabs(parentId = 0) {
  await baseApi
    .getCategoryList({ pageSize: 1000, type: 1, parentId })
    .then((res: { data: any }) => {
      const { data } = res
      tabs.value = data.records
      tabs.value.unshift({
        name: '全部',
        id: parentId || ''
      })
      shopList.value = initData()
    })
    .catch((err: any) => {})
}
async function getShopList() {
  const item = shopList.value[currentTab.value]
  const tab = tabs.value[currentTab.value]
  const { pageIndex, pageSize, finished } = item
  if (finished) {
    status.value = 'nomore'
    return
  }
  const { data } = await productApi.getShopList({
    pageIndex,
    pageSize,
    detail: 'true',
    otherColumns: 'moneyRuleDetails,vipReserveRoleCount,coupons',
    shopType: 3,
    categoryId: tab.id,
    keywords: keyword.value,
    distance: 1
  })
  const { records, current, pages } = data
  records.forEach((shop: object) => {
    const { provinceName, cityName, districtName, street, other } = shop.address
    shop.addr = provinceName + cityName + districtName + street + other
    shop.shopMoneyRule = shop.shopMoneyRules
      ? shop.shopMoneyRules.find((item: { selected: any }) => item.selected)
      : {}
    if (currentLocation.value) {
      const { latitude, longitude } = currentLocation.value
      getDistance(latitude, longitude, shop.latitude, shop.longitude).then(
        (res) => {
          const { distance_str } = res
          shop.distance = distance_str
        }
      )
    }
  })
  item.list.push(...records)
  if (current < pages && pages !== 0) {
    item.pageIndex++
  } else {
    item.finished = true
    status.value = 'nomore'
  }
}
function tabsChange(index: any) {
  currentTab.value = index
  const item = shopList.value[currentTab.value]
  if (!item.list.length) {
    getShopList()
  }
  keyword.value = ''
}
function doSearch() {
  const item = shopList.value[currentTab.value]
  item.pageIndex = 1
  item.list = []
  item.finished = false
  getShopList()
}

function getLocation() {
  // 获取定位信息
  uni.getLocation({
    type: 'gcj02', // 返回可以用于uni.openLocation的经纬度
    // 用户允许获取定位
    success(res) {
      if (res.errMsg == 'getLocation:ok') {
        const { latitude, longitude } = res
        currentLocation.value = {
          latitude,
          longitude
        }
        uni.setStorageSync('currentLocation', currentLocation.value)
        shopList.value.forEach((item) => {
          item.list.forEach(
            (shop: { distance: string; latitude: any; longitude: any }) => {
              getDistance(
                latitude,
                longitude,
                shop.latitude,
                shop.longitude
              ).then((res) => {
                const { distance_str } = res
                shop.distance = distance_str
              })
            }
          )
        })
      }
    },
    // 用户拒绝获取定位后 再次点击触发
    fail(res) {
      console.log(res, 130)
      if (res.errMsg == 'getLocation:fail auth deny') {
        uni.showModal({
          content: '检测到您没打开获取位置信息功能权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (res) => {
                  console.log('确定')
                }
              })
            } else {
              console.log('取消')
              return false
            }
          }
        })
      }
    }
  })
}
// 点击进入店铺
function toShopDetail(id: any) {
  uni.navigateTo({
    url: `/packageA/pages/physicalShop/index?shopId=${id}`
  })
}
// 点击付款按钮
function handleCheck(shop: { name: any; id: any }) {
  if (userStore.checkLoginState()) {
    const { name, id } = shop
    uni.navigateTo({
      url: `/pages/physicalShopCheck/index?name=${name}&shopId=${id}`
    })
  }
}
// 领券
async function couponAdd(coupon: { id: any }) {
  if (userStore.checkLoginState()) {
    const { data } = await couponApi.userCouponAdd({
      couponId: coupon.id
    })
    uni.showToast({
      icon: 'none',
      title: data.msg ? data.msg : '领取成功'
    })
  }
}
onLoad(async (option) => {
  if (option?.categoryData) {
    const obj = JSON.parse(option?.categoryData)
    await getTabs(obj.categoryId)
  } else {
    await getTabs()
  }
  await getShopList()
  getLocation()
})
onReachBottom(() => {
  status.value = 'loading'
  getShopList()
})
const navBarHeight = ref(0)
// #ifdef H5
navBarHeight.value = 86
// #endif
</script>

<template>
  <div class="physicalStore">
    <view class="tabs">
      <u-tabs
        :list="tabs"
        v-model="currentTab"
        @change="tabsChange"
        :is-scroll="true"
        v-if="tabs.length > 1"
      ></u-tabs>
    </view>
    <view
      class="search"
      :style="{
        top:
          tabs.length > 1 ? `${86 + navBarHeight}rpx` : `${0 + navBarHeight}rpx`
      }"
    >
      <u-search
        shape="round"
        :clearabled="true"
        :show-action="true"
        action-text="搜索"
        :animation="false"
        bg-color="#fff"
        border-color="#288cca"
        margin="20rpx 30rpx"
        v-model="keyword"
        @search="doSearch"
        @custom="doSearch"
        @clear="doSearch"
      ></u-search>
    </view>
    <view class="swiper">
      <view class="swiper-item" v-for="(item, index) in shopList" :key="index">
        <view v-if="index === currentTab">
          <view class="shop" v-for="shop in item.list" :key="item.tab">
            <view class="contentBox" @click="toShopDetail(shop.id)">
              <view class="imgCover">
                <u-image
                  class="img"
                  border-radius="10rpx"
                  :src="getImgFullPath(shop.avatar)"
                  height="160rpx"
                  :lazy-load="true"
                  mode="scaleToFill"
                />
                <text class="type">{{ shop.type }}</text>
              </view>
              <view class="content">
                <text class="name">{{ shop.name }}</text>
                <text class="remark">{{ shop.remark }}</text>
                <view class="addr">
                  <view class="msg">
                    <u-icon name="map-fill" class="icon"></u-icon>
                    <text>{{ shop.addr }}</text>
                  </view>
                  <text class="distance">{{ shop.distance }}</text>
                </view>
                <text class="vip" v-if="shop.vipReserveRoleCount > 0"
                  >消费领会员</text
                >
              </view>
            </view>
            <view class="couponBox">
              <view
                class="coupon_voucher"
                v-for="item in shop.coupons"
                :key="item.id"
              >
                <view class="coupon_voucher_main">
                  <view class="price">
                    <text class="unit">￥</text>
                    <text class="num"> {{ item.money }}</text></view
                  >
                  <view class="name">{{ item.name }}</view>
                </view>
                <view class="coupon_voucher_foot">
                  <u-button
                    class="btn"
                    size="mini"
                    type="primary"
                    plain
                    ripple
                    @click="couponAdd(item)"
                    >立即领取</u-button
                  >
                </view>
              </view>
            </view>
            <view class="actionBox">
              <text class="rule" v-if="shop.shopMoneyRule">{{
                shop.shopMoneyRule.userMoneyRuleName
              }}</text>
              <view class="actions">
                <u-button
                  type="primary"
                  ripple-bg-color="#909399"
                  size="mini"
                  shape="circle"
                  @click="handleMapLocation(shop)"
                  >导航</u-button
                >
                <u-button
                  type="primary"
                  ripple-bg-color="#909399"
                  size="mini"
                  shape="circle"
                  v-if="false"
                  >VIP充值</u-button
                >
                <u-button
                  type="primary"
                  ripple-bg-color="#909399"
                  size="mini"
                  shape="circle"
                  @click="handleCheck(shop)"
                  v-if="shop.supportDynamicPrice"
                  >付款</u-button
                >
                <u-button
                  type="primary"
                  ripple-bg-color="#909399"
                  size="mini"
                  shape="circle"
                  @click="makePhoneCall(shop.address.phone)"
                  ><text class="iconfont hy-icon-dianhua"></text>
                  电话咨询</u-button
                >
              </view>
            </view>
          </view>
          <u-empty
            v-if="item.list.length < 1 && status === 'nomore'"
            text="暂无数据"
            mode="list"
            margin-top="200"
          ></u-empty>
          <u-loadmore v-if="item.list.length > 3" :status="status" />
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.physicalStore {
  min-height: 100vh;
  color: $uni-text-color;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color;
}

.swiper {
  flex: 1;
  padding: $uni-spacing-row-base * 2;

  .scorll-view {
    width: 100%;
    height: 100%;
  }

  .shop {
    border-radius: $section-raduis;
    background: $uni-bg-color-white;
    margin-bottom: $uni-spacing-col-lg;
    padding: $uni-spacing-row-lg;

    .contentBox {
      display: flex;

      .imgCover {
        position: relative;
        width: 160rpx;
        flex-shrink: 0;
        margin-right: 20rpx;

        .img {
          width: 100%;
          // height: 200rpx;
          border-radius: $section-raduis;
        }
      }

      .content {
        position: relative;
        .name {
          font-size: 32rpx;
          width: 75%;
          display: inline-block;
        }

        .remark {
          @include ellipsis;
          color: $uni-text-color-light;
          font-size: 20rpx;
          margin-top: 10rpx;
        }

        .addr {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 20rpx;
          color: $uni-text-color-light;
          gap: 10rpx;
          margin-top: 30rpx;

          .msg {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            .icon {
              font-size: 26rpx;
              color: #333;
              margin-right: 5rpx;
            }
          }

          .distance {
            flex-shrink: 0;
            margin-left: 10rpx;
          }
        }
        .vip {
          position: absolute;
          right: 0;
          top: 0;
          border: 1px solid $uni-text-color-red;
          color: $uni-text-color-red;
          font-size: 18rpx;
          padding: 5rpx;
          border-radius: 10rpx;
        }
      }
    }
    .couponBox {
      display: flex;
      overflow-y: scroll;
      align-items: flex-start;
      .coupon_voucher {
        border-radius: 6px;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
        color: $uni-text-color-orange;
        margin: 20rpx 20rpx 20rpx 6rpx;
        padding: 7px 10px 10px;
        position: relative;
        width: 250rpx;
        flex-shrink: 0;
        &_main {
          // min-height: 100rpx;
          .price {
            .unit {
              font-size: 20rpx;
            }
            .num {
              font-size: 40rpx;
              font-weight: bold;
            }
          }
          .name {
            font-size: 22rpx;
          }
        }
        &_foot {
          border-top: 1px dashed $uni-border-color-orange;
          margin-top: 10px;
          padding-top: 8px;
          position: relative;
          display: flex;
          justify-content: center;
          &::before,
          &::after {
            background-color: #fff;
            border-color: transparent transparent rgba(232, 232, 237, 0.7)
              rgba(232, 232, 237, 0.7);
            border-radius: 50%;
            border-style: solid;
            border-width: 1px;
            content: '';
            height: 7px;
            position: absolute;
            top: -4px;
            width: 7px;
          }
          &::before {
            left: -15px;
            transform: rotate(-135deg);
          }
          &::after {
            right: -15px;
            transform: rotate(35deg);
          }
          :deep(.btn) {
            flex: 1;
            button {
              padding: 8rpx 0;
              font-size: 20rpx;
              height: 40rpx;
              width: 100%;
            }
          }
        }
      }
    }

    .actionBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;

      .rule {
        color: $uni-text-color-light;
        font-size: 20rpx;
      }

      .actions {
        display: flex;
        justify-content: center;
        gap: 18rpx;

        :deep(.u-btn--primary) {
          background: $bg-primary;
        }
        .hy-icon-dianhua {
          margin-right: 5rpx;
          font-size: 26rpx;
        }
      }
    }
  }
}

.tabs {
  position: sticky;
  top: 0;
  /* #ifdef H5 */
  top: 84rpx;
  // #endif
  background: #fff;
  z-index: 2;
}

.search {
  position: sticky;
  top: 86rpx;
  // #ifdef H5
  top: 172rpx;
  // #endif
  background: #fff;
  z-index: 2;
  flex: 0;
}
</style>
