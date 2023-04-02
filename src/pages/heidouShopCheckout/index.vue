<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistances } from '@/utils/index'

const addressData = ref({})
const orderData = {
  priceGroup: { totalPrice: 0, vipPrice: 0 }
}
onLoad((option) => {})
function onSubmit() {

}
</script>
<template>
  <div class="container">
    <!-- 地址 -->
    <navigator
      :url="'/pages/addressList/index?type=setAddress&id=' + addressData.id"
      class="address-section"
    >
      <view class="order-content">
        <image
          class="location"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/yue/icon_13.png"
        ></image>
        <view class="cen" v-if="addressData.id">
          <view class="top">
            <text class="name">{{ addressData.real_name }}</text>
            <text class="mobile">{{ addressData.phone }}</text>
          </view>
          <text class="address"
            >{{ addressData.province }}{{ addressData.city
            }}{{ addressData.district }} {{ addressData.detail }}</text
          >
        </view>
        <view class="cen address-empty" v-else>
          <text>请选择收货地址</text>
        </view>
        <image
          class="rightImg"
          src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
        ></image>
      </view>
    </navigator>
    <view class="goods-section">
      <!-- 商品列表 -->
      <view class="g-item" v-for="item in orderData.cartInfo" :key="item.id">
        <image :src="item.productInfo.image"></image>
        <view class="right">
          <view class="title-wrapper">
            <text class="title clamp">{{ item.productInfo.store_name }}</text>
          </view>
          <view class="spec" v-if="item.sku">{{ item.sku }}</view>
          <view class="price-box">
            <text class="price">￥{{ item.money }}</text>
            <text class="number">x {{ item.cart_num }}</text>
          </view>
        </view>
      </view>
    </view>
    <!-- 金额明细 -->
    <view class="yt-list">
      <view class="yt-list-cell">
        <text class="cell-tit clamp">商品金额</text>
        <text class="cell-tip num"
          >￥{{ orderData.priceGroup.totalPrice}}</text
        >
      </view>
      <!--目前系统没有这个优惠设计-->
      <view class="yt-list-cell" v-if="orderData.priceGroup.vipPrice > 0">
        <text class="cell-tit clamp">会员优惠</text>
        <text class="cell-tip red">-￥{{ orderData.priceGroup.vipPrice }}</text>
      </view>
      <view class="yt-list-cell">
        <text class="cell-tit clamp">运费</text>
        <text class="cell-tip num">{{
          orderData.priceGroup.storePostage > 0
            ? '￥' + orderData.priceGroup.storePostage
            : '免运费'
        }}</text>
      </view>
      <!-- <view class="yt-list-cell desc-cell">
        <text class="cell-tit clamp">备注信息</text>
        <input
          v-if="showTextarea"
          class="desc"
          type="text"
          maxlength="150"
          v-model="mark"
          placeholder="请填写备注信息，150字以内"
          placeholder-class="placeholder"
        />
      </view> -->
    </view>

    <!-- 底部 -->
    <view class="footer">
      <view class="price-content">
        <text>实付款</text>
        <text class="price-tip">￥</text>
        <text class="price">{{ 100 }}元</text>
      </view>
      <text class="submit" @click="onSubmit">立即支付</text>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.address-section {
  padding: 30rpx 0;
  background: #fff;
  position: relative;
  min-height: 140rpx;
  display: block;
  box-sizing: border-box;
  width: 710rpx;
  margin: 20rpx auto;
  border-radius: 24rpx;

  .order-content {
    display: flex;
    align-items: center;
  }

  .osx-shouhuodizhi {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 90rpx;
    color: #888;
    font-size: 44rpx;
  }
  .location {
    display: inline-block;
    width: 76rpx;
    height: 76rpx;
    padding: 0 22rpx;
  }

  .cen {
    display: flex;
    flex-direction: column;
    flex: 1;
    font-size: 32rpx;
    color: #252526;
  }
  .address-empty {
    flex: 1;
    font-size: 32rpx;
    color: #909399;
    text-align: right;
    margin-right: 20rpx;
    line-height: 1;
  }
  .name {
    font-size: 34rpx;
    margin-right: 24rpx;
  }

  .address {
    margin: 12rpx 0 4rpx;
    margin-right: 20rpx;
    color: #626266;
    font-size: 32rpx;
    word-break: break-all;
  }

  .osx-you {
    font-size: 32rpx;
    color: #909399;
    margin-right: 30rpx;
  }
  .rightImg {
    display: inline-block;
    width: 12rpx;
    height: 21rpx;
    margin-right: 20rpx;
    margin-left: 20rpx;
    vertical-align: -1rpx;
  }

  .a-bg {
    position: absolute;
    left: 0;
    bottom: 0;
    display: block;
    width: 100%;
    height: 5rpx;
  }
}

