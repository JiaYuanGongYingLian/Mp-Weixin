<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  onReady,
  onShow,
  onLoad,
  onReachBottom,
  onPageScroll,
  onShareAppMessage
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

const userStore = useUserStore()
const { hasLogin, walletList } = storeToRefs(userStore)
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
  const { data } = await baseApi.getAdvertisingList({
    pageIndex: 1,
    pageSize: 10,
    type
  })
  callback(data)
}
// 黑豆商品列表
const getHeidouProductList = async () => {
  const { data } = await productApi.getShopProductList({
    pageIndex: productList.pageIndex,
    pageSize: productList.pageSize,
    shopId: 225 // 黑银商家
  })
  const { records, current, pages } = data
  productList.list.push(...records)
  if (current < pages) {
    productList.pageIndex += 1
  } else {
    productList.finished = true
  }
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
onReachBottom(() => {
  status.value = 'loading'
  getHeidouProductList()
})
onShareAppMessage((_res) => {
  const sourceTime = new Date().getTime()
  return {
    title: '黑银生活',
    path: sharePathFormat({ sourceTime })
  }
})
</script>
<template>
  <view class="index-page">
    <!-- #ifdef H5 -->
    <hyDownloadTips v-if="!isAlipayClient()" :top="'0px'" />
    <!-- #endif -->
    <searchBar @on-search="onSearch" />
    <u-swiper
      :list="bannerList"
      height="200"
      mode="rect"
      @click="handleBannerClick($event, bannerList)"
    ></u-swiper>
    <view class="section">
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
      :list="bannerList2"
      height="200"
      mode="none"
      interval="3500"
      duration="1000"
      @click="handleBannerClick($event, bannerList2)"
    ></u-swiper>
    <view class="hdBar">
      <view class="link" @click="toHeidouShop">
        <u-icon :name="icon_heidou" size="30"></u-icon>
        <text class="name">黑豆兑换中心</text>
        <text class="iconfont hy-icon-arrow-right"></text>
      </view>
      <view class="rest"
        >可用黑豆：<text class="num">{{ moneyInfo[0].money }}</text>
      </view>
    </view>
    <view class="container">
      <view
        class="itemWrap"
        v-for="product in productList.list"
        :key="product.productId"
      >
        <view class="contentBox" @click="toProductDetail(product)">
          <view class="imgCover">
            <u-image
              class="img"
              border-radius="0"
              :src="getImgFullPath(product.image)"
              height="220rpx"
              :lazy-load="true"
              mode="scaleToFill"
            />
          </view>
          <view class="content">
            <view class="name">{{ product.name }}</view>
            <view class="money">{{ product.money }}黑豆</view>
          </view>
        </view>
      </view>
    </view>
    <u-loadmore :status="status" />
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <hy-tabbar></hy-tabbar>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.index-page {
  font-style: normal;
  text-align: center;
  min-height: 100vh;
  background-color: #f6f6f6;
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
.hdBar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  .link {
    display: flex;
    align-items: center;
    .name {
      font-weight: 600;
      font-size: 30rpx;
      margin-left: 10rpx;
    }
    .hy-icon-arrow-right {
      margin-left: 10rpx;
      font-size: 26rpx;
      font-weight: bold;
    }
  }
  .rest {
    font-size: 26rpx;
    color: $uni-text-color-light;
    font-weight: 600;
    .num {
      font-weight: 600;
      font-size: 30rpx;
      color: $uni-text-color;
    }
  }
}

.container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 30rpx;
  gap: 20rpx;
  .itemWrap {
    width: calc((100% - 40rpx) / 3);
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

      .content {
        padding: $uni-spacing-row-lg;
        text-align: left;
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
