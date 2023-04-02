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
const skuList = reactive<object[]>([])
const skuCheckedList = ref<object[]>([])
const skuCheckedItem = ref({})
const buyNumber = ref()

async function getProductInfo() {
  try {
    const { data } = await productApi.getShopProductInfo({
      detail: true,
      shopId: shopId.value,
      productId: productId.value
    })
    const { bannerResources, shopProductSkus } = data
    data.bannerList = bannerResources.map(
      (element: { resourceUrl: string }) => {
        return getImgFullPath(element.resourceUrl)
      }
    )
    data.count = shopProductSkus.reduce((pre: any, cur: any) => {
      return pre + cur.productSku.count
    }, 0)
    productData.value = data
    const skus = shopProductSkus.reduce((pre: any, cur: any) => {
      pre.push(cur.productSku)
      return pre
    }, [])
    skuList.push({
      name: '规格',
      skus
    })
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
function toFavorite() {}

// 立即购买或者加入购物车
const skuPopUp = ref(false)
function chooseSku() {
  if (productData.value.stock === 0) {
    uni.showToast({
      icon: 'none',
      title: '太火爆了，该商品当前暂无库存',
      duration: 2000
    })
    return
  }
  skuPopUp.value = true
}
// 关闭规格-模态层弹窗
function closePopupFn(flag: boolean) {
  skuPopUp.value = flag
}
// 获取购物车数据
const totalCartNum = ref()
function getCartProductNumFn() {
  totalCartNum.value = 2
}
getCartProductNumFn()
function numberChange() {}
// 选择规格
function selectSpec(item: any, skuIndex: number) {
  const skuItem = skuList[skuIndex]
  // 取消同规格以选中属性
  skuItem.skus.forEach((sku: { checked: boolean }) => {
    // eslint-disable-next-line no-param-reassign
    sku.checked = false
  })
  item.checked = true

  // 设置以选中规格
  // eslint-disable-next-line no-shadow
  const skuCheckedList_temp: any[] = []
  let checkSkuIds = ''
  // eslint-disable-next-line no-shadow
  skuList.forEach((skuObj) => {
    skuObj.skus.forEach((sku: { checked: any; name: string }) => {
      if (sku.checked) {
        skuCheckedList_temp.push(sku)
        checkSkuIds += checkSkuIds === '' ? skuObj.name : `,${sku.name}`
      }
    })
  })

  skuCheckedList.value = skuCheckedList_temp
  if (skuCheckedList.value.length === 0) {
    skuCheckedItem.value.checked = false
    return
  }

  // 获取sku库存、价格信息
  skuCheckedItem.value = item
  if (buyNumber.value > skuCheckedItem.value.count) {
    buyNumber.value = skuCheckedItem.value.count
  }
}
function confirm() {
  uni.navigateTo({
    url: '/pages/heidouShopCheckout/index'
  })
}
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
    <!--服务-->
    <view class="c-list m-t section yhq">
      <view class="c-row">
        <view class="tit">服务</view>
        <view class="bz-list con">
          <view class="text">48小时内发货 <text>·</text></view>
          <view class="text">下单两小时不可修改订单信息 <text>·</text></view>
        </view>
      </view>
    </view>
    <!--图文详情-->
    <view class="detail-desc">
      <view class="d-header">
        <view class="text">图文详情</view>
      </view>
      <!-- <rich-text :nodes="productData.description"></rich-text> -->
      <view>
        <u-image
          class="image"
          v-for="item in productData.resources"
          :key="item.id"
          :src="getImgFullPath(item.resourceUrl)"
          mode="widthFix"
        ></u-image>
      </view>
    </view>
    <!-- 底部操作菜单 -->
    <view class="actionBar">
      <view class="leftBox">
        <view
          class="p-b-btn"
          :class="{ active: productData.userCollect }"
          @tap="toFavorite(productData.userCollect)"
        >
          <image
            class="pic"
            v-if="productData.userCollect"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/nav_2_c.png"
          ></image>
          <image
            class="pic"
            v-else
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/icon_b_tab_03.png"
          ></image>
          <view>收藏</view>
        </view>
        <view class="car" data-url="/packageB/car" @click="goUrlFn">
          <image
            class="pic"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/buyCar.png"
          ></image>
          <view>购物车</view>
          <view class="num" v-if="totalCartNum > 0">{{ totalCartNum }}</view>
        </view>
      </view>
      <view class="action-btn-group">
        <view class="action-btn carBtn" @click="chooseSku()">加入购物车</view>
        <view class="action-btn buyNowBtn" @tap="chooseSku()">立即购买</view>
      </view>
    </view>
    <!-- 规格-模态层弹窗 -->
    <view class="sku-popup" v-if="skuPopUp" @tap.stop="closePopupFn(false)">
      <view class="attr-content" @tap.stop="closePopupFn(true)">
        <view class="a-t">
          <image
            :src="getImgFullPath(skuCheckedItem.image || productData.image)"
          ></image>
          <view class="right">
            <view class="price"
              >{{
                skuCheckedItem.checked
                  ? skuCheckedItem.money
                  : productData.money
              }}<text class="symbol">黑豆</text></view
            >
            <view class="stock"
              >库存：{{
                skuCheckedItem.checked
                  ? skuCheckedItem.count
                  : productData.count
              }}件</view
            >
            <view class="selected">
              {{ skuCheckedList.length === 0 ? '' : '已选：' }}
              <view class="selected-text" style="display: inline-block">
                {{ skuCheckedItem.name || '' }}
              </view>
            </view>
          </view>
        </view>
        <view
          v-for="(skuItem, skuIndex) in skuList"
          :key="skuIndex"
          class="attr-list"
        >
          <view class="f-m">{{ skuItem.name }}</view>
          <view class="item-list">
            <view
              v-for="(item, index) in skuItem.skus"
              :key="index"
              class="text tit"
              :class="{ selected: item.checked }"
              @click="selectSpec(item, skuIndex)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
        <view class="number-box-wrapper">
          <view class="tit f-m">购买数量</view>
          <u-number-box
            v-model="buyNumber"
            :input-width="100"
            :input-height="60"
            :min="1"
            :max="
              skuCheckedItem.checked ? skuCheckedItem.count : productData.count
            "
            @change="numberChange"
          ></u-number-box>
        </view>
        <button
          class="common-btn red btn"
          :disabled="
            skuList.length > 0 &&
            (!skuCheckedItem.checked || skuCheckedItem.count == 0)
          "
          @tap="confirm"
        >
          完成
        </button>
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
    color: #303133;
    .text {
      display: inline-block;
      margin-right: 30rpx;
      line-height: 40rpx;
      height: 40rpx;
      font-size: 28rpx;
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
/*  图文详情 */
.detail-desc {
  margin-top: 16rpx;

  .d-header {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 115rpx;
    line-height: 115rpx;
    font-size: 30rpx;
    color: #303133;
    position: relative;

    .text {
      padding: 0 20rpx;
      position: relative;
      z-index: 1;
      color: #a6abad;
      background: $uni-bg-color;
    }

    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%);
      width: 300rpx;
      height: 0;
      content: '';
      border-bottom: 2rpx solid #ccc;
    }
  }
  :deep(.image) {
    image {
      display: block;
      height: 100%;
    }
  }
}

/* 底部操作菜单 */
.actionBar {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 95;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 10rpx 30rpx;
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
  box-sizing: border-box;
  background: #fff;
  border-radius: 0;

  .leftBox {
    display: flex;
    justify-content: space-between;
    align-content: center;
    gap: 40rpx;
    .car {
      width: 70rpx;
      position: relative;
      font-size: 22rpx;
      color: #242526;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .pic {
        display: block;
        margin: 0 auto;
        width: 40rpx;
        height: 40rpx;
        margin-bottom: 6rpx;
      }
      .num {
        width: 36rpx;
        height: 36rpx;
        text-align: center;
        line-height: 36rpx;
        font-size: 20rpx;
        color: #fff;
        position: absolute;
        top: 0;
        right: 0;
        border-radius: 50%;
        background-color: #f74e3f;
      }
    }

    .p-b-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 22rpx;
      color: #242526;
      // width: 100rpx;
      height: 100rpx;
      text-align: center;

      .pic {
        display: block;
        margin: 0 auto;
        width: 40rpx;
        height: 40rpx;
        margin-bottom: 6rpx;
      }

      &.active {
        color: #f75931;
      }
    }
  }

  .action-btn-group {
    display: flex;
    width: 400rpx;
    height: 78rpx;
    overflow: hidden;
    position: relative;
    justify-content: flex-end;
    .action-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 200rpx;
      height: 78rpx;
      line-height: 78rpx;
      font-size: 30rpx;
      color: #fff;
      padding: 0;
      border-radius: 0;
    }

    .buyNowBtn {
      background-color: #f74e3f;
      border-radius: 0 100rpx 100rpx 0;
    }
    .carBtn {
      background-color: #fee7de;
      border-radius: 100rpx 0 0 100rpx;
      color: #f74e3f;
    }
  }
}

