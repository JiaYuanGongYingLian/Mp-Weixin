<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { baseApi } from '@/api'
import { getImgFullPath } from '@/utils'
import searchBar from '@/components/hy-search-bar/index.vue'

const categoryList = reactive({
  list1: [],
  list2: []
})
const bannerList = ref([])

onShow(async () => {
  baseApi
    .getAdvertisingList({
      pageIndex: 1,
      pageSize: 10,
      type: baseApi.advertising_enum.ADV_HOME_LIST2
    })
    .then((result: { data: { records: never[] } }) => {
      categoryList.list1 = result.data.records
    });
  baseApi
    .getAdvertisingList({
      pageIndex: 1,
      pageSize: 10,
      type: baseApi.advertising_enum.ADV_HOME_LIST6
    })
    .then((result: { data: { records: never[] } }) => {
      // categoryList.list2 = result.data.records
    })
  baseApi
    .getAdvertisingList({
      pageIndex: 1,
      pageSize: 10,
      type: baseApi.advertising_enum.ADV_HOME_BANNER1
    })
    .then((result: { data: { records: never[] } }) => {
      bannerList.value = result.data.records
    });
})
const toShopProduct = () => {}
const toPhysicalStore = (path = '/pages/physicalShopList/index') => {
  uni.navigateTo({
    url: path
  })
};
const toDevice = () => {}
const toWebview = (url: any) => {}
const handleClick = (adv: { webUrl: any; objectType: any }) => {
  if (!adv.webUrl) {
    switch (adv.objectType) {
      case 10:
        toShopProduct()
        break;
      case 13:
        toPhysicalStore()
        break;
      case 100:
        toDevice()
        break;
      default:
        () => {}
    }
  } else {
    toWebview(adv.webUrl)
  }
}
</script>
<template>
  <view class="index-page">
    <searchBar />
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
  </view>
</template>

<style lang="scss" scoped>
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
</style>
