<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getMockData } from '@/api'

const cates = ref([])
onMounted(async () => {
  cates.value = await getMockData('cates')
  console.log(cates.value)
})
</script>
<template>
  <view class="c_container">
    <view class="item" v-for="item in cates" :key="item.id">
      <u-image width="72rpx" height="72rpx" :src="item.icon"></u-image>
      <view class="name">{{ item.name }}</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.c_container {
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-radius: 24rpx;
  padding: 30rpx;
  width: 686rpx;
  margin: 0 auto;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .name {
    color: #fff;
    font-size: 24rpx;
    margin-top: 13rpx;
  }
}
</style>
