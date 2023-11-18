<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getMockData } from '@/api'

const cates = ref([])
onMounted(async () => {
  cates.value = await getMockData('cates')
})
</script>
<template>
  <view class="container">
    <view class="item" v-for="item in cates" :key="item.id">
      <view class=""></view>
      <view class="name">{{ item.name }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
