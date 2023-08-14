<!-- eslint-disable no-empty -->
<!--
 * @Description: 排行榜
 * @Author: Kerwin
 * @Date: 2023-07-22 05:42:06
 * @LastEditTime: 2023-08-14 17:54:32
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { socialApi } from '@/api'
import { getImgFullPath, checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const rankList = reactive({
  list: [],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const status = ref('loadmore')
async function dynamicList() {
  try {
    // const res1 = await socialApi.dynamicList({
    //   noPaging: true,
    //   type: 3,
    //   userId: userInfo.value.id,
    //   detail: true
    // })
    // rankList.list = [...res1.data]
  } catch {}
}
function toView(index: number) {
  localStorage.setItem('videoList', JSON.stringify(videoList.list))
  uni.navigateTo({
    url: `/packageA/pages/shortVideo/index?type=viewSingleUser&index=${index}`
  })
}
onMounted(() => {
  dynamicList()
})
</script>
<template>
  <view class="wrapper">
    <view class="rankList">
      <view class="item" v-for="item in rankList.list" :key="item.id"> </view>
    </view>
    <u-loadmore :status="status" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.wrapper {
}
</style>
