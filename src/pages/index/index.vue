<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onReady, onShow, onLoad, onReachBottom } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath } from '@/utils'
import searchBar from '@/components/hy-search-bar/index.vue'
import icon_heidou from '@/static/mine_hei_dou.png'

const categoryList = reactive({
  list1: [],
  list2: []
})
const bannerList = ref([])
const productList = reactive({
  pageIndex: 1,
  pageSize: 18,
  finished: false,
  list: []
})
const status = ref('loadmore')
const getBaseDataFn = async (type: any, callback: (arg0: any) => void) => {
  const { data } = await baseApi.getAdvertisingList({
    pageIndex: 1,
    pageSize: 10,
    type
  })
  callback(data)
}

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
onReady(async () => {
  // 线下好店
  getBaseDataFn(baseApi.advertising_enum.ADV_HOME_LIST2, (data) => {
    categoryList.list1 = data.records
  })
  // banner
  getBaseDataFn(baseApi.advertising_enum.ADV_HOME_BANNER1, (data) => {
    bannerList.value = data.records
  })
  // 黑豆商品
  getHeidouProductList()
})
onReachBottom(() => {
  status.value = 'loading'
  getHeidouProductList()
})
// 跳转线下店列表页面
const toPhysicalStore = (content: any) => {
  uni.navigateTo({
    url: `/pages/physicalShopList/index?categoryData= ${content}`
  })
}
const toHeidouShop = () => {
  uni.navigateTo({
    url: '/pages/heidouShop/index'
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
</script>
<template>
  <view class="index-page">
    <searchBar @on-search="onSearch" />
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
    <swiper class="swiper" indicator-dots :autoplay="false" circular>
      <swiper-item v-for="item in bannerList" :key="item.id">
        <image
          class="item"
          :src="getImgFullPath(item.imageUrl)"
          mode="widthFix"
        />
      </swiper-item>
    </swiper>
    <view class="hdBar">
      <view class="link" @click="toHeidouShop">
        <u-icon :name="icon_heidou" size="30"></u-icon>
        <text class="name">黑豆兑换中心</text>
        <text class="iconfont hy-icon-arrow-right"></text>
      </view>
      <view class="rest">可用黑豆：<text class="num">0.0</text> </view>
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
  height: 100px;
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
