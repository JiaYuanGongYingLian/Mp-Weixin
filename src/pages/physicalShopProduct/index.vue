<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistances, previewImage } from '@/utils/index'

const productData = ref({})
const productId = ref()
async function getProductInfo() {
  try {
    const { data } = await productApi.getShopProductInfo({
      detail: true,
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
  } catch (err) {}
}
function shareGroupFn() {}
onLoad((option) => {
  productId.value = option.productId
  getProductInfo()
})
</script>
<template>
  <div class="main">
    <!--商品图轮播-->
    <view class="carousel">
      <swiper class="swiper" indicator-dots circular="true" duration="400">
        <swiper-item
          class="swiper-item"
          v-for="(banner, index) in productData.bannerList"
          :key="index"
        >
          <view class="image-wrapper">
            <image
              :src="banner"
              class="loaded"
              mode="aspectFill"
              @click="previewImage(productData.bannerList, index)"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
    <!--商品简介-->
    <view class="introduce-section section">
      <view class="intro-top price">
        <view class="price-box">
          <view class="price-tip">¥</view>
          <view class="price">{{ productData.money }}</view>
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
      <!--购买类型-->
      <view
        class="c-row b-b"
        @tap="toggleSpec('skuPopUp', true)"
        v-if="skuList.length > 0 && seckill_id"
      >
        <view class="tit">购买类型</view>
        <view class="con sku-con">
          <view class="selected-text">
            {{ skuCheckedItem.suk || '' }}
          </view>
          <view class="num">x {{ buyNumber }}</view>
        </view>
        <view class="osx osx-you">
          <image
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
          ></image>
        </view>
      </view>
      <!--优惠券-->
      <view
        class="c-row b-b"
        @tap="toggleSpec('couponPopUp')"
        v-if="couponList.length > 0 && !isDiscount"
      >
        <view class="tit">优惠券</view>
        <view class="con" :class="hasCoupon ? '' : 'disabled'">
          {{
            hasCoupon
              ? '领取' + (couponList[0].coupon_price | price) + '元优惠券'
              : '暂无优惠券可领取'
          }}
        </view>
        <view class="osx osx-you">
          <!--					<image src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"></image>-->
          <view class="getCoupon">领券</view>
        </view>
      </view>
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
.carousel {
  width: 100%;
  overflow: hidden;
  position: relative;

  .swiper {
    height: 750rpx;
    .image-wrapper {
      width: 100%;
      height: 100%;
    }

    .swiper-item {
      display: flex;
      justify-content: center;
      align-content: center;
      height: 750rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
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
</style>
