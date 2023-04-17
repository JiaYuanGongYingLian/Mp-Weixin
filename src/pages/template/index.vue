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
  <div class="physicalShop"></div>
</template>

<style lang="scss" scoped></style>
