<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 13:49:44
 * @LastEditTime: 2023-08-21 17:06:13
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'
import { m_fcate } from '@/common/mock.js'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const dataList = ref<object[]>([])
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
const TYPEMAP = {
  JOB: 1,
  SERVICE: 2,
  PROVIDESERVICE: 3,
  FINDSERVICE: 4
}
async function getTabs(parentId?: any) {
  try {
    const { data } = await socialApi.userDetailTagList({
      type: TYPEMAP.JOB,
      parentId,
      noPaging: true
    })
    tabs.value = data
    dataList.value = initData()
  } catch {}
}
// async function getTabs(parentId = 0) {
//   await baseApi
//     .getCategoryList({ pageSize: 1000, type: 1, parentId })
//     .then((res: { data: any }) => {
//       const { data } = res
//       // tabs.value = data.records
//       tabs.value = m_fcate
//       // tabs.value.unshift({
//       //   name: '全部',
//       //   id: ''
//       // })
//       dataList.value = initData()
//     })
//     .catch((err: any) => {})
// }
async function getDataList() {
  const item = dataList.value[currentTab.value]
  const tab = tabs.value[currentTab.value]
  const { pageIndex, pageSize, finished } = item
  if (finished) {
    status.value = 'nomore'
    return
  }
  const { data } = await socialApi.userDetailList({
    pageIndex,
    pageSize,
    detail: 'true',
    keywords: keyword.value,
    jobTagId: tab.id
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
function toDetail(data: { id: any; userId: any }) {
  uni.navigateTo({
    url: `/packageA/pages/businessCard/index?cardId=${data.id}&userId=${data.userId}`
  })
}
function tabsChange(index: any) {
  currentTab.value = index
  status.value = 'loading'
  const item = dataList.value[currentTab.value]
  if (!item.list.length) {
    getDataList()
  }
  keyword.value = ''
}
function doSearch() {
  const item = dataList.value[currentTab.value]
  item.pageIndex = 1
  item.list = []
  item.finished = false
  getDataList()
}
onLoad(async (option) => {
  if (option?.id) {
    await getTabs(option?.id)
  } else {
    await getTabs()
  }
  await getDataList()
})
onReachBottom(() => {
  status.value = 'loading'
  getDataList()
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
      <view class="swiper-item" v-for="(item, index) in dataList" :key="index">
        <view class="container" v-if="index === currentTab">
          <view
            class="itemWrap"
            v-for="data in item.list"
            :key="data.productId"
          >
            <view class="contentBox" @click="toDetail(data)">
              <view class="imgCover">
                <u-image
                  class="img"
                  border-radius="0"
                  :src="getImgFullPath(data.coverImage || data.avatar)"
                  height="300rpx"
                  :lazy-load="true"
                  mode="scaleToFill"
                />
              </view>
              <view class="content">
                <view class="name">{{ data.name }}</view>
                <view class="desc">{{ data.jobTagName }}</view>
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

        .desc {
          @include ellipsis(2);
          color: #666;
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
