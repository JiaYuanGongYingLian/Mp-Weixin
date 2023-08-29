<!-- eslint-disable no-console -->
<!-- eslint-disable no-console -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-01 16:22:48
 * @LastEditTime: 2023-08-29 17:04:14
 * @LastEditors:  Please set LastEditors
-->
<template>
  <view class="c_container">
    <view class="tabbar">
      <view class="item" :class="{ active: tabIndex === 0 }" @click="toHome"
        >首页</view
      >
      <view class="item" :class="{ active: tabIndex === 1 }">视频</view>
      <view class="item" @click="toPublishCenter"
        ><text class="iconfont hy-icon-push"></text
      ></view>
      <view
        class="item"
        :class="{ active: tabIndex === 2 }"
        @tap="goUrlFn"
        data-url="/packageA/pages/message/index"
        >消息</view
      >
      <view class="item" :class="{ active: tabIndex === 3 }" @click="toMine"
        >我 &nbsp;&nbsp;&nbsp;
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const props = withDefaults(
  defineProps<{
    isBack?: boolean
  }>(),
  {
    isBack: true
  }
)
const tabIndex = ref(1)
function goUrlFn(e: { currentTarget: { dataset: { url: any } } }) {
  const { url } = e.currentTarget.dataset
  if (url) {
    uni.navigateTo({
      url
    })
  }
}
function toHome() {
  uni.switchTab({
    url: '/pages/index/index'
  })
}
function toPublishCenter() {
  uni.navigateTo({
    url: '/packageA/pages/publish/index'
  })
}
function toMine() {
  uni.navigateTo({
    url: `/packageA/pages/businessCard/index?userId=${userInfo.value.id}`
  })
}
</script>

<style lang="scss" scoped>
.tabbar {
  display: flex;
  justify-content: space-around;
  align-items: center;
  color: rgba(255, 255, 255, 0.6);
  height: 110rpx;
  padding-bottom: env(safe-area-inset-bottom);
  position: relative;
  z-index: 1000;
  .item {
    font-size: 34rpx;
    font-weight: 600;
    &.active {
      color: rgba(255, 255, 255, 0.95);
    }
    .hy-icon-push {
      font-size: 60rpx;
      font-weight: normal;
      color: rgba(255, 255, 255, 0.95);
      position: relative;
      // bottom: -4rpx;
    }
  }
}
</style>
