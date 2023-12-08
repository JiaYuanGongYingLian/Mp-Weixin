<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  onLoad,
  onPageScroll,
  onShareAppMessage
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useConfigStore, useUserStore } from '@/store'
import { baseApi, productApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  handleMapLocation,
  makePhoneCall
} from '@/utils/index'
import pageSkeleton from '@/components/hy-page-skeleton/index.vue'
import hyTabBar from '@/components/hy-tabbar/index.vue'
import { isWeChat } from '@/utils/common'
import { sharePathFormat } from '@/common/wechat-share'

const configStore = useConfigStore()
const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const { enterByStoreQrcode } = storeToRefs(configStore)
const loadingSkeleton = ref(false)
const bannerList = ref([])
const shop = ref({})
const shopId = ref()
const currentLocation = ref()
const productList = ref<object[]>([])
const tabs = ref([])
const currentTab = ref(0)
const scrollTop = ref(0)
const tabList = ref([
  {
    iconPath: '/static/icon/ic_bar_main_pg.png',
    selectedIconPath: '/static/icon/ic_bar_main_page_checked.png',
    text: '首页',
    hy_path: '/packageA/pages/physicalShop/index'
  },
  {
    iconPath: '/static/icon/ic_bar_mine.png',
    selectedIconPath: '/static/icon/ic_bar_mine_checked.png',
    hy_pagePath: '/pages/mine/index',
    text: '我的'
  }
])
const currentTabbar = ref(0)
const pageTitle = ref('')
const isWeChatOfficial = ref(true)
const tabsStyleTop = ref('')
// #ifdef MP-WEIXIN
isWeChatOfficial.value = false
// #endif
const shareCode = ref('')

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
        if (!shop.value.latitude) return
        getDistance(
          latitude,
          longitude,
          shop.value.latitude,
          shop.value.longitude
        ).then((res) => {
          const { distance_str } = res
          shop.value.distance = distance_str
        })
      }
    },
    // 用户拒绝获取定位后 再次点击触发
    fail(res) {
      console.log(res)
      if (res.errMsg == 'getLocation:fail auth deny') {
        uni.showModal({
          content: '检测到您没打开获取信息功能权限，是否去设置打开？',
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
// 付款
// eslint-disable-next-line no-shadow
function handleCheck(shop: { name: any; id: any }) {
  if (userStore.checkLoginState()) {
    const { name, id } = shop
    uni.navigateTo({
      url: `/pages/physicalShopCheck/index?name=${name}&shopId=${id}`
    })
  }
}
async function getShopInfo() {
  try {
    const { data } = await productApi.getShopInfo({
      id: shopId.value,
      detail: true
    })
    const { bannerResources, avatar, name } = data
    // 设置页面title
    setTitle(name)
    shop.value = data
    if (bannerResources && bannerResources.length > 0) {
      bannerList.value = bannerResources.map(
        (item: { image: string; resourceUrl: string }) => {
          // eslint-disable-next-line no-param-reassign
          item.image = getImgFullPath(item.resourceUrl)
          return item
        }
      )
    } else {
      const image = getImgFullPath(avatar)
      bannerList.value.push(image)
    }

    const { provinceName, cityName, districtName, street, other } =
      shop.value.address
    shop.value.addr = provinceName + cityName + districtName + street + other
    shop.value.shopMoneyRule = shop.value.shopMoneyRules
      ? shop.value.shopMoneyRules.find(
          (item: { selected: any }) => item.selected
        )
      : {}
    if (currentLocation.value) {
      const { latitude, longitude } = currentLocation.value
      getDistance(
        latitude,
        longitude,
        shop.value.latitude,
        shop.value.longitude
      ).then((res) => {
        const { distance_str } = res
        shop.value.distance = distance_str
      })
    }
  } catch (err) {
    console.log(err)
  }
}
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
async function getTabs() {
  const { data } = await baseApi.getCategoryList({
    detail: true,
    needShowAll: true,
    noPaging: true,
    productShopId: shopId.value
  })
  tabs.value = data
  tabs.value.unshift({
    name: '全部',
    id: ''
  })
  productList.value = initData()
}
async function getShopProduct() {
  const item = productList.value[currentTab.value]
  const tab = tabs.value[currentTab.value]
  const { pageIndex, pageSize, finished } = item
  if (finished) return
  if (configStore.hideData) return
  const { data } = await productApi.getShopProductList({
    pageIndex,
    pageSize,
    detail: 'true',
    categoryId: tab.id,
    shopType: 3,
    shopId: shopId.value,
    dynamicPrice: false
  })
  const { records, current, pages } = data
  item.list.push(...records)
  if (current < pages) {
    item.pageIndex++
  } else {
    item.finished = true
  }
}
function tabsChange(index: any) {
  currentTab.value = index
  const item = productList.value[currentTab.value]
  if (!item.list.length) {
    getShopProduct()
  }
  let scrollTop = 400
  // #ifdef H5
  scrollTop -= configStore.navBarHeight - 20
  // #endif
  uni.pageScrollTo({
    scrollTop,
    duration: 300
  })
}
function toProductDetail(id: any) {
  if (userStore.checkLoginState()) {
    if (!id) return
    let url = `/packageA/pages/productDetail/index?shopId=${shopId.value}&productId=${id}`
    if (shareCode.value) {
      url = `/packageA/pages/productDetail/index?shopId=${shopId.value}&productId=${id}&shareCode=${shareCode.value}`
    }
    uni.navigateTo({
      url
    })
  }
}

// scroll-view到底部加载更多
function onreachBottom() {
  console.log('bottom')
  getShopProduct()
}

// H5页面动态设置title
function setTitle(title = '') {
  pageTitle.value = title
  // #ifdef H5
  document.title = title
  const i = document.createElement('iframe')
  i.src = '/favicon.ico'
  i.style.display = 'none'
  i.onload = () => {
    setTimeout(() => {
      i.remove()
    }, 9)
  }
  document.body.appendChild(i)
  // #endif
}
// 切换tab
function handleTabBarChange(index: any) {
  if (index === 0) return
  const toPage = tabList.value[index]
  if (toPage.hy_pagePath) {
    uni.switchTab({
      url: toPage.hy_pagePath
    })
  } else {
    uni.redirectTo({
      url: toPage.hy_path
    })
  }
}
const imgHeight = ref('240rpx')
const bannerHeight = ref(400)
onLoad(async (option) => {
  shopId.value = option?.shopId
  loadingSkeleton.value = true
  getLocation()
  await getShopInfo()
  await getTabs()
  setTimeout(() => {
    loadingSkeleton.value = false
  }, 100)
  await getShopProduct()
  // #ifdef H5
  isWeChatOfficial.value = isWeChat()
  tabsStyleTop.value = isWeChatOfficial.value ? '0px' : '44px'
  uni.getSystemInfo({
    success: (res) => {
      const { windowWidth } = res
      imgHeight.value = `${windowWidth / 1.2}rpx`
      bannerHeight.value = windowWidth / 2 + 200
    }
  })
  if (option?.qrcode) {
    configStore.setEnterType('storeQrcode')
    const pages = getCurrentPages()
    uni.setStorageSync('shopFullPath', pages[pages.length - 1].$page.fullPath)
  }
  if (option?.shareCode) {
    shareCode.value = option?.shareCode
    uni.setStorageSync('shareCode', option?.shareCode)
  }
  // #endif
})
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})
onShareAppMessage(() => {
  return {
    title: shop.value.name,
    desc: shop.value.remark || '',
    imageUrl: getImgFullPath(shop.value.avatar),
    path: sharePathFormat({ shopId: shop.value.id })
  }
})
</script>
<template>
  <div class="physicalShop">
    <u-navbar
      back-text=""
      :title="pageTitle"
      :title-bold="true"
      :is-back="!enterByStoreQrcode"
      v-if="!isWeChatOfficial"
      color="#333"
    ></u-navbar>
    <page-skeleton :loading="loadingSkeleton" :type="2"></page-skeleton>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <u-swiper
      :height="bannerHeight"
      :list="bannerList"
      mode="number"
      indicator-pos="bottomRight"
    ></u-swiper>
    <view class="shop">
      <view class="contentBox">
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
        </view>
      </view>
      <view class="actionBox">
        <view>
          <text class="rule" v-if="shop.shopMoneyRule">{{
            shop.shopMoneyRule.userMoneyRuleName
          }}</text>
        </view>
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
            v-if="shop.supportDynamicPrice"
            @click="handleCheck(shop)"
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
      </view>
    </view>
    <view class="tabs">
      <u-tabs
        :list="tabs"
        v-model="currentTab"
        @change="tabsChange"
        :is-scroll="true"
      ></u-tabs>
    </view>
    <view class="swiper">
      <view
        class="swiper-item"
        v-for="(item, index) in productList"
        :key="index"
      >
        <scroll-view
          class="scorll-view"
          of
          v-if="index === currentTab"
          scroll-y
          @scrolltolower="onreachBottom"
        >
          <view class="container">
            <view class="itemWrap" v-for="product in item.list" :key="item.tab">
              <view
                class="contentBox"
                @click="toProductDetail(product.productId)"
              >
                <view class="imgCover">
                  <u-image
                    class="img"
                    border-radius="0"
                    :src="getImgFullPath(product.image)"
                    :height="imgHeight"
                    :lazy-load="true"
                    mode="aspectFill"
                  />
                </view>
                <view class="tag">
                  <u-tag
                    text="福利款"
                    type="warning"
                    size="mini"
                    v-if="product.activitySku"
                  />
                </view>
                <view class="content">
                  <view class="name">{{ product.name }}</view>
                  <view class="money">￥{{ product.money }}</view>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
    <!-- #ifdef H5 -->
    <hyTabBar
      v-if="enterByStoreQrcode"
      v-model="currentTabbar"
      :list="tabList"
      :mid-button="false"
      :icon-size="34"
      active-color="#5098ff"
      @change="handleTabBarChange"
    ></hyTabBar>
    <!-- #endif -->
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

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
        height: 200rpx;
        border-radius: $section-raduis;
      }
    }

    .content {
      .name {
        font-size: 32rpx;
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
    }
  }
}

