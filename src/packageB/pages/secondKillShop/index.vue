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
    // shopId: 225,
    limitEnableTime: new Date().getTime(),
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
  uni.navigateTo({
    url: `/packageA/pages/productDetail/index?shopId=${shopId}&productId=${productId}`
  })
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
                <view class="countDown">
                  <view class="tit">现时秒杀</view>
                  <view class="counter">
                    <u-count-down
                      :timestamp="product.limitEndTime"
                      format="DD天HH时mm分ss秒"
                    ></u-count-down>
                  </view>
                </view>
              </view>
              <view class="content">
                <view class="name">
                  <u-tag text="秒杀" size="mini" type="warning" mode="dark" />
                  {{ product.name }}</view
                >
                <view class="money"
                  ><text>秒杀价</text> ￥<text
                    style="font-size: 34rpx; font-weight: bold"
                    >{{ product.money }}</text
                  ></view
                >
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
        .countDown {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: absolute;
          bottom: 0;
          left: 0;
          font-size: 24rpx;
          color: #fff;
          height: 60rpx;
          background: #e02d23;
          width: 100%;
          padding: 0 0 0 4rpx;
          box-sizing: border-box;
          .counter {
            background: #ffc430;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            padding-right: 4rpx;
            position: relative;
            &::after {
              content: ' ';
              display: block;
              position: absolute;
              top: 28rpx;
              width: 0;
              height: 0;
              left: -18rpx;
              transform: translate(0, -50%);
              border: 10rpx solid;
              border-color: transparent #ffc430 transparent transparent;
            }
          }
        }
      }

      .content {
        padding: 20rpx;
        text-align: left;
        .name {
          @include ellipsis(2);
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
