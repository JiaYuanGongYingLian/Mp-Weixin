<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-26 09:59:19
 * @LastEditTime: 2023-08-28 10:13:24
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  onLoad,
  onShow,
  onReady,
  onReachBottom,
  onPageScroll,
  onPullDownRefresh
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore, useConfigStore } from '@/store'
import hyNavBar from '@/components/hy-nav-bar/index.vue'
import c_elebrity from './c_celebrity.vue'
import c_circle from './c_circle.vue'

const store = useUserStore()
const configStore = useConfigStore()
const { hasLogin } = storeToRefs(store)
const scrollTop = ref(0)
const tabBgColor = ref('#fff')
const tabActiveColor = ref('#2979ff')
const tabInactiveColor = ref('#303133')
let list = [
  {
    name: '圈子'
  },
  {
    name: '对接名人'
  }
]

const currentTab = ref(1)
const buttonRect = ref({})
// #ifdef MP-WEIXIN
buttonRect.value = wx.getMenuButtonBoundingClientRect()
// #endif
function change(index: any) {
  currentTab.value = index
  if (index === 2) {
    uni.navigateTo({
      url: '/packageA/pages/shortVideo/index',
      success: () => {
        currentTab.value = 1
      }
    })
  }
}
// #ifdef MP-WEIXIN
if (!configStore.videoPageOpen) {
  list = [
    {
      name: '圈子'
    }
  ]
  currentTab.value = 0
}
// #endif

onLoad((option) => {
  if (option?.tabIndex !== undefined) {
    currentTab.value = Number(option?.tabIndex)
  }
})

onPageScroll((e) => {
  scrollTop.value = e.scrollTop
  if (scrollTop.value > 60) {
    tabBgColor.value = 'rgba(0,0,0,0.7)'
    tabInactiveColor.value = '#fff'
    tabActiveColor.value = '#fff'
  } else {
    tabBgColor.value = '#fff'
    tabActiveColor.value = '#2979ff'
    tabInactiveColor.value = '#303133'
  }
})
onPullDownRefresh(() => {
  console.log('refresh')
  setTimeout(() => {
    uni.reLaunch({
      url: `/pages/community/index?tabIndex=${currentTab.value}`
    })
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>
<template>
  <view class="container">
    <view
      class="head"
      sticky
      :style="{
        top: 0,
        zIndex: 20,
        paddingTop: buttonRect.top ? buttonRect.top + 'px' : '0',
        background: tabBgColor
      }"
    >
      <u-tabs
        :list="list"
        sticky
        :style="{ top: 0, zIndex: 20 }"
        v-model="currentTab"
        bg-color="transparent"
        :active-color="tabActiveColor"
        :inactive-color="tabInactiveColor"
        @change="change"
      ></u-tabs>
    </view>
    <view class="circle" v-show="currentTab === 0">
      <c_circle></c_circle>
      <!-- <u-empty text="暂未开放" mode="page" style="margin-top: 100px"></u-empty> -->
    </view>
    <!-- 对接名人 -->
    <view class="celebrity" v-show="currentTab === 1">
      <c_elebrity />
    </view>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
    <hy-tabbar></hy-tabbar>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.container {
  padding-bottom: 60rpx;
}
.head {
  background: #fff;
}
</style>
