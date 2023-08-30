<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群聊列表
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-08-30 18:22:18
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  previewImage,
  dateFormat,
  handleMapLocation
} from '@/utils/index'
import { useUserStore, useChatStore } from '@/store'

const userStore = useUserStore()
const chatStore = useChatStore()
const {
  hasLogin,
  chatList,
  jimUserInfo,
  singleInfo,
  singleInfoAvatar,
  jimUserInfoAvatar,
  syncConversation
} = storeToRefs(chatStore)

const title = ref('')
onLoad((option) => {
  title.value = `${option?.username}的粉丝聊`
})
</script>
<template>
  <view class="container">
    <hy-nav-bar :title="title"></hy-nav-bar>
    <view></view>
  </view>
</template>

<style lang="scss" scoped></style>
