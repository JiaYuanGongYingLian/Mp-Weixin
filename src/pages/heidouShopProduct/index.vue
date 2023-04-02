<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { productApi } from '@/api'
import { getImgFullPath, previewImage } from '@/utils/index'
import pageSkeleton from '@/components/hy-page-skeleton/index.vue'

const loadingSkeleton = ref(false)
const productData = ref({})
const productId = ref()
const shopId = ref()
async function getProductInfo() {
  try {
    const { data } = await productApi.getShopProductInfo({
      detail: true,
      shopId: shopId.value,
      productId: productId.value
    })
    const { bannerResources } = data
    data.bannerList = bannerResources.map(
      (element: { resourceUrl: string }) => {
        return getImgFullPath(element.resourceUrl)
      }
    )
    data.saleCount = data.shopProductSkus.reduce((pre: any, cur: any) => {
      return pre.saleCount + cur.saleCount
    }, 0)
    productData.value = data
    setTimeout(() => {
      loadingSkeleton.value = false
    }, 500)
  } catch (err) {}
}
function shareGroupFn() {}
onLoad((option) => {
  productId.value = option.productId
  shopId.value = option.shopId
  loadingSkeleton.value = true
  getProductInfo()
})
</script>
<template>
  <div class="main">
    <page-skeleton :loading="loadingSkeleton" :type="2"></page-skeleton>
    <!--商品图轮播-->
    <u-swiper
      class="swiper"
      indicator-dots
      circular="true"
      duration="400"
      height="750"
      mode="number"
      indicator-pos="bottomRight"
      :list="productData.bannerList"
      @click="previewImage(productData.bannerList, $event)"
    >
    </u-swiper>
    <!--商品简介-->
    <view class="introduce-section section">
      <view class="intro-top price">
        <view class="price-box">
          <view class="price">{{ productData.money }} </view>
          <view class="price-tip">黑豆</view>
        </view>
        <view class="bot-row">
          <view class="text">销量 {{ productData.saleCount || 0 }}</view>
        </view>
      </view>
      <view class="intro-top">
        <view>
          <view class="title f-m">{{ productData.name }}</view>
        </view>

        <view class="share-content" @tap="shareGroupFn">
          <image
            class="img"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/share01.png"
          ></image>
          <view class="text">分享</view>
        </view>
      </view>
    </view>
    <view class="c-list m-t section yhq">
      <!--服务-->
      <view class="c-row">
        <view class="tit">服务</view>
        <view class="bz-list con">
          <view class="text">7天无理由退换货 <text>·</text></view>
          <view class="text">假一赔十 <text>·</text></view>
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.introduce-section {
  background: #fff;
  padding: 40rpx 30rpx;
  position: relative;

  .title {
    font-size: 32rpx;
    color: #242526;
    line-height: 50rpx;
    display: block;
    width: 600rpx;
    font-weight: bold;
  }

  .price-box {
    display: flex;
    align-items: center;
    font-size: 26rpx;
    color: #f75931;
  }

  .price {
    font-size: 40rpx;
    font-weight: bold;
    margin-right: 10rpx;
  }
  .m-price {
    margin: 0 12rpx;
    color: #a6abad;
    text-decoration: line-through;
    font-weight: normal;
  }

  .bot-row {
    display: flex;
    align-items: center;
    height: 50rpx;
    font-size: 24rpx;
    color: #909399;

    .text {
      flex: 1;
      font-weight: normal;
    }
  }

  .share-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    top: 30rpx;
    flex-shrink: 0;

    .img {
      width: 64rpx;
      height: 64rpx;
    }

    .text {
      font-size: 20rpx;
      color: #242626;
      font-weight: bolder;
    }
  }
}
.section {
  background: #ffffff;
  box-shadow: 0px 8rpx 30rpx 0rpx rgba(0, 0, 0, 0.02);
  border-radius: 24rpx;
  width: calc(100% - 40rpx);
  margin: 20rpx;
  box-sizing: border-box;
  overflow: hidden;

  &.yhq {
    padding: 7rpx 0;
  }

  &.eva {
    padding: 20rpx 0 10rpx 0;
  }
}

.intro-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  &.price {
    margin-bottom: 16rpx;
  }
  .seeCoupon {
    color: #f74e3f;
    font-size: 26rpx;
    margin-top: 16rpx;
  }
}
.c-list {
  font-size: 30rpx;
  color: #a6abad;
  background: #fff;

  .c-row {
    display: flex;
    align-items: center;
    padding: 28rpx 30rpx;
    position: relative;

    .osx-you {
      image {
        width: 15rpx;
        height: 20rpx;
      }
      .getCoupon {
        color: #f74e3f;
        font-size: 26rpx;
        width: 70rpx;
        height: 40rpx;
        line-height: 40rpx;
        text-align: center;
        border-radius: 4rpx;
        border: 1px solid #f74e3f;
      }
    }
  }

  .tit {
    width: 140rpx;
  }

  .con {
    flex: 1;
    color: #303133;

    .selected-text {
      margin-right: 10rpx;
    }

    &.disabled {
      color: #a6abad;
    }

    &.sku-con {
      display: flex;
      align-items: centerm;
      justify-content: space-between;

      .num {
        margin-right: 10rpx;
      }
    }
  }

  .bz-list {
    height: 40rpx;
    color: #303133;

    .text {
      display: inline-block;
      margin-right: 30rpx;
      line-height: 40rpx;
      height: 40rpx;

      &:last-child {
        margin: 0;
      }

      text {
        color: #c4cacc;
        font-size: 40rpx;
        margin-left: 10rpx;
      }
    }
  }

  .red {
    color: #f92c1d;
  }
}
</style>
