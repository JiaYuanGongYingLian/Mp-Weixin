<!--
 * @Description: 对接名人主页
 * @Author: Kerwin
 * @Date: 2023-08-05 16:36:09
 * @LastEditTime: 2023-08-21 17:27:55
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const status = ref('loadmore')
const categoryList = ref([])
const famousList = reactive({
  pageIndex: 1,
  pageSize: 18,
  finished: false,
  list: []
})
function handleClickCate(item: { objectId: any }) {
  uni.navigateTo({ url: `/packageA/pages/famous/index?id=${item?.objectId}` })
}
async function getCategory() {
  const { data } = await baseApi.getAdvertisingList({
    noPaging: true,
    type: baseApi.advertising_enum.ADV_FAMOUS_LIST
  })
  categoryList.value = data
}
const getFamousList = async () => {
  if (status.value === 'nomore') return
  const { data } = await socialApi.userDetailList({
    pageIndex: famousList.pageIndex,
    pageSize: famousList.pageSize,
    detail: 'true',
    sortJson: '[{"column":"createTime","direction":"DESC"}]'
  })
  const { records, current, pages } = data
  famousList.list.push(...records)
  if (current < pages) {
    famousList.pageIndex += 1
  } else {
    famousList.finished = true
    status.value = 'nomore'
  }
}
function toFamousDetail(item: { id: any; userId: any }) {
  uni.navigateTo({
    url: `/packageA/pages/businessCard/index?cardId=${item.id}&userId=${item.userId}`
  })
}

onLoad((option) => {
  getCategory()
  getFamousList()
})
onReachBottom(() => {
  getFamousList()
})
</script>
<template>
  <view class="container">
    <view class="section">
      <view class="actions">
        <view
          v-for="item in categoryList"
          :key="item.id"
          :class="['item', `${item.objectType}`]"
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
                :src="getImgFullPath(item.avatar || item.coverImage)"
                height="300rpx"
                :lazy-load="true"
                mode="aspectFill"
              />
              <u-image
                src="https://image.blacksilverscore.com/uploads/da681ce5-0873-46dc-a5b6-a94fc8064611.png"
                mode="scaleToFill"
                width="140rpx"
                height="44rpx"
                style="position: absolute; right: 10rpx; top: 10rpx; z-index: 2"
              ></u-image>
              <u-image
                src="https://image.blacksilverscore.com/uploads/7ef270c4-80b8-4334-8f15-c555cf36693f.png"
                mode="scaleToFill"
                width="250rpx"
                height="56rpx"
                style="position: absolute; left: 0rpx; bottom: 0; z-index: 2"
              ></u-image>
            </view>
            <view class="content">
              <view class="name">{{ item.name }}</view>
              <view class="desc">{{ item.jobTagName }}</view>
            </view>
          </view>
        </view>
      </view>
      <u-loadmore :status="status" />
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

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
        max-height: 300rpx;
        overflow: hidden;
        .img {
          width: 100%;
          // height: 200rpx;
        }
      }

      .content {
        padding: 20rpx;
        text-align: left;
        .name {
          @include ellipsis;
          font-size: 30rpx;
          font-weight: bold;
        }
        .desc {
          @include ellipsis(3);
          color: #666;
          margin-top: 10rpx;
          font-size: 26rpx;
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
