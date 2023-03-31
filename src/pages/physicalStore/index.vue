<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { baseApi, productApi } from '@/api';
import { getImgFullPath, getDistances } from '@/utils/index';

const shopList = ref<object[]>([]);
const tabs = ref([]);
const currentTab = ref(0);
const currentLocation = ref();

function initData() {
  return tabs.value.map((item) => {
    return {
      tab: item,
      list: [],
      loading: true,
      finished: false,
      pageIndex: 1,
      pageSize: 20
    };
  });
}
async function getTabs() {
  await baseApi
    .getCategoryList({ pageSize: 1000, type: 1, parentId: 0 })
    .then((res: { data: any }) => {
      const { data } = res;
      tabs.value = data.records;
      tabs.value.unshift({
        name: '全部',
        id: null
      });
      shopList.value = initData();
    })
    .catch((err: any) => { });
}
async function getShopList() {
  const item = shopList.value[currentTab.value];
  const tab = tabs.value[currentTab.value];
  const { pageIndex, pageSize, finished } = item;
  if (finished) return;
  const { data } = await productApi.getShopList({
    pageIndex,
    pageSize,
    detail: 'true',
    otherColumns: 'moneyRuleDetails',
    shopType: 3,
    categoryId: tab.id
  });
  const { records, current, pages } = data;
  records.forEach((shop: object) => {
    const { provinceName, cityName, districtName, street, other } =
      shop.address;
    shop.addr = provinceName + cityName + districtName + street + other;
    shop.shopMoneyRule = shop.shopMoneyRules
      ? shop.shopMoneyRules.find((item: { selected: any }) => item.selected)
      : {};
    if (currentLocation.value) {
      const {latitude,longitude} = currentLocation.value
      shop.distance = getDistances(
        latitude,
        longitude,
        shop.latitude,
        shop.longitude
      ).distance_str;
    }

  });
  item.list.push(...records);
  if (current < pages) {
    item.pageIndex++;
  } else {
    item.finished = true;
  }
}
function tabsChange(index: any) {
  currentTab.value = index;
  const item = shopList.value[currentTab.value];
  if (!item.list.length) {
    getShopList();
  }
}
// scroll-view到底部加载更多
function onreachBottom() {
  console.log('bottom');
  getShopList();
}
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
        shopList.value.forEach((item) => {
          item.list.forEach(
            (shop: { distance: string; latitude: any; longitude: any }) => {
              shop.distance = getDistances(
                latitude,
                longitude,
                shop.latitude,
                shop.longitude
              ).distance_str;
            }
          );
        });
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
function handleMapLocation(shop: { latitude: any; longitude: any; addr: any }) {
  const { latitude, longitude, addr } = shop;
  console.log('进入导航');
  // 获取定位信息
  uni.getLocation({
    type: 'wgs84',
    success(res) {
      if (res.errMsg == 'getLocation:ok') {
        console.log(latitude);
        console.log(longitude);
        uni.openLocation({
          // 传入你要去的纬度
          latitude,
          // 传入你要去的经度
          longitude,
          // 传入你要去的地址信息 不填则为空
          address: addr,
          // 缩放大小
          scale: 18,
          success() {
            console.log('成功的回调success');
          }
        });
      }
    },
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
onLoad(() => { });
onReady(async () => {
  await getTabs();
  await getShopList();
  getLocation();
});
</script>

<template>
  <div class="physicalStore">
    <view class="tabs">
      <u-tabs :list="tabs" v-model="currentTab" @change="tabsChange" :is-scroll="true"></u-tabs>
    </view>
    <view class="swiper">
      <view class="swiper-item" v-for="(item, index) in shopList" :key="index">
        <scroll-view class="scorll-view" of v-if="index === currentTab" scroll-y @scrolltolower="onreachBottom">
          <view class="shop" v-for="shop in item.list" :key="item.id">
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
              <text class="rule" v-if="shop.shopMoneyRule">{{
                shop.shopMoneyRule.userMoneyRuleName
              }}</text>
              <view class="actions">
                <u-button type="primary" ripple-bg-color="#909399" size="mini" shape="circle"
                  @click="handleMapLocation(shop)">导航</u-button>
                <u-button type="primary" ripple-bg-color="#909399" size="mini" shape="circle"
                  v-if="false">VIP充值</u-button>
                <u-button type="primary" ripple-bg-color="#909399" size="mini" shape="circle">买单</u-button>
              </view>
            </view>
          </view>
        </scroll-view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.physicalStore {
  min-height: 100vh;
  color: $uni-text-color;
  display: flex;
  flex-direction: column;
  background: $uni-bg-color;
}

.swiper {
  flex: 1;
  padding: $uni-spacing-row-base * 2;

  .scorll-view {
    width: 100%;
    height: 100%;
  }

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
}

.tabs {
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 2;
}
</style>
