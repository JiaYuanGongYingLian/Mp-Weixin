<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-empty -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-console -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-28 17:45:12
 * @LastEditTime: 2023-08-31 16:35:02
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onPageScroll } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi, enumAll } from '@/api'
import { useUserStore } from '@/store'
import c_biography from './c_biography.vue'
import c_video from './c_video.vue'

const store = useUserStore()
const { hasLogin, userInfo } = storeToRefs(store)
const list = [
  {
    name: '短视频'
  },
  {
    name: '完善名片'
  },
  {
    name: '完善橱窗'
  }
]
const currentTab = ref(0)
function change(index: any) {
  currentTab.value = index
}
const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
})

onLoad((option) => {
  if (option?.tabIndex) {
    currentTab.value = Number(option?.tabIndex)
  }
})
</script>
<template>
  <view class="container">
    <hy-nav-bar
      title="发布中心"
      :background="{ background: '#fff' }"
    ></hy-nav-bar>
    <u-tabs
      :list="list"
      sticky
      :style="{ top: 0, zIndex: 10 }"
      v-model="currentTab"
      @change="change"
    ></u-tabs>
    <Transition name="slide-fade" mode="out-in">
      <view v-if="currentTab === 0">
        <c_video />
      </view>
      <view v-else-if="currentTab === 1">
        <c_biography />
      </view>
      <view v-else>
        <u-empty text="暂无数据" mode="list" margin-top="100"></u-empty>
      </view>
    </Transition>
    <u-back-top :scroll-top="scrollTop"></u-back-top>
  </view>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
