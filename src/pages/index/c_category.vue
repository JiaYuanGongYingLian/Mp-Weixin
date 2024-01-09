<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getMockData } from '@/api'

const cates = ref([
  {
    name: '商学院',
    url: '/packageC/pages/examination/index?questionPaperId=1',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/5710b1c1-9c97-4d07-92e4-4ba40d4e173c.svg'
  },
  {
    name: 'PK场',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/1cc99a49-53ad-4008-b4f5-4d984527448f.svg'
  },
  {
    name: '素材中心',
    url: '/packageA/pages/circle/detail?friendCircleId=11',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/5c1ea6ec-c734-4897-9fd7-f9518769818a.svg'
  },
  {
    name: '家园头条',
    url: '/packageA/pages/news/index?friendCircleId=12',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/1bebfe9a-c4de-4ce1-8ab1-9b641bd834dc.svg'
  },
  {
    name: '客服中心',
    url: '',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/ba52fc46-58df-4fe3-8dbd-e99754d2ca44.svg'
  }
])
function handleClick(item: { name: any; url: any }) {
  const { name, url } = item
  if (name === '客服中心') return
  if (!url) return
  uni.navigateTo({
    url
  })
}
onMounted(async () => {
  // cates.value = await getMockData('cates')
})
</script>
<template>
  <view class="c_container">
    <view
      class="item"
      v-for="item in cates"
      :key="item.name"
      @click="handleClick(item)"
    >
      <!-- #ifdef MP-WEIXIN -->
      <button
        type="default"
        open-type="contact"
        class="service"
        v-if="item.name === '客服中心'"
      ></button>
      <!-- #endif -->
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
    position: relative;
    .service {
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 2;
    }
  }
  .name {
    color: #fff;
    font-size: 24rpx;
    margin-top: 13rpx;
  }
}
</style>
