<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { productApi, couponApi } from '@/api'
import { getImgFullPath, previewImage } from '@/utils/index'
import pageSkeleton from '@/components/hy-page-skeleton/index.vue'
import { useUserStore, useConfigStore } from '@/store'
import { sharePathFormat, webSharePathFormat } from '@/common/wechat-share'

const userStore = useUserStore()
const configStore = useConfigStore()
const { hasLogin, userInfo, useShareCode } = storeToRefs(userStore)
const loadingSkeleton = ref(false)
const productData = ref({})
const productId = ref()
const shopId = ref()
const skuList = reactive<object[]>([])
const shopProductSkuSelected = ref({})
const buyNumber = ref(1)
const userCoupons = ref([])
const couponSkuId = ref()

async function getProductInfo() {
  try {
    const { data } = await productApi.getShopProductInfo({
      detail: true,
      shopId: shopId.value,
      productId: productId.value
    })
    const { bannerResources, shopProductSkus } = data
    if (bannerResources && bannerResources.length) {
      data.bannerList = bannerResources.map(
        (element: { resourceUrl: string }) => {
          return getImgFullPath(element.resourceUrl)
        }
      )
    }
    data.saleCount = shopProductSkus.reduce((pre: any, cur: any) => {
      return pre + Math.abs(cur.saleCount)
    }, 0)
    data.count = shopProductSkus.reduce((pre: any, cur: any) => {
      return pre + cur.productSku.count
    }, 0)
    productData.value = data
    skuList.push({
      name: '规格',
      shopProductSkus
    })
    // 默认选中第一个sku
    selectSpec(skuList[0].shopProductSkus, skuList[0].shopProductSkus[0])
    setTimeout(() => {
      loadingSkeleton.value = false
    }, 500)
  } catch (err) {}
}
// 获取收藏状态
async function getFavoriteInfo() {
  if (!hasLogin.value) return
  const { code } = await productApi.productFavoriteInfo({
    shopProductSkuId: shopProductSkuSelected.value.id,
    shopId: shopId.value,
    userId: userInfo.value.id
  })
  productData.value.userCollect = code === 200
}

// 获取用户已有卷
async function getUserCouponList(couponId: any) {
  const { data } = await couponApi.userCouponList({
    couponId,
    userId: userInfo.value.id,
    status: 1
  })
  userCoupons.value = data.records
}

// 收藏
async function toggleFavorite(flag: any) {
  if (!userStore.checkLoginState()) return
  const executor = flag
    ? productApi.productFavoriteDelete
    : productApi.productFavoriteAdd
  const { data } = executor({
    shopProductSkuId: shopProductSkuSelected.value.id,
    shopId: shopId.value,
    userId: userInfo.value.id
  })
}

// 关闭规格-模态层弹窗
const skuPopUp = ref(false)
function togglePopupFn(flag: boolean) {
  skuPopUp.value = flag
}
// 选择sku
const actionType = ref()
function chooseSku(type: number) {
  if (!userStore.checkLoginState()) return
  const typeMap = ['toCart', 'toBuyNow', 'default']
  actionType.value = typeMap[type]
  if (productData.value.count === 0) {
    uni.showToast({
      icon: 'none',
      title: '太火爆了，该商品当前暂无库存',
      duration: 2000
    })
    return
  }
  togglePopupFn(true)
}

// 点击去核券
function showCoupon() {
  if (!userCoupons.value.length) {
    couponAdd()
    return
  }
  const coupon = JSON.stringify(userCoupons.value[0])
  uni.navigateTo({ url: `/packageB/pages/couponQrcode/index?coupon=${coupon}` })
}
// 领券
async function couponAdd() {
  const { data } = await couponApi.userCouponAdd({
    couponId: couponSkuId.value
  })
  uni.showToast({
    icon: 'none',
    title: data.msg
  })
  await getUserCouponList(couponSkuId.value)
  await showCoupon()
}

