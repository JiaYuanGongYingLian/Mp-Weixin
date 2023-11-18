<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  onReady,
  onShow,
  onLoad,
  onReachBottom,
  onPageScroll,
  onShareAppMessage,
  onPullDownRefresh
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, moneyApi, productApi } from '@/api'
import { getImgFullPath } from '@/utils'
import { useUserStore } from '@/store'
import searchBar from '@/components/hy-search-bar/index.vue'
import hyDownloadTips from '@/components/hy-download-tips/index.vue'
import icon_heidou from '@/static/mine_hei_dou.png'
import { isAlipayClient, isWeChat } from '@/utils/common'
import { sharePathFormat } from '@/common/wechat-share'
import c_cates from './c_cates.vue'

const userStore = useUserStore()
const { hasLogin, walletList } = storeToRefs(userStore)
const tabList = ref([
  {
    name: '推荐'
  },
  {
    name: '商品'
  },
  {
    name: '短视频'
  }
])
const current = ref(0)
const change = (index: any) => {
  console.log(index)
}
const categoryList = reactive({
  list1: [],
  list2: []
})
const bannerList = ref([])
const bannerList2 = ref([])
const productList = reactive({
  pageIndex: 1,
  pageSize: 18,
  finished: false,
  list: []
})
const status = ref('loadmore')
const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})
const getBaseDataFn = async (type: any, callback: (arg0: any) => void) => {
  baseApi
    .getAdvertisingList({
      pageIndex: 1,
      pageSize: 10,
      type
    })
    .then((res) => {
      console.log(res)
      callback(res.data)
    })
}
// 门店列表
const shopList = reactive({
  pageIndex: 1,
  pageSize: 18,
  finished: false,
  list: []
})
const getHeidouProductList = async () => {
  const { data } = await productApi.getShopList({
    pageIndex: shopList.pageIndex,
    pageSize: shopList.pageSize,
    detail: 'true',
    otherColumns: 'moneyRuleDetails,vipReserveRoleCount,coupons',
    shopType: 3,
    // categoryId: tab.id,
    distance: 1
  })
  const { records, current, pages } = data
  shopList.list.push(...records)
  if (current < pages) {
    shopList.pageIndex += 1
  } else {
    shopList.finished = true
  }
  // const { data } = await productApi.getShopProductList({
  //   pageIndex: productList.pageIndex,
  //   pageSize: productList.pageSize,
  //   shopId: 225 // 黑银商家
  // })
  // const { records, current, pages } = data
  // productList.list.push(...records)
  // if (current < pages) {
  //   productList.pageIndex += 1
  // } else {
  //   productList.finished = true
  // }
}
const toProductDetail = (product: { shopId: any; productId: any }) => {
  const { shopId, productId } = product
  uni.navigateTo({
    url: `/pages/productDetail/index?shopId=${shopId}&productId=${productId}`
  })
}

// 跳转线下店列表页面
const toPhysicalStore = (content: any) => {
  uni.navigateTo({
    url: `/pages/physicalShopList/index?categoryData= ${content}`
  })
}
const toHeidouShop = () => {
  uni.navigateTo({
    url: '/packageB/pages/heidouShop/index'
  })
}
const toShopProduct = () => {}
const toDevice = () => {}
const toWebview = (url: string) => {
  uni.navigateTo({
    url: `/pages/webview/index?url=${url}`
  })
}
const handleClick = (adv: { webUrl: any; objectType: any }) => {
  if (!adv.webUrl) {
    switch (adv.objectType) {
      case 10:
        toShopProduct()
        break
      case 13:
        toPhysicalStore(adv.content)
        break
      case 100:
        toDevice()
        break
      default:
        break
    }
  } else {
    toWebview(adv.webUrl)
  }
}
const onSearch = () => {
  uni.navigateTo({
    url: '/pages/physicalShopList/index'
  })
}

