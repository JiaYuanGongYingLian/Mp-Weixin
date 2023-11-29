<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群详情
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-11-29 18:28:44
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { socialApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  previewImage,
  dateFormat,
  handleMapLocation
} from '@/utils/index'
import { UPLOADURL } from '@/common/config'
import { useUserStore, useChatStore } from '@/store'

const groupInfo = ref({})
const userList = ref([])
async function circleUserList() {
  userList.value = await socialApi.circleUserList({
    chatGroupId: groupInfo.value.gid,
    friendCircleId: groupInfo.value.cid
  })
}
onLoad((option) => {
  groupInfo.value.gid = option?.gid
  groupInfo.value.cid = option?.cid
  circleUserList()
})
</script>
<template>
  <view class="container">
    <hy-nav-bar :title="`群聊信息${groupInfo?.count ?? ''}`"> </hy-nav-bar>
    <view class="userList">
      <view class="user" v-for="item in userList" :key="item.id">
        <u-image></u-image>
        <view class="name"></view>
      </view>
      <view class="user">
        <u-image></u-image>
        <view class="name"></view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.container {
  padding: 20rpx;
  .userList {
    background: #fff;
    padding: 40rpx;
    display: flex;
    gap: 20rpx;
    flex-wrap: wrap;
    .user {
      width: 20%;
    }
  }
}
</style>