.goods-section {
  width: 710rpx;
  margin: 20rpx auto;
  box-sizing: border-box;
  background: #fff;
  border-radius: 24rpx;

  .g-header {
    display: flex;
    align-items: center;
    height: 84rpx;
    padding: 0 30rpx;
    position: relative;
  }

  .logo {
    display: block;
    width: 50rpx;
    height: 50rpx;
    border-radius: 100px;
  }

  .name {
    font-size: 30rpx;
    color: #606266;
    margin-left: 24rpx;
  }

  .g-item {
    display: flex;
    padding: 40rpx 30rpx;
    image {
      flex-shrink: 0;
      display: block;
      width: 140rpx;
      height: 140rpx;
      border-radius: 4rpx;
    }

    .right {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: space-between;
      flex: 1;
      padding-left: 24rpx;
      overflow: hidden;
    }
    .title-wrapper {
      display: flex;
      align-items: center;
      font-size: 28rpx;
      color: #f92c1d;
    }
    .tag {
      flex-shrink: 0;
    }
    .title {
      font-size: 30rpx;
      color: #303133;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .spec {
      font-size: 26rpx;
      color: #909399;
      line-height: 50rpx;
      height: 50rpx;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
      word-break: break-all;
      overflow: hidden;
    }

    .price-box {
      display: flex;
      align-items: center;
      .price {
        font-size: 36rpx;
        color: #ec4738;
        font-weight: bold;
      }
      .number {
        font-size: 26rpx;
        color: #939399;
        margin-left: 20rpx;
      }
    }

    .step-box {
      position: relative;
    }
  }
}
.yt-list {
  margin: 20rpx auto;
  background: #fff;
  border-radius: 24rpx;
  width: 710rpx;
}

.yt-list-cell {
  display: flex;
  align-items: center;
  padding: 40rpx 30rpx;
  position: relative;
  &.cell-hover {
    background: #fafafa;
  }

  .cell-icon {
    height: 32rpx;
    width: 32rpx;
    font-size: 22rpx;
    color: #fff;
    text-align: center;
    line-height: 32rpx;
    background: #f85e52;
    border-radius: 8rpx;
    margin-right: 12rpx;

    &.hb {
      background: #ffaa0e;
    }

    &.lpk {
      background: #3ab54a;
    }
  }

  .cell-more {
    align-self: center;
    font-size: 24rpx;
    color: #909399;
    margin-left: 8rpx;
    margin-right: -10rpx;
  }

  .cell-tit {
    flex: 1;
    font-size: 26rpx;
    color: #909399;
    margin-right: 10rpx;
  }

  .cell-tip {
    font-size: 26rpx;
    color: #303133;

    &.disabled {
      color: #909399;
    }

    &.active {
      color: #ec4738;
      font-weight: bold;
      font-size: 26rpx;
    }
    &.red {
      color: #ec4738;
      font-size: 26rpx;
      font-weight: bold;
    }
    &.num {
      color: #252526;
      font-size: 26rpx;
      font-weight: bold;
    }
  }

  &.desc-cell {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 30rpx;
    border-bottom: none;
    .desc {
      width: 490rpx;
      color: #252526;
      font-size: 26rpx;
      text-align: right;
    }
  }
}
.footer {
  position: fixed;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  box-sizing: border-box;
  padding: 10rpx 30rpx;
  background-color: #fff;
  z-index: 99;
  padding-bottom: calc(10rpx + env(safe-area-inset-bottom));
  .price-content {
    color: #252526;
    font-size: 32rpx;
  }
  .price-tip {
    color: #ec4738;
    font-size: 32rpx;
  }
  .price {
    font-size: 36rpx;
    color: #ec4738;
    font-weight: bold;
  }
  .submit {
    width: 230rpx;
    height: 78rpx;
    line-height: 78rpx;
    border-radius: 39rpx;
    text-align: center;
    color: #fff;
    font-size: 30rpx;
    background-color: #f74e3f;
    margin-left: 30rpx;
  }
}
</style>
