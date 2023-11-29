<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!--
 * @Description: 顶部下拉菜单
 * @Author: Kerwin
 * @Date: 2023-11-23 14:36:33
 * @LastEditTime: 2023-11-29 14:47:24
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore, useRyStore } from '@/store'

const userStore = useUserStore()
const ryStore = useRyStore()
const { hasLogin } = storeToRefs(userStore)
const props = withDefaults(
  defineProps<{
    chatType?: number
    msgPupData: object
  }>(),
  {
    chatType: 0,
    msgPupData: () => {
      return {}
    }
  }
)

const showPup = ref(false)
function toggleFn() {
  showPup.value = !showPup.value
}
function addfriend() {}

onLoad((option) => {})
</script>
<template>
  <view class="c_container">
    <u-icon
      class="u-m-r-30"
      name="plus-circle"
      size="40"
      @click="toggleFn"
    ></u-icon>
    <view class="arrivalNavigation" v-if="showPup">
      <view class="d4"></view>
      <view class="sideNavigation">
        <view class="item" @click="addfriend()"
          ><u-icon class="u-m-r-30" name="chat-fill" size="35"></u-icon
          >发起群聊</view
        >
        <view class="liBottomBorder"></view>
        <view class="item" @click="addfriend()"
          ><u-icon class="u-m-r-30" name="man-add-fill" size="35"></u-icon
          >添加朋友</view
        >
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.c_container {
  .arrivalNavigation {
    width: 250rpx;
    position: absolute;
    right: 10rpx;
    z-index: 99;
    .sideNavigation {
      width: 248rpx;
      background-color: rgba(76, 76, 76, 76);
      color: #eee;
      border-radius: 6rpx;
      .item {
        height: 85rpx;
        text-align: center;
        line-height: 85rpx;
        font-size: 25rpx;
      }
      .liBottomBorder {
        border: 0.1rpx solid rgba(81, 81, 81, 81);
      }
    }
    .d4 {
      width: 0;
      height: 0;
      margin-left: 200rpx;
      // margin-top: -10rpx;
      border-width: 10rpx;
      border-style: solid;
      border-color: transparent rgba(76, 76, 76, 76) transparent transparent;
      transform: rotate(90deg); /*顺时针旋转90°*/
    }
  }
}
</style>
