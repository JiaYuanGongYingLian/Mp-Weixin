<template>
  <view class="index-page">
    <searchBar />
    <view class="section">
      <view class="tit">线下好店</view>
      <view class="actions">
        <view class="item" v-for="item in categoryList" :key="item.id"></view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { userApi, baseApi } from '@/api'
import searchBar from '@/components/hy-search-bar/index.vue'

const categoryList = reactive([])
userApi
  .login()
  .then((result) => {
    console.log('index', result)
  })
  .catch((err) => {})
baseApi.getAdvertisingList({
  pageIndex: 1,
  pageSize: 10,
  type: baseApi.advertising_enum.ADV_HOME_LIST2
})
</script>

<style lang="scss" scoped>
.index-page {
  font-style: normal;
  text-align: center;
}

.section {
  background: #fff;
  padding: 20rpx;
}

.tit {
  text-align: left;
  font-weight: bold;
}

.actions {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;

  .item {
    width: 20%;
  }
}
</style>
