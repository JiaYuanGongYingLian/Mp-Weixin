<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-28 17:45:12
 * @LastEditTime: 2023-06-28 18:10:02
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const list = [
  {
    name: '短视频'
  },
  {
    name: '完善传记'
  },
  {
    name: '完善展览馆'
  }
]
const currentTab = ref(0)
function change(index: any) {
  currentTab.value = index
}
onLoad((option) => {})
</script>
<template>
  <hy-nav-bar
    title="发布中心"
    :background="{ background: '#fff' }"
  ></hy-nav-bar>
  <view class="container">
    <u-tabs
      :list="list"
      sticky
      :style="{ top: 0, zIndex: 2 }"
      v-model="currentTab"
      @change="change"
    ></u-tabs>
  </view>
</template>

<style lang="scss" scoped></style>
