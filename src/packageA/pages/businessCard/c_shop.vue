<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-22 03:31:09
 * @LastEditTime: 2023-11-15 17:40:39
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const props = defineProps({
  shopId: {
    type: Number
  }
})

const status = ref('loadmore')
const imgHeight = ref('200rpx')
const productList = reactive({
  pageIndex: 1,
  pageSize: 20,
  finished: false,
  list: []
})
const getProductList = async () => {
  if (status.value === 'nomore') return
  const { data } = await productApi.getShopProductList({
    pageIndex: productList.pageIndex,
    pageSize: productList.pageSize,
    shopId: props.shopId // 黑银商家
  })
  const { records, current, pages } = data
  productList.list.push(...records)
  if (current < pages) {
    productList.pageIndex += 1
  } else {
    productList.finished = true
    status.value = 'nomore'
  }
}
watch(props, (nweProps) => {
  if (nweProps.shopId) {
    getProductList()
  }
})
function toProductDetail(product: any) {
  const { shopId, productId } = product
  if (userStore.checkLoginState()) {
    uni.navigateTo({
      url: `/packageA/pages/productDetail/index?shopId=${shopId}&productId=${productId}`
    })
  }
}
onMounted(() => {
  // #ifdef H5
  uni.getSystemInfo({
    success: (res) => {
      const { windowWidth } = res
      imgHeight.value = `${(windowWidth - 10) / 2}rpx`
    }
  })
  // #endif
})
onReachBottom(() => {
  getProductList()
})
</script>
<template>
  <view class="c_container">
    <view class="wrapper">
      <view
        class="itemWrap"
        v-for="product in productList.list"
        :key="product.id"
      >
        <view class="contentBox" @click="toProductDetail(product)">
          <view class="imgCover">
            <u-image
              class="img"
              border-radius="0"
              :src="getImgFullPath(product.image)"
              :height="imgHeight"
              :lazy-load="true"
              mode="aspectFill"
            />
          </view>
          <view class="content">
            <view class="name">{{ product.name }}</view>
            <view class="money">￥{{ product.money }}</view>
          </view>
        </view>
      </view>
    </view>
    <u-loadmore :status="status" margin-top="100" />
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
          border-radius: $section-raduis;
        }
      }

      .content {
        padding: 20rpx;

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
