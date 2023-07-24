<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-24 14:50:01
 * @LastEditTime: 2023-07-24 17:19:12
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const bannerList = ref([])
const info = ref()
async function getList() {
  try {
    const { data } = await socialApi.circleList({ detail: true })
  } catch {}
}
onLoad((option) => {
  getList()
})
</script>
<template>
  <!-- <hy-nav-bar title="title"></hy-nav-bar> -->
  <view class="container">
    <view class="circle">
      <view class="c-top">
        <view class="left">
          <view class="name">黑银集团事业部</view>
          <view class="num">共96人</view>
        </view>
        <u-button
          class="right"
          type="primary"
          size="mini"
          shape="circle"
          :ripple="true"
          >加入</u-button
        >
      </view>
      <view class="c-bot">
        <u-image
          class="avatar"
          shape="circle"
          width="100rpx"
          height="100rpx"
        ></u-image>
        <view class="con">
          <view class="top">
            <view class="name">李丹</view>
            <view class="date">2023-07-23</view>
          </view>
          <view class="desc">一个有爱的大家庭，给到黑银家人的意外之喜</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 20rpx;
}
.circle {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  .c-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20rpx;
    .left {
      .name {
        font-size: 30rpx;
        font-weight: bold;
      }
      .num {
        margin-top: 30rpx;
      }
    }
    .right {
      margin: 0;
    }
  }
  .c-bot {
    display: flex;
    align-items: center;
    padding-top: 20rpx;
    border-top: 2rpx solid #f6f6f6;
    .avatar {
      flex-shrink: 0;
    }
    .con {
      margin-left: 20rpx;
      .top {
        display: flex;
        justify-content: space-between;
        .date {
          font-size: 24rpx;
          color: #ccc;
        }
      }
      .desc {
        margin-top: 10rpx;
      }
    }
  }
}
</style>
