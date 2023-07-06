<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 09:59:19
 * @LastEditTime: 2023-07-04 17:34:51
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  onLoad,
  onShow,
  onReady,
  onReachBottom,
  onPageScroll
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import hyNavBar from '@/components/hy-nav-bar/index.vue'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const info = ref()
const status = ref('loadmore')
const scrollTop = ref(0)
const tabBgColor = ref('#fff')
const tabActiveColor = ref('#2979ff')
const tabInactiveColor = ref('#303133')
const list = [
  {
    name: '圈子'
  },
  {
    name: '对接名人'
  },
  {
    name: '短视频'
  }
]
const currentTab = ref(1)
const categoryList = ref([])
const famousList = reactive({
  pageIndex: 1,
  pageSize: 18,
  finished: false,
  list: []
})
const buttonRect = ref({})
// #ifdef MP-WEIXIN
buttonRect.value = wx.getMenuButtonBoundingClientRect()
// #endif
function change(index: any) {
  currentTab.value = index
  if (index === 2) {
    uni.navigateTo({
      url: '/pagesA/shortVideo/index',
      success: () => {
        currentTab.value = 1
      }
    })
  }
}
function handleClickCate(item: { id: any }) {
  uni.navigateTo({ url: `/pagesA/famous/index?id=${item.id}` })
}
async function getCategory() {
  const { data } = await baseApi.getAdvertisingList({
    noPaging: true,
    type: baseApi.advertising_enum.ADV_FAMOUS_LIST
  })
  categoryList.value = data
}
// 黑豆商品列表
const getFamousList = async () => {
  const { data } = await productApi.getShopProductList({
    pageIndex: famousList.pageIndex,
    pageSize: famousList.pageSize,
    shopId: 225 // 黑银商家
  })
  const { records, current, pages } = data
  famousList.list.push(...records)
  if (current < pages) {
    famousList.pageIndex += 1
  } else {
    famousList.finished = true
  }
}
function toFamousDetail(item: { id: any }) {
  uni.navigateTo({ url: `/pagesA/businessCard/detail?id=${item.id}` })
}
onLoad((option) => {
  getCategory()
  getFamousList()
})
onReachBottom(() => {
  if (currentTab.value === 1) {
    status.value = 'loading'
    getFamousList()
  }
})
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
  if (scrollTop.value > 60) {
    tabBgColor.value = 'rgba(0,0,0,0.5)'
    tabInactiveColor.value = '#fff'
    tabActiveColor.value = '#fff'
  } else {
    tabBgColor.value = '#fff'
    tabActiveColor.value = '#2979ff'
    tabInactiveColor.value = '#303133'
  }
})
</script>
<template>
  <view class="container">
    <view
      class="head"
      sticky
      :style="{
        top: 0,
        zIndex: 2,
        paddingTop: buttonRect.top ? buttonRect.top + 'px' : '0',
        background: tabBgColor
      }"
    >
      <u-tabs
        :list="list"
        sticky
        :style="{ top: 0, zIndex: 2 }"
        v-model="currentTab"
        bg-color="transparent"
        :active-color="tabActiveColor"
        :inactive-color="tabInactiveColor"
        @change="change"
      ></u-tabs>
    </view>
    <view class="circle" v-if="currentTab === 0">
      <u-empty text="暂未开放" mode="page" style="margin-top: 100px"></u-empty>
    </view>
    <!-- 对接名人 -->
    <view class="celebrity" v-if="currentTab === 1">
      <view class="section">
        <view class="actions">
          <view
            :class="['item', `${item.objectType}`]"
            v-for="item in categoryList"
            :key="item.id"
            @tap="handleClickCate(item)"
          >
            <image
              class="icon"
              :src="getImgFullPath(item.imageUrl)"
              mode="auto"
            />
            <view class="name">{{ item.name }}</view>
          </view>
        </view>
      </view>
      <view class="section">
        <view class="t-head">
          <text class="iconfont hy-icon-hot" />
          <text class="t-head-t"> 热门推荐</text>
        </view>
        <view class="t-body">
          <view
            class="itemWrap"
            v-for="item in famousList.list"
            :key="item.productId"
          >
            <view class="contentBox" @click="toFamousDetail(item)">
              <view class="imgCover">
                <u-image
                  class="img"
                  border-radius="0"
                  :src="getImgFullPath(item.image)"
                  height="300rpx"
                  :lazy-load="true"
                  mode="scaleToFill"
                />
                <u-icon
                  name="https://image.blacksilverscore.com/uploads/71517462-824c-4dcf-8e44-ff72af2268e7.png"
                  style="
                    width: 80rpx;
                    height: 80rpx;
                    position: absolute;
                    left: 0rpx;
                    top: 0rpx;
                  "
                ></u-icon>
              </view>
              <view class="content">
                <view class="name">{{ item.name }}</view>
                <view class="money">{{ item.money }}黑豆</view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <u-loadmore :status="status" />
    </view>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.container {
  padding-bottom: 60rpx;
}
.head {
  background: #fff;
}
.section {
  background: #fff;
  padding: 20rpx;
  margin-top: 20rpx;
}

.actions {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  .item {
    width: 20%;
    margin-bottom: 20rpx;

    .icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 50%;
    }
    .name {
      @include ellipsis();
    }
  }
}

.t-head {
  .t-head-t {
    font-size: 32rpx;
  }
  .hy-icon-hot {
    color: red;
    font-size: 32rpx;
    font-weight: bold;
  }
}
.t-body {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  padding: 30rpx 16rpx;
  gap: 20rpx;
  .itemWrap {
    width: calc((100% - 40rpx) / 2);
    background: $uni-bg-color-white;
    margin-bottom: $uni-spacing-col-lg;
    overflow: hidden;
    box-shadow: 2rpx 2rpx 10rpx 0 rgba(0, 0, 0, 0.1);
    .contentBox {
      .imgCover {
        position: relative;
        width: 100%;
        flex-shrink: 0;
        margin-right: 20rpx;

        .img {
          width: 100%;
          // height: 200rpx;
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