const moneyInfo = ref([
  {
    money: 0,
    walletRuleId: 6,
    name: '黑豆钱包'
  }
])
moneyInfo.value.forEach((e) => {
  e.money = computed(() => {
    const money = walletList.value.find(
      (item) => item.walletRuleId === e.walletRuleId
    )?.money
    return money || 0
  })
})
async function getMoney() {
  if (hasLogin.value && !walletList.value.length) {
    const { data } = await moneyApi.walletList({ noPaging: true })
    userStore.syncSetWalletList(data)
  }
}
const handleBannerClick = (i: number, dataList: any[]) => {
  const data = dataList[i]
  const { objectType, webUrl, content } = data
  switch (objectType) {
    case 0:
      // dev const url = ''
      if (webUrl) {
        uni.navigateTo({
          url: `/pages/webview/index?url=${webUrl}`
        })
      }
      break
    case 13:
      if (content) {
        const obj = JSON.parse(content)
        uni.navigateTo({
          url: `/pages/physicalShop/index?shopId=${obj.id}&shopType=${obj.shopType}`
        })
      }
      break
    case 10:
      if (content) {
        const obj = JSON.parse(content)
        uni.navigateTo({
          url: `/pages/productDetail/index?shopId=${obj.shopId}&productId=${obj.productId}`
        })
      }
      break
    default:
      break
  }
}
onReady(async () => {
  // 线下好店
  getBaseDataFn(baseApi.advertising_enum.ADV_HOME_LIST2, (data) => {
    categoryList.list1 = data.records
  })
  // banner
  getBaseDataFn(baseApi.advertising_enum.ADV_HOME_BANNER1, (data) => {
    const { records } = data
    records.forEach((element: { image: string }) => {
      element.image = getImgFullPath(element.imageUrl)
    })
    bannerList.value = data.records
  })
  // banner2
  getBaseDataFn(baseApi.advertising_enum.ADV_HOME_BANNER2, (data) => {
    const { records } = data
    records.forEach((element: { image: string }) => {
      element.image = getImgFullPath(element.imageUrl)
    })
    bannerList2.value = data.records
  })
  // 黑豆商品
  getHeidouProductList()
  // 查询黑豆余额
  getMoney()
})
// 点击进入店铺
function toShopDetail(id: any) {
  uni.navigateTo({
    url: `/pages/physicalShop/index?shopId=${id}`
  })
}
onReachBottom(() => {
  status.value = 'loading'
  getHeidouProductList()
})
onShareAppMessage((_res) => {
  const sourceTime = new Date().getTime()
  return {
    title: '链通家园',
    path: sharePathFormat({ sourceTime })
  }
})
onPullDownRefresh(() => {
  setTimeout(async () => {
    getHeidouProductList()
    uni.stopPullDownRefresh()
  }, 1000)
})
const topBtn = reactive({
  top: 0
})
// #ifdef MP-WEIXIN
const obj = wx.getMenuButtonBoundingClientRect()
topBtn.top = obj?.top + obj?.height
// #endif
</script>
<template>
  <view>
    <view class="top-bg"></view>
    <view
      class="index-page"
      :style="{
        paddingTop: topBtn.top + 'px'
      }"
    >
      <!-- #ifdef H5 -->
      <!-- <hyDownloadTips v-if="!isAlipayClient()" :top="'0px'" /> -->
      <!-- #endif -->
      <u-tabs
        :list="tabList"
        :is-scroll="false"
        v-model="current"
        @change="change"
        bg-color="transparent"
        active-color="#fff"
        inactive-color="#fff"
        font-size="32"
      />
      <view style="height: 30rpx"></view>
      <hy-search-bar @on-search="onSearch" />
      <view style="height: 30rpx"></view>
      <c_cates />
      <view style="height: 30rpx"></view>
      <u-swiper
        :list="bannerList"
        height="200"
        mode="rect"
        :border-radius="24"
        @click="handleBannerClick($event, bannerList)"
      ></u-swiper>
      <view class="section" v-if="categoryList.list2.length">
        <view class="tit">线下好店</view>
        <view class="actions">
          <view
            :class="['item', `${item.objectType}`]"
            v-for="item in categoryList.list1"
            :key="item.id"
            @tap="handleClick(item)"
          >
            <image
              class="icon"
              :src="getImgFullPath(item.imageUrl)"
              mode="auto"
            />
            <view>{{ item.name }}</view>
          </view>
        </view>
      </view>
      <view class="section" v-if="categoryList.list2.length">
        <view class="tit">宴会定制</view>
        <view class="actions">
          <view
            class="item"
            :objectType="item.objectType"
            v-for="item in categoryList.list2"
            :key="item.id"
            @tap="handleClick(item)"
          >
            <image
              class="icon"
              :src="getImgFullPath(item.imageUrl)"
              mode="auto"
            />
            <view>{{ item.name }}</view>
          </view>
        </view>
      </view>
      <u-swiper
        v-if="bannerList2?.length > 0"
        :list="bannerList2"
        height="200"
        mode="none"
        interval="3500"
        duration="1000"
        @click="handleBannerClick($event, bannerList2)"
      ></u-swiper>
      <view class="hdBar">
        <!-- <view class="rest"
        >
        可用黑豆：<text class="num">{{ moneyInfo[0].money }}</text>
      </view> -->
      </view>
      <view class="container">
        <view class="shop" v-for="shop in shopList.list" :key="shop.id">
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
              <!-- <view class="addr">
              <view class="msg">
                <u-icon name="map-fill" class="icon"></u-icon>
                <text>{{ shop.addr }}</text>
              </view>
              <text class="distance">{{ shop.distance }}</text>
            </view> -->
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
          <!-- <view class="actionBox">
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
              ><text class="iconfont hy-icon-dianhua"></text> 电话咨询</u-button
            >
          </view>
        </view> -->
        </view>
      </view>
      <u-loadmore :status="status" />
      <u-back-top :scroll-top="scrollTop"></u-back-top>
      <hy-tabbar></hy-tabbar>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 460rpx;
  background: $bg-primary;
}
.index-page {
  font-style: normal;
  text-align: center;
  min-height: 100vh;
  background-color: #f6f6f6;
  position: relative;
  background: transparent;
  z-index: 2;
  width: 686rpx;
  margin: 0 auto;
}

