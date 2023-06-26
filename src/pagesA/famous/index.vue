<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 13:49:44
 * @LastEditTime: 2023-06-26 17:33:25
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const productList = ref<object[]>([])
const tabs = ref([])
const currentTab = ref(0)
const keyword = ref('')
const status = ref('loadmore')
const navBarHeight = ref(0)
// #ifdef H5
navBarHeight.value = 86
// #endif
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
  await baseApi
    .getCategoryList({ pageSize: 1000, type: 1, parentId: 0 })
    .then((res: { data: any }) => {
      const { data } = res
      tabs.value = data.records
      tabs.value.unshift({
        name: '全部',
        id: ''
      })
      productList.value = initData()
    })
    .catch((err: any) => {})
}
async function getHeidouProductList() {
  const item = productList.value[currentTab.value]
  const tab = tabs.value[currentTab.value]
  const { pageIndex, pageSize, finished } = item
  if (finished) {
    status.value = 'nomore'
    return
  }
  const { data } = await productApi.getShopProductList({
    pageIndex,
    pageSize,
    detail: 'true',
    shopId: 225, // 黑豆线上商城
    categoryId: tab.id,
    keywords: keyword.value
  })
  const { records, current, pages } = data
  item.list.push(...records)
  if (current < pages && pages !== 0) {
    item.pageIndex++
  } else {
    item.finished = true
    status.value = 'nomore'
  }
}
function toProductDetail(product: { shopId: any; productId: any }) {
  const { shopId, productId } = product
  uni.navigateTo({ url: `/pagesA/businessCard/detail?id=${shopId}` })
}
function tabsChange(index: any) {
  currentTab.value = index
  status.value = 'loading'
  const item = productList.value[currentTab.value]
  if (!item.list.length) {
    getHeidouProductList()
  }
  keyword.value = ''
}
function doSearch() {
  const item = productList.value[currentTab.value]
  item.pageIndex = 1
  item.list = []
  item.finished = false
  getHeidouProductList()
}
onLoad(() => {})
onReady(async () => {
  await getTabs()
  await getHeidouProductList()
})
onReachBottom(() => {
  status.value = 'loading'
  getHeidouProductList()
})
</script>

<template>
  <div class="physicalStore">
    <hy-nav-bar
      title="名人列表"
      :background="{ background: '#fff' }"
    ></hy-nav-bar>
    <view class="tabs">
      <u-tabs
        :list="tabs"
        v-model="currentTab"
        @change="tabsChange"
        :is-scroll="true"
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
      <view
        class="swiper-item"
        v-for="(item, index) in productList"
        :key="index"
      >
        <view class="container" v-if="index === currentTab">
          <view
            class="itemWrap"
            v-for="product in item.list"
            :key="product.productId"
          >
            <view class="contentBox" @click="toProductDetail(product)">
              <view class="imgCover">
                <u-image
                  class="img"
                  border-radius="0"
                  :src="getImgFullPath(product.image)"
                  height="300rpx"
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
      </view>
    </view>
    <u-loadmore :status="status" />
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

.container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  padding: 30rpx;
  gap: 20rpx;
  .itemWrap {
    width: calc((100% - 40rpx) / 2);
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

.tabs {
  position: sticky;
  top: 0;
  /* #ifdef H5 */
  top: 84rpx;
  /* #endif */
  background: #fff;
  z-index: 2;
}

.search {
  position: sticky;
  top: 86rpx;
  /* #ifdef H5 */
  top: 172rpx;
  /* #endif */
  background: #fff;
  z-index: 2;
  height: 100rpx;
}
</style>
