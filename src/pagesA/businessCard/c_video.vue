<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-22 03:31:09
 * @LastEditTime: 2023-07-28 16:01:50
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
import { m_video } from '@/common/mock.js'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const videoList = reactive({
  list: [],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const status = ref('loadmore')
async function dynamicList() {
  try {
    const res1 = await socialApi.dynamicList({
      noPaging: true,
      type: 3,
      userId: userInfo.value.id,
      detail: true
    })
    videoList.list = [...m_video, ...res1.data]
  } catch {}
}
function toView(index: number) {
  localStorage.setItem('videoList', JSON.stringify(videoList.list))
  uni.navigateTo({
    url: `/pagesA/shortVideo/index?type=viewSingleUser&index=${index}`
  })
}
onMounted((option) => {
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
          <text>{{ item.like || 123 }}</text>
        </view>
      </view>
    </view>
    <u-loadmore :status="status" />
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