/* 规格选择弹窗 */
.sku-popup {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.6);

  .attr-content {
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    min-height: 30vh;
    border-radius: 10rpx 10rpx 0 0;
    box-sizing: border-box;
    padding: 10rpx 30rpx;
    padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
    display: flex;
    flex-direction: column;

    .a-t {
      display: flex;

      image {
        width: 170rpx;
        height: 170rpx;
        flex-shrink: 0;
        margin-top: -40rpx;
        border-radius: 8rpx;
      }

      .right {
        display: flex;
        flex-direction: column;
        padding-left: 24rpx;
        font-size: 32rpx;
        color: #606266;
        line-height: 42rpx;
        .symbol {
          font-size: 26rpx;
          margin-left: 5rpx;
        }
        .price {
          font-size: 36rpx;
          color: #f92c1d;
          margin-bottom: 10rpx;
          line-height: 1.4;
          .discount {
            background-color: #f75931;
            margin-left: 10rpx;
            border-radius: 24rpx;
            padding: 8rpx 20rpx;
            color: #fff;
            font-size: 24rpx;
            vertical-align: 6rpx;
            .symbol {
              margin-left: 10rpx;
            }
            .endPrice {
              font-size: 34rpx;
              font-weight: bold;
            }
          }
        }

        .stock {
          line-height: 1.4;
        }

        .selected {
          line-height: 1.4;
          margin-top: 4rpx;
        }

        .selected-text {
          margin-right: 10rpx;
        }
      }
    }
    .subBox {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      .sub {
        padding: 50rpx 50rpx 50rpx 0;
        position: relative;
        .name {
          color: #313133;
          font-size: 30rpx;
        }
        .num {
          color: #252526;
          font-size: 36rpx;
          font-weight: bold;
          margin-top: 10rpx;
        }
        .num.red {
          color: #ec4738;
        }
      }
      .second {
        padding-left: 50rpx;
      }
      .second:before {
        content: '';
        position: absolute;
        width: 2rpx;
        height: 40rpx;
        background-color: #f1f1f1;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
        z-index: 2;
      }
    }
    .attr-list {
      display: flex;
      flex-direction: column;
      font-size: 28rpx;
      color: #303133;
      padding-top: 30rpx;
      padding-left: 10rpx;
    }

    .item-list {
      padding: 20rpx 0 0;
      display: flex;
      flex-wrap: wrap;

      .text {
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
        border-radius: 100rpx;
        min-width: 60rpx;
        height: 60rpx;
        padding: 0 20rpx;
        font-size: 28rpx;
        color: #606266;
      }

      .selected {
        background: #fff2f1;
        color: #f92c1d;
      }
    }

    /* 购买数量 */
    .number-box-wrapper {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 14px;
      color: #333;
      padding: 20rpx 10rpx 10rpx 10rpx;

      .tit {
        font-size: 30rpx;
        color: #333;
        padding: 30rpx 10rpx 10rpx 10rpx;
      }
    }

    .common-btn {
      margin: 28rpx auto 20rpx;
      width: 690rpx;
      height: 80rpx;
      line-height: 80rpx;
      color: #fff;
      background: linear-gradient(90deg, #f74f43, #f74f43);
    }
  }
}
</style>
