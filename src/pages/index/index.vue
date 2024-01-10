<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  onReady,
  onPageScroll,
  onShareAppMessage,
  onPullDownRefresh
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, moneyApi, productApi } from '@/api'
import { getImgFullPath } from '@/utils'
import { useUserStore } from '@/store'
import { sharePathFormat } from '@/common/wechat-share'
import C_CATES from './c_category.vue'
import C_COMMUNITY from './c_community.vue'
import C_SHOP from './c_shop.vue'

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
      callback(res.data)
    })
}

const toProductDetail = (product: { shopId: any; productId: any }) => {
  const { shopId, productId } = product
  uni.navigateTo({
    url: `/packageA/pages/productDetail/index?shopId=${shopId}&productId=${productId}`
  })
}

// 跳转线下店列表页面
const toPhysicalStore = (content: any) => {
  uni.navigateTo({
    url: `/packageA/pages/physicalShopList/index?categoryData= ${content}`
  })
}
const toShopProduct = () => {}
const toDevice = () => {}
const toWebview = (url: string) => {
  uni.navigateTo({
    url: `/packageA/pages/webview/index?url=${url}`
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
    url: '/packageA/pages/physicalShopList/index'
  })
}

const moneyInfo = ref([
  {
    money: 0,
    walletRuleId: 6,
    name: '积分钱包'
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
          url: `/packageA/pages/webview/index?url=${webUrl}`
        })
      }
      break
    case 13:
      if (content) {
        const obj = JSON.parse(content)
        uni.navigateTo({
          url: `/packageA/pages/physicalShop/index?shopId=${obj.id}&shopType=${obj.shopType}`
        })
      }
      break
    case 10:
      if (content) {
        const obj = JSON.parse(content)
        uni.navigateTo({
          url: `/packageA/pages/productDetail/index?shopId=${obj.shopId}&productId=${obj.productId}`
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
  // 查询黑豆余额
  getMoney()
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
  <view class="main">
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
      <!-- <u-tabs
        :list="tabList"
        :is-scroll="false"
        v-model="current"
        @change="change"
        bg-color="transparent"
        active-color="#fff"
        inactive-color="#fff"
        font-size="32"
      /> -->
      <view style="height: 23rpx"></view>
      <hy-search-bar @on-search="onSearch" />
      <view style="height: 23rpx"></view>
      <C_CATES></C_CATES>
      <view style="height: 23rpx"></view>
      <u-swiper
        :list="bannerList"
        height="200"
        mode="rect"
        :border-radius="24"
        bg-color="transparent"
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
      <view style="height: 23rpx"></view>
      <!-- 超级社群 -->
      <C_COMMUNITY />
      <view style="height: 23rpx"></view>
      <view class="rec">本地生活</view>
      <C_SHOP />
      <u-back-top :scroll-top="scrollTop"></u-back-top>
      <hy-tabbar :midButton="true" :border-top="false"></hy-tabbar>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.main {
  padding-bottom: 100rpx;
}
.top-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 680rpx;
  background: $bg-primary;
  background-image: url('https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/64a2cb6b-e64f-47ab-ab84-0d5aedc7d1fd.png');
  background-position: top center;
  background-size: 100% auto;
  background-repeat: no-repeat;
  background: linear-gradient(
    to bottom,
    $bg-primary,
    $bg-primary,
    $bg-primary,
    #f6f6f6
  );
}
.index-page {
  font-style: normal;
  text-align: center;
  min-height: 100vh;
  background-color: #f6f6f6;
  position: relative;
  background: transparent;
  z-index: 2;
  width: 702rpx;
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
.rec {
  font-size: 32rpx;
  font-weight: bold;
  text-align: left;
  margin-bottom: 26rpx;
}
</style>
