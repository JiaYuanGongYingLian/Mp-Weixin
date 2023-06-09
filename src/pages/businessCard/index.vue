<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-09 11:39:30
 * @LastEditTime: 2023-06-09 12:08:49
 * @LastEditors:  Please set LastEditors
-->
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
const bannerList = ref([])
const info = ref()

onLoad((option) => {})
</script>
<template>
  <hy-nav-bar title="title"></hy-nav-bar>
  <div class="container">
    
  </div>
</template>

<style lang="scss" scoped></style>