.section {
  background: #fff;
  padding: 20rpx;
  margin-top: 20rpx;
}

.tit {
  text-align: left;
  font-weight: bold;
}

.actions {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;

  .item {
    width: 20%;
    margin-bottom: 20rpx;

    .icon {
      width: 100rpx;
      height: 100rpx;
    }
  }
}

.swiper {
  height: 110px;
  margin-top: 20rpx;

  .item {
    width: 100%;
    height: 100%;
  }
}

.container {
  // display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 30rpx;
  gap: 20rpx;
  // .itemWrap {
  //   width: calc((100% - 40rpx) / 3);
  //   border-radius: $section-raduis;
  //   background: $uni-bg-color-white;
  //   margin-bottom: $uni-spacing-col-lg;
  //   overflow: hidden;
  //   .contentBox {
  //     .imgCover {
  //       position: relative;
  //       width: 100%;
  //       flex-shrink: 0;
  //       margin-right: 20rpx;

  //       .img {
  //         width: 100%;
  //         // height: 200rpx;
  //         border-radius: $section-raduis;
  //       }
  //     }

  //     .content {
  //       padding: $uni-spacing-row-lg;
  //       text-align: left;
  //       .name {
  //         @include ellipsis;
  //         font-size: 28rpx;
  //       }

  //       .money {
  //         color: red;
  //         font-size: 26rpx;
  //         margin-top: 10rpx;
  //       }
  //     }
  //   }
  // }
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
      flex: 1;
      text-align: left;
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
</style>
