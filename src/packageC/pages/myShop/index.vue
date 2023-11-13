<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-16 09:49:16
 * @LastEditTime: 2023-11-13 15:57:54
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { productApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const shopList = reactive({
  pageIndex: 1,
  pageSize: 20,
  finished: false,
  list: []
})
const status = ref('loadmore')
async function getShopList() {
  if (shopList.finished) return
  const { data } = await productApi.getShopList({
    pageIndex: shopList.pageIndex,
    pageSize: shopList.pageSize,
    shopType: 3,
    userId: userInfo.value.id,
    status: 20,
    detail: 'true',
    otherColumns: 'vipReserve'
  })
  const { records, current, pages } = data
  if (records && records.length > 0) {
    records.forEach((shop: object) => {
      const { provinceName, cityName, districtName, street, other } =
        shop.address
      shop.addr = provinceName + cityName + districtName + street + other
    })
    shopList.list.push(...records)
  }

  if (current < pages) {
    shopList.pageIndex += 1
  } else {
    shopList.finished = true
    status.value = 'nomore'
  }
}
function toEdit(id: any) {
  uni.navigateTo({
    url: `/packageC/pages/shopEnter/index?shopId=${id}`
  })
}
onLoad((option) => {
  if (option) {
    const { xx } = option
  }
  getShopList()
})
onReachBottom(() => {
  getShopList()
})
</script>
<template>
  <view class="container">
    <view
      class="shop"
      v-for="(shop, index) in shopList.list"
      :key="shop.id + index"
    >
      <view class="contentBox" @click="toEdit(shop.id)">
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
          </view>
          <text class="vip" v-if="shop.vipReserveRoleCount > 0"
            >消费领会员</text
          >
        </view>
      </view>
    </view>
    <u-loadmore :status="status" v-if="shopList.list.length > 3" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.container {
  padding: 30rpx;
}
.shop {
  border-radius: $section-raduis;
  background: $uni-bg-color-white;
  margin-bottom: $uni-spacing-col-lg;
  padding: $uni-spacing-row-lg;
  margin-top: 20rpx;
  text-align: left;
  .contentBox {
    display: flex;

    .imgCover {
      position: relative;
      width: 160rpx;
      flex-shrink: 0;
      margin-right: 20rpx;

      .img {
        width: 100%;
        // height: 200rpx;
        border-radius: $section-raduis;
      }
    }

    .content {
      position: relative;
      .name {
        font-size: 32rpx;
        width: 75%;
        display: inline-block;
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
      .vip {
        position: absolute;
        right: 0;
        top: 0;
        border: 1px solid $uni-text-color-red;
        color: $uni-text-color-red;
        font-size: 18rpx;
        padding: 5rpx;
        border-radius: 10rpx;
      }
    }
  }
}
</style>
