<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群详情
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-11-30 02:04:12
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
import { UPLOADURL, RY_AVATAR } from '@/common/config'
import { useUserStore, useChatStore } from '@/store'

const groupInfo = ref({})
const userList = ref([])
async function circleUserList() {
  const { data } = await socialApi.circleUserList({
    chatGroupId: groupInfo.value.gid,
    friendCircleId: groupInfo.value.cid,
    detail: true,
    pageSize: 19
  })
  userList.value = data.records.map((e: { user: { avatar: string } }) => {
    if (!e.user.avatar) {
      e.user.avatar = RY_AVATAR
    }
    e.user.avatar = getImgFullPath(e.user.avatar)
    return e.user
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
    <hy-nav-bar :title="`群聊信息（${userList?.length ?? ''}）`"> </hy-nav-bar>
    <view class="userList">
      <view class="user" v-for="user in userList" :key="user.id">
        <u-image
          :src="user.avatar"
          mode="widthFix"
          width="90rpx"
          height="90rpx"
          :error-icon="RY_AVATAR"
        ></u-image>
        <view class="name">
          {{ user.nickname }}
        </view>
      </view>
      <view class="user">
        <u-icon
          custom-prefix="custom-icon"
          name="tianjia"
          size="95"
          color="#666"
        ></u-icon>
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
    padding: 30rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 20rpx;
    .user {
      width: calc((100% - 80rpx) / 5);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .name {
        width: 90rpx;
        font-size: 22rpx;
        word-break: break-all;
        text-align: center;
        margin-top: 10rpx;
        color: #666;
        @include ellipsis();
      }
    }
  }
}
</style>
