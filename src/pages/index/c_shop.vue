<!-- eslint-disable no-unused-expressions -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-11-19 17:53:57
 * @LastEditTime: 2023-12-05 01:05:12
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'
import { productApi } from '@/api'
import { getImgFullPath } from '@/utils'
import { useConfigStore } from '@/store'

const configStore = useConfigStore()
const status = ref('loadmore')
// 门店列表
const shopList = reactive({
  pageIndex: 1,
  pageSize: 18,
  list: []
})
const getShopList = async () => {
  if (status.value === 'nomore') return
  status.value = 'loading'
  const { data } = await productApi.getShopList({
    pageIndex: shopList.pageIndex,
    pageSize: shopList.pageSize,
    detail: 'true',
    otherColumns: 'moneyRuleDetails,vipReserveRoleCount,coupons',
    shopType: 3,
    // categoryId: tab.id,
    distance: 1
  })
  const { records, current, pages } = data
  shopList.list.push(...records)
  const index = shopList.list.findIndex((item) => item.id === 3)
  const index2 = shopList.list.findIndex((item) => item.id === 11)
  const index3 = shopList.list.findIndex((item) => item.id === 21)
  if (index > 0 && configStore.hideData) {
    shopList.list.splice(index, 1)
    shopList.list.splice(index2, 1)
    shopList.list.splice(index3, 1)
  }
  const indexs: number[] = []
  shopList.list.forEach((item, index) => {
    if (!configStore.hideData) return
    if (item.name.indexOf('酒') > 0) {
      indexs.push(index)
    }
    if (item.name.indexOf('贵') > 0) {
      indexs.push(index)
    }
    if (item.name.indexOf('乳') > 0) {
      indexs.push(index)
    }
  })
  indexs.forEach((i) => {
    shopList.list.splice(i, 1)
  })
  if (current < pages) {
    shopList.pageIndex += 1
  } else {
    status.value = 'nomore'
  }
  // const { data } = await productApi.getShopProductList({
  //   pageIndex: productList.pageIndex,
  //   pageSize: productList.pageSize,
  //   shopId: 225 // 黑银商家
  // })
  // const { records, current, pages } = data
  // productList.list.push(...records)
  // if (current < pages) {
  //   productList.pageIndex += 1
  // } else {
  //   productList.finished = true
  // }
}
// 点击进入店铺
function toShopDetail(id: any) {
  uni.navigateTo({
    url: `/packageA/pages/physicalShop/index?shopId=${id}`
  })
}
onReachBottom(() => {
  getShopList()
})
onMounted(async () => {
  getShopList()
})
</script>
<template>
  <view class="c_container">
    <view class="shop" v-for="shop in shopList.list" :key="shop.id">
      <view class="contentBox" @click="toShopDetail(shop.id)">
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
          <!-- <view class="addr">
              <view class="msg">
                <u-icon name="map-fill" class="icon"></u-icon>
                <text>{{ shop.addr }}</text>
              </view>
              <text class="distance">{{ shop.distance }}</text>
            </view> -->
          <text class="vip" v-if="shop.vipReserveRoleCount > 0"
            >消费领会员</text
          >
        </view>
      </view>
      <view class="couponBox">
        <view
          class="coupon_voucher"
          v-for="item in shop.coupons"
          :key="item.id"
        >
          <view class="coupon_voucher_main">
            <view class="price">
              <text class="unit">￥</text>
              <text class="num"> {{ item.money }}</text></view
            >
            <view class="name">{{ item.name }}</view>
          </view>
          <view class="coupon_voucher_foot">
            <u-button
              class="btn"
              size="mini"
              type="primary"
              plain
              ripple
              @click="couponAdd(item)"
              >立即领取</u-button
            >
          </view>
        </view>
      </view>
      <!-- <view class="actionBox">
          <text class="rule" v-if="shop.shopMoneyRule">{{
            shop.shopMoneyRule.userMoneyRuleName
          }}</text>
          <view class="actions">
            <u-button
              type="primary"
              ripple-bg-color="#909399"
              size="mini"
              shape="circle"
              @click="handleMapLocation(shop)"
              >导航</u-button
            >
            <u-button
              type="primary"
              ripple-bg-color="#909399"
              size="mini"
              shape="circle"
              v-if="false"
              >VIP充值</u-button
            >
            <u-button
              type="primary"
              ripple-bg-color="#909399"
              size="mini"
              shape="circle"
              @click="handleCheck(shop)"
              v-if="shop.supportDynamicPrice"
              >付款</u-button
            >
            <u-button
              type="primary"
              ripple-bg-color="#909399"
              size="mini"
              shape="circle"
              @click="makePhoneCall(shop.address.phone)"
              ><text class="iconfont hy-icon-dianhua"></text> 电话咨询</u-button
            >
          </view>
        </view> -->
    </view>
    <u-loadmore :status="status" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.c_container {
  // display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20rpx;
  .shop {
    border-radius: $section-raduis;
    background: $uni-bg-color-white;
    margin-bottom: $uni-spacing-col-lg;
    padding: $uni-spacing-row-lg;

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
        flex: 1;
        text-align: left;
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
    .couponBox {
      display: flex;
      overflow-y: scroll;
      align-items: flex-start;
      .coupon_voucher {
        border-radius: 6px;
        box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
        color: $uni-text-color-orange;
        margin: 20rpx 20rpx 20rpx 6rpx;
        padding: 7px 10px 10px;
        position: relative;
        width: 250rpx;
        flex-shrink: 0;
        &_main {
          // min-height: 100rpx;
          .price {
            .unit {
              font-size: 20rpx;
            }
            .num {
              font-size: 40rpx;
              font-weight: bold;
            }
          }
          .name {
            font-size: 22rpx;
          }
        }
        &_foot {
          border-top: 1px dashed $uni-border-color-orange;
          margin-top: 10px;
          padding-top: 8px;
          position: relative;
          display: flex;
          justify-content: center;
          &::before,
          &::after {
            background-color: #fff;
            border-color: transparent transparent rgba(232, 232, 237, 0.7)
              rgba(232, 232, 237, 0.7);
            border-radius: 50%;
            border-style: solid;
            border-width: 1px;
            content: '';
            height: 7px;
            position: absolute;
            top: -4px;
            width: 7px;
          }
          &::before {
            left: -15px;
            transform: rotate(-135deg);
          }
          &::after {
            right: -15px;
            transform: rotate(35deg);
          }
          :deep(.btn) {
            flex: 1;
            button {
              padding: 8rpx 0;
              font-size: 20rpx;
              height: 40rpx;
              width: 100%;
            }
          }
        }
      }
    }

    .actionBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;

      .rule {
        color: $uni-text-color-light;
        font-size: 20rpx;
      }

      .actions {
        display: flex;
        justify-content: center;
        gap: 18rpx;

        :deep(.u-btn--primary) {
          background: $bg-primary;
        }
        .hy-icon-dianhua {
          margin-right: 5rpx;
          font-size: 26rpx;
        }
      }
    }
  }
}
</style>
