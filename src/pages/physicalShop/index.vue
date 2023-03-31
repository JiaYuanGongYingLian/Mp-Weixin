<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { baseApi, productApi } from '@/api';
import { getImgFullPath, getDistances } from '@/utils/index';

const bannerList = ref([]);
let shop = reactive({});
const currentLocation = ref();
function getLocation() {
  // 获取定位信息
  uni.getLocation({
    type: 'wgs84', // 返回可以用于uni.openLocation的经纬度
    // 用户允许获取定位
    success(res) {
      if (res.errMsg == 'getLocation:ok') {
        const { latitude, longitude } = res;
        currentLocation.value = {
          latitude,
          longitude
        };
        if (!shop.latitude) return;
        shop.distance = getDistances(
          latitude,
          longitude,
          shop.latitude,
          shop.longitude
        ).distance_str;
      }
    },
    // 用户拒绝获取定位后 再次点击触发
    fail(res) {
      console.log(res);
      if (res.errMsg == 'getLocation:fail auth deny') {
        uni.showModal({
          content: '检测到您没打开获取信息功能权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (res) => {
                  console.log('确定');
                }
              });
            } else {
              console.log('取消');
              return false;
            }
          }
        });
      }
    }
  });
}
onLoad(async (option) => {
  getLocation();
  const { shopId } = option;
  const { data } = await productApi.getShopInfo({
    id: shopId,
    detail: true
  });
  const { bannerResources } = data;
  shop = data;
  bannerResources.forEach((item: { image: string; resourceUrl: string }) => {
    // eslint-disable-next-line no-param-reassign
    item.image = getImgFullPath(item.resourceUrl);
  });
  bannerList.value = bannerResources;
  const { provinceName, cityName, districtName, street, other } = shop.address;
  shop.addr = provinceName + cityName + districtName + street + other;
  shop.shopMoneyRule = shop.shopMoneyRules
    ? shop.shopMoneyRules.find((item: { selected: any }) => item.selected)
    : {};
  if (currentLocation.value) {
    const { latitude, longitude } = currentLocation.value;
    shop.distance = getDistances(
      latitude,
      longitude,
      shop.latitude,
      shop.longitude
    ).distance_str;
  }
});
</script>
<template>
  <div class="physicalShop">
    <u-swiper height="400" :list="bannerList" mode="number" indicator-pos="bottomRight"></u-swiper>
    <view class="shop">
      <view class="contentBox">
        <view class="imgCover">
          <u-image class="img" border-radius="10rpx" :src="getImgFullPath(shop.avatar)" mode="widthFix" />
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
            <text class="distance">{{ shop.distance }}</text>
          </view>
        </view>
      </view>
      <view class="actionBox">
        <view>
          <text class="rule" v-if="shop.shopMoneyRule">{{
            shop.shopMoneyRule.userMoneyRuleName
          }}</text>
        </view>
        <view class="actions">
          <u-button type="primary" ripple-bg-color="#909399" size="mini" shape="circle"
            @click="handleMapLocation(shop)">导航</u-button>
          <u-button type="primary" ripple-bg-color="#909399" size="mini" shape="circle" v-if="false">VIP充值</u-button>
          <u-button type="primary" ripple-bg-color="#909399" size="mini" shape="circle">买单</u-button>
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.shop {
  border-radius: $section-raduis;
  background: $uni-bg-color-white;
  margin-bottom: $uni-spacing-col-lg;
  padding: $uni-spacing-row-lg;

  .contentBox {
    display: flex;

    .imgCover {
      position: relative;
      width: 200rpx;
      flex-shrink: 0;
      margin-right: 20rpx;

      .img {
        width: 100%;
        height: 200rpx;
        border-radius: $section-raduis;
      }
    }

    .content {
      .name {
        font-size: 32rpx;
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
    }
  }
}
</style>
