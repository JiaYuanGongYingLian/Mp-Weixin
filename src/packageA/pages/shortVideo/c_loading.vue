<!-- eslint-disable no-console -->
<!-- eslint-disable no-console -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-01 16:22:48
 * @LastEditTime: 2023-08-29 17:27:35
 * @LastEditors:  Please set LastEditors
-->
<template>
  <view class="c_container">
    <view class="loading">
      <view class="ball red"></view>
      <view class="ball blue"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const props = withDefaults(
  defineProps<{
    isBack?: boolean
  }>(),
  {
    isBack: true
  }
)
</script>

<style lang="scss" scoped>
.c_container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}
.loading {
  display: flex;
  align-items: center;
  isolation: isolate;
}
.ball {
  position: relative;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  mix-blend-mode: multiply;
  &.red {
    background-color: #fd2c55;
    animation-fill-mode: forwards;
    animation: redRotate linear 1s infinite;
    z-index: 1;
  }
  &.blue {
    background-color: #42ebf7;
    animation-fill-mode: forwards;
    animation: blueRotate linear 1s infinite;
    z-index: 0;
  }
}
@keyframes redRotate {
  0% {
    transform: translateX(0) scale(1);
    z-index: 1;
  }
  25% {
    transform: translateX(10px) scale(0.75);
  }
  50% {
    transform: translateX(22px) scale(1);
  }
  75% {
    transform: translateX(10px) scale(0.5);
  }
  100% {
    transform: translateX(0) scale(1);
    z-index: 0;
  }
}
@keyframes blueRotate {
  0% {
    transform: translateX(0) scale(1);
  }
  25% {
    transform: translateX(-10px) scale(0.5);
  }
  50% {
    transform: translateX(-22px) scale(1);
  }
  75% {
    transform: translateX(-10px) scale(0.75);
  }
  100% {
    transform: translateX(0) scale(1);
  }
}
</style>