// 获取购物车数据
const totalCartNum = ref()
async function getCartProductNumFn() {
  if (!hasLogin.value) return
  try {
    const { data } = await productApi.productCartList({
      userId: userInfo.value.id,
      detail: false,
      noPaging: true
    })
    if (data) {
      totalCartNum.value = data.length
    }
  } catch (err) {
    console.log(err)
  }
}

// 跳转至购物车页面
function toCart() {
  if (!userStore.checkLoginState()) return
  uni.switchTab({
    url: '/packageB/pages/cart/index',
    success: () => {
      uni.$on('cartNum', (num) => {
        totalCartNum.value = num
      })
    }
  })
}

function numberChange() {}

// 选择规格
function selectSpec(
  shopProductSkus: { checked: boolean }[],
  activeSku: {
    [x: string]: any
    checked: boolean
  }
) {
  shopProductSkus.forEach((sku: { checked: boolean }) => {
    sku.checked = false
  })
  activeSku.checked = true
  shopProductSkuSelected.value = activeSku
  if (activeSku.couponSku) {
    if (activeSku.coupons && activeSku.coupons.length > 0) {
      const tempObj = activeSku.coupons.find(
        (item: { nameType: string }) =>
          item.nameType === 'coupon_shop_product_sku_id'
      )
      if (tempObj) {
        const couponId = tempObj.id
        couponSkuId.value = couponId
        getUserCouponList(couponId)
      }
    }
  }
}
// 添加商品到购物车
async function addToCart() {
  try {
    const { data } = await productApi.productCartAdd({
      userId: userInfo.value.id,
      shopId: shopId.value,
      shopProductSkuId: shopProductSkuSelected.value.id,
      count: 1
    })
    getCartProductNumFn()
    uni.showToast({
      icon: 'none',
      title: '添加购物车成功！'
    })
  } catch (err) {
    console.log(err)
  }
}
// 完成提交
async function confirm() {
  let shopProductSkuWalletRule = {}
  if (shopProductSkuSelected.value.shopProductSkuWalletRules) {
    shopProductSkuWalletRule =
      shopProductSkuSelected.value.shopProductSkuWalletRules.find(
        (item: { uniqueness: any }) => {
          return item.uniqueness
        }
      )
  }
  const orderData = {
    orderProductSkus: [
      {
        shopProductSku: shopProductSkuSelected.value,
        name: productData.value.name,
        skuName: shopProductSkuSelected.value.productSku.name,
        skuImage: shopProductSkuSelected.value.productSku.image,
        money: shopProductSkuSelected.value.money,
        moneyUnit: shopProductSkuWalletRule.moneyUnit || null,
        count: buyNumber.value,
        shopProductSkuId: shopProductSkuSelected.value.id,
        status: 0
      }
    ],
    status: 0
  }
  // 卖手推荐的商品，卖手获得收益
  // 2023/9/11 扫店铺码进入无shareCode则不携带
  if (uni.getStorageSync('shareCode') && useShareCode.value) {
    orderData.orderProductSkus[0].externalData = {
      userShareCode: uni.getStorageSync('shareCode')
    }
  }
  const orderJson = JSON.stringify(orderData)
  togglePopupFn(false)
  if (actionType.value === 'toBuyNow') {
    uni.setStorageSync('orderJson', orderJson)
    uni.navigateTo({
      url: '/pages/productCheckout/index'
    })
  }
  if (actionType.value === 'toCart') {
    addToCart()
  }
}
const byShare = ref(false)
function toHome() {
  if (byShare.value) {
    uni.redirectTo({ url: `/pages/physicalShop/index?shopId=${shopId.value} ` })
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

const shareData = ref({})

onLoad(async (option) => {
  if (!option?.shareCode) {
    userStore.syncSetUseShareCode(false)
  } else if (option?.shareCode !== userInfo.value.shareCode) {
    uni.setStorageSync('shareCode', option?.shareCode)
  }
  if (option?.qrcode) {
    byShare.value = !!option?.qrcode
  }
  productId.value = option.productId
  shopId.value = option.shopId
  loadingSkeleton.value = true
  await getProductInfo()
  await getFavoriteInfo()
  await getCartProductNumFn()
  shareData.value = {
    title: productData.value.name,
    desc: productData.value.subtitle ?? '',
    // #ifdef MP-WEIXIN
    imageUrl: getImgFullPath(productData.value.image),
    path: sharePathFormat({ productId: productId.value, shopId: shopId.value }),
    // #endif
    // #ifdef H5
    imgUrl: getImgFullPath(productData.value.image),
    link: webSharePathFormat({
      productId: productId.value,
      shopId: shopId.value
    })
    // #endif
  }
})
const shareComp = ref()
function showShare() {
  // #ifdef H5
  shareComp.value.showPop()
  // #endif
}
onShareAppMessage(() => {
  return shareData.value
})
</script>
<template>
  <div class="main">
    <page-skeleton :loading="loadingSkeleton" :type="2"></page-skeleton>
    <hy-nav-bar :title="'商品详情'"></hy-nav-bar>
    <!--商品图轮播-->
    <u-swiper
      class="swiper"
      indicator-dots
      :circular="true"
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
          <view class="price-tip" v-if="!productData.moneyUnit">￥</view>
          <view class="price"
            >{{ shopProductSkuSelected.money || productData.money }}
            <text class="origin"
              >￥{{
                shopProductSkuSelected.originalMoney ||
                productData.originalMoney
              }}</text
            >
          </view>
          <view class="price-tip" v-if="productData.moneyUnit">黑豆</view>
        </view>
        <view class="bot-row">
          <view class="text">销量 {{ productData.saleCount || 0 }}</view>
        </view>
      </view>
      <view class="intro-top">
        <view class="intro-top-tit">
          <view class="title f-m">{{ productData.name }}</view>
          <view class="subtitle">{{ productData.subtitle }}</view>
        </view>
        <!-- #ifdef MP -->
        <view class="share-content">
          <image
            class="img"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/share01.png"
          ></image>
          <view class="text">分享</view>
          <button open-type="share" class="btn" @click="showShare"></button>
        </view>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <hy-share ref="shareComp" :shareData="shareData" />
        <!-- #endif -->
      </view>
    </view>
    <view class="c-list section yhq">
      <view class="c-row">
        <view class="tit">选项</view>
        <view class="bz-list">
          <view class="text">{{ shopProductSkuSelected.name }}</view>
        </view>
        <text class="iconfont hy-icon-more" @click="chooseSku(2)"></text>
      </view>
      <view class="c-row start" v-if="productData.couponSku">
        <view class="tit">套餐内容</view>
        <view class="bz-list con">
          <view v-for="item in productData.shopProductSkus" :key="item.id">
            <view class="con_name">
              <view class="name">{{ item.name }}</view>
              <view class="price">￥{{ item.money }}</view>
            </view>
            <view
              class="con_con"
              v-for="con in item.shopProductSkuContents"
              :key="con.id"
            >
              <text>{{ con.content }}</text> x {{ con.count }}
              <text class="money">￥{{ con.money }}</text>
            </view>
          </view>
        </view>
      </view>
      <view class="c-row">
        <view class="tit">服务</view>
        <view class="bz-list">
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
          class="car"
          :class="{ active: productData.userCollect }"
          @tap="toHome"
        >
          <u-icon name="home" size="40" class="pic"></u-icon>
          <view>首页</view>
        </view>
        <!-- <view
          class="p-b-btn"
          :class="{ active: productData.userCollect }"
          @tap="toggleFavorite(productData.userCollect)"
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
        </view> -->
        <view class="car" v-if="!productData.couponSku" @click="toCart">
          <image
            class="pic"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newHome/buyCar.png"
          ></image>
          <view>购物车</view>
          <view class="num" v-if="totalCartNum > 0">{{ totalCartNum }}</view>
        </view>
      </view>
      <view class="action-btn-group">
        <view
          class="action-btn carBtn"
          v-if="!productData.couponSku"
          @click="chooseSku(0)"
          >加入购物车</view
        >
        <view
          class="action-btn buyNowBtn single"
          v-if="productData.couponSku"
          @click="showCoupon"
        >
          {{ userCoupons.length > 0 ? '立即核券' : '领券核券' }}</view
        >
        <view v-else class="action-btn buyNowBtn" @tap="chooseSku(1)"
          >立即购买</view
        >
      </view>
    </view>
    <!-- 规格-模态层弹窗 -->
    <view class="sku-popup" v-if="skuPopUp" @tap.stop="togglePopupFn(false)">
      <view class="attr-content" @tap.stop="togglePopupFn(true)">
        <view class="a-t">
          <image
            :src="
              getImgFullPath(
                shopProductSkuSelected.productSku.image || productData.image
              )
            "
          ></image>
          <view class="right">
            <view class="price"
              ><text class="symbol" v-if="!productData.moneyUnit">￥</text
              >{{ shopProductSkuSelected.money || productData.money
              }}<text class="symbol" v-if="productData.moneyUnit"
                >黑豆</text
              ></view
            >
            <view class="stock"
              >库存：{{
                shopProductSkuSelected.productSku.count || productData.count
              }}件</view
            >
            <view class="selected">
              已选：
              <view class="selected-text" style="display: inline-block">
                {{ shopProductSkuSelected.productSku.name || '' }}
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
              v-for="(item, index) in skuItem.shopProductSkus"
              :key="index"
              class="text tit"
              :class="{ selected: item.checked }"
              @click="selectSpec(skuItem.shopProductSkus, item)"
            >
              {{ item.productSku.name }}
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
              shopProductSkuSelected.checked
                ? shopProductSkuSelected.productSku.count
                : productData.count
            "
            @change="numberChange"
          ></u-number-box>
        </view>
        <button
          class="common-btn red btn"
          :disabled="
            skuList.length > 0 &&
            (!shopProductSkuSelected.checked ||
              shopProductSkuSelected.count == 0)
          "
          @click.stop="confirm"
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
    .origin {
      font-size: 28rpx;
      font-weight: bold;
      text-decoration: line-through;
      color: $uni-text-color-grey;
    }
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
    position: relative;
    .btn {
      background-color: transparent;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      &::after {
        border: none;
      }
    }
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
  .intro-top-tit {
    flex: 1;
    .title {
      font-size: 32rpx;
      color: #242526;
      line-height: 50rpx;
      display: block;
      width: 600rpx;
      font-weight: bold;
    }
  }
  &.price {
    margin-bottom: 16rpx;
  }
  .seeCoupon {
    color: #f74e3f;
    font-size: 26rpx;
    margin-top: 16rpx;
  }
  .subtitle {
    margin-top: 10rpx;
    font-size: 26rpx;
    color: #a1a1a1;
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
    &.start {
      align-items: flex-start;
    }
    .hy-icon-more {
      &::before {
        color: #333;
        font-size: 36rpx;
        font-weight: bold;
      }
    }
  }

  .tit {
    width: 140rpx;
  }

  .bz-list {
    color: #303133;
    flex: 1;
    .text {
      display: inline-block;
      margin-right: 30rpx;
      line-height: 40rpx;
      height: 40rpx;
      font-size: 28rpx;
      max-width: 85%;
      &:last-child {
        margin: 0;
      }

      text {
        color: #c4cacc;
        font-size: 40rpx;
        margin-left: 10rpx;
      }
    }
    &.con {
      color: #303133;
      font-size: $uni-font-size-base;
      .con_name {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        .name {
          font-weight: bold;
          margin-top: 5rpx;
        }
        .price {
          font-weight: bold;
        }
      }
      .con_con {
        margin: 20rpx 0;
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
  padding-bottom: 120rpx;
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
  box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, 0.1);

  .leftBox {
    display: flex;
    justify-content: space-between;
    align-content: center;
    gap: 20rpx;
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
      &.single {
        width: 100%;
        border-radius: 78rpx !important;
      }
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
