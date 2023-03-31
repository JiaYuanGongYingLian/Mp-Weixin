<script setup lang="ts">
import { reactive, ref } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app';
import { baseApi, productApi } from '@/api';
import { getImgFullPath, getDistances } from '@/utils/index';
const bannerList = ref([])
const info = ref()
onLoad((option)=>{
  const { shopId } = option 
  productApi.getShopInfo({
    id: shopId
  })
})
</script>
<template>
  <div class="physicalShop">
    <u-swiper :list="bannerList"></u-swiper>
  </div>
</template>

<style lang="scss" scoped></style>