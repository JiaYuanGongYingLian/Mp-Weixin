<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-22 03:31:09
 * @LastEditTime: 2023-07-22 04:33:09
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'
import { m_productList } from "@/common/mock.js"

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const imgHeight = ref('200rpx')
const productList = m_productList
function toProductDetail(product: any) {
  const {shopId,productId} = product
  if (checkLoginState()) {
    uni.navigateTo({
      url: `/pages/productDetail/index?shopId=${shopId}&productId=${productId}`
    })
  }
}
onMounted((option) => {
  // #ifdef H5
  uni.getSystemInfo({
    success: (res) => {
      const { windowWidth } = res
      imgHeight.value = `${(windowWidth - 10) / 2}rpx`
    }
  })
  // #endif
})
</script>
<template>
  <view class="wrapper">
    <view class="itemWrap" v-for="product in productList" :key="product.id">
      <view class="contentBox" @click="toProductDetail(product)">
        <view class="imgCover">
          <u-image class="img" border-radius="0" :src="getImgFullPath(product.image)" :height="imgHeight"
            :lazy-load="true" mode="aspectFill" />
        </view>
        <view class="content">
          <view class="name">{{ product.name }}</view>
          <view class="money">￥{{ product.money }}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.wrapper {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  .itemWrap {
    width: calc((100% - 30rpx) / 2);
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
