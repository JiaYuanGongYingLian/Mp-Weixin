<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { baseApi, productApi } from '@/api';
import { getImgFullPath } from '@/utils/index';

const shopList = ref<object[]>([]);
const tabs = ref([]);
const current = ref(0);
const swiperCurrent = ref(0);
const uTabsRef = ref();
// tabs通知swiper切换
function tabsChange(index: any) {
  swiperCurrent.value = index;
}
// swiper-item左右移动，通知tabs的滑块跟随移动
function transition(e: { detail: { dx: any } }) {
  const { dx } = e.detail;
  uTabsRef.value.setDx(dx);
}
// 由于swiper的内部机制问题，快速切换swiper不会触发dx的连续变化，需要在结束时重置状态
// swiper滑动结束，分别设置tabs和swiper的状态
function animationfinish(e: { detail: { current: any } }) {
  // eslint-disable-next-line no-shadow
  const { current } = e.detail;
  uTabsRef.value.setFinishCurrent(current);
  swiperCurrent.value = current;
  current.value = current;
}
// scroll-view到底部加载更多
function onreachBottom() {
  // todo
}
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
    .then((res) => {
      const { data } = res;
      tabs.value = data.records;
      shopList.value = initData();
    })
    .catch((err) => {});
}
async function getShopList() {
  const item = shopList.value[current.value];
  const { pageIndex, pageSize } = item;

  const { data } = await productApi.getShopList({
    pageIndex,
    pageSize,
    detail: 'true',
    otherColumns: 'moneyRuleDetails',
    shopType: 3,
    categoryId: 1
  });
  console.log(data.records);
  item.list.push(...data.records);
}
onLoad(() => {});
onReady(async () => {
  await getTabs();
  await getShopList();
});
</script>

<template>
  <div class="physicalStore">
    <view>
      <u-tabs
        ref="uTabsRef"
        :list="tabs"
        v-model="current"
        @change="tabsChange"
        :is-scroll="true"
      ></u-tabs>
    </view>
    <swiper
      :current="current"
      @transition="transition"
      @animationfinish="animationfinish"
    >
      <swiper-item
        class="swiper-item"
        v-for="(item, index) in shopList"
        :key="index"
      >
        <scroll-view
          scroll-y
          style="height: 800rpx; width: 100%"
          @scrolltolower="onreachBottom"
        >
          <view class="shop" v-for="shop in item.list" :key="item.id">
            <view class="contentBox">
              <view class="imgCover">
                <u-image
                  class="img"
                  :src="getImgFullPath(shop.avatar)"
                  mode="widthFix"
                />
                <text class="type">{{ shop.type }}</text>
              </view>
              <view class="content">
                <text>{{ shop.name }}</text>
              </view>
            </view>
            <view class="actionBox">
              <text></text>
              <view class="actions"></view>
            </view>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </div>
</template>

<style lang="scss" scoped>
.physicalStore {
  min-height: 100vh;
  color: $uni-text-color;
}

.shop {
  .contentBox {
    display: flex;

    .imgCover {
      position: relative;
      width: 200rpx;

      .img {
        width: 100%;
        height: 200rpx;
      }
    }
  }
}
</style>
