<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-22 03:31:09
 * @LastEditTime: 2023-08-19 16:26:33
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { socialApi, enumAll } from '@/api'
import { getImgFullPath, checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin, userInfo, hasNewDynamic } = storeToRefs(userStore)
const videoList = reactive({
  list: [],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const status = ref('loadmore')
const props = withDefaults(
  defineProps<{
    cardUserId?: any
  }>(),
  {}
)
watch(hasNewDynamic, (n) => {
  if (n) {
    dynamicList()
  }
})
async function dynamicList() {
  try {
    const { current, pages, data } = await socialApi.dynamicList({
      noPaging: true,
      type: 3,
      userId: props.cardUserId,
      detail: true,
      status: enumAll.audit_status_enum.SUCCESS
    })
    videoList.list = [...data]
    status.value = 'nomore'
    // if (current < pages) {
    //   videoList.pageIndex += 1
    //   videoList.list = [...data]
    // } else {
    //   videoList.finished = true
    //   status.value = 'nomore'
    // }
  } catch {}
}
function toView(index: number) {
  uni.setStorageSync('videoList', JSON.stringify(videoList.list))
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
    <view class="videoList">
      <view
        class="video-item"
        v-for="(item, index) in videoList.list"
        :key="item.id"
      >
        <u-image
          width="100%"
          height="360rpx"
          :src="getImgFullPath(item.previewImage)"
          @click="toView(index)"
        ></u-image>
        <view class="like">
          <text class="iconfont hy-icon-like-line"></text>
          <text>{{ item.favoriteCount || 0 }}</text>
        </view>
      </view>
    </view>
    <u-loadmore :status="status" margin-top="50" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.wrapper {
  .videoList {
    display: flex;
    flex-wrap: wrap;
    gap: 1px;
    margin-top: 2px;

    .video-item {
      width: calc((100% - 2px) / 3);
      position: relative;
      // border-radius: 8rpx;
      overflow: hidden;

      .like {
        display: flex;
        position: absolute;
        left: 20rpx;
        bottom: 16rpx;
        align-items: center;
        color: #fff;

        .hy-icon-like-line {
          font-size: 28rpx;
          color: #fff;
          margin-right: 10rpx;
        }
      }
    }
  }
}
</style>