.tabs {
  position: sticky;
  top: 0;
  // #ifdef H5
  top: calc(v-bind(tabsStyleTop) + env(safe-area-inset-top));
  // #endif
  background: hsl(0, 0%, 100%);
  z-index: 2;
}

.swiper {
  flex: 1;
  padding: $uni-spacing-row-base * 2;

  .scorll-view {
    width: 100%;
    height: calc(100vh - 140rpx);
  }

  .container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }

  .itemWrap {
    width: calc((100% - 30rpx) / 2);
    border-radius: $section-raduis;
    background: $uni-bg-color-white;
    margin-bottom: $uni-spacing-col-lg;
    overflow: hidden;

    .contentBox {
      .imgCover {
        position: relative;
        width: 100%;
        flex-shrink: 0;
        margin-right: 20rpx;

        .img {
          width: 100%;
          // height: 200rpx;
          border-radius: $section-raduis;
        }
      }
      .tag {
        padding: 10rpx 30rpx 10rpx 30rpx;
      }

      .content {
        padding: $uni-spacing-row-lg;
        padding-top: 0;

        .name {
          @include ellipsis;
          font-size: 28rpx;
        }

        .money {
          color: red;
          font-size: 26rpx;
          margin-top: 10rpx;
        }
      }
    }
  }
}
</style>
