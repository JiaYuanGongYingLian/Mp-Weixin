<!-- eslint-disable no-useless-return -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群详情
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-11-30 12:28:55
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import {
  onLoad,
  onShow,
  onReady,
  onReachBottom,
  onShareAppMessage
} from '@dcloudio/uni-app'
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
import { sharePathFormat } from '@/common/wechat-share'

const userStore = useUserStore()
const groupInfo = ref({})
const userList = ref([])
async function circleUserList() {
  const { data } = await socialApi.circleUserList({
    chatGroupId: groupInfo.value.gid,
    friendCircleId: groupInfo.value.id,
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
async function getCircleInfo() {
  const { data } = await socialApi.circleInfo({
    id: groupInfo.value.id
    // detail: true
  })
  groupInfo.value = data
}

const editPermission = computed(() => {
  return groupInfo.value.userId === 1
})
function hasPermission() {
  if (!editPermission.value) {
    uni.showModal({
      title: '',
      content: '当前群聊仅群主/管理员可修改',
      showCancel: true,
      success: ({ confirm, cancel }) => {}
    })
  }
  return editPermission.value
}
function editName() {
  if (!hasPermission()) return
}
function editInfo() {
  if (!hasPermission()) return
}
onLoad(async (option) => {
  groupInfo.value.gid = option?.gid
  groupInfo.value.id = option?.cid
  await circleUserList()
  await getCircleInfo()
})
onShareAppMessage(() => {
  return {
    title: `邀请你加入${groupInfo.value.name}群聊`,
    desc: groupInfo.value.remark ?? '',
    imageUrl: getImgFullPath(groupInfo.value.avatar),
    path: sharePathFormat({ redirect_url: '/pages/index/index' })
  }
})
</script>
<template>
  <view class="container">
    <hy-nav-bar :title="`群聊信息（${userList?.length ?? ''}）`"> </hy-nav-bar>
    <view class="userList mb2">
      <view class="user" v-for="user in userList" :key="user.rongId">
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
        <button open-type="share" class="btn"></button>
        <u-icon
          custom-prefix="custom-icon"
          name="tianjia"
          size="95"
          color="#666"
        ></u-icon>
        <view class="name"></view>
      </view>
    </view>
    <u-cell-group
      :title-style="{
        color: '#000'
      }"
    >
      <u-cell-item
        title="群聊名称"
        :value="groupInfo.name"
        @click="editName"
      ></u-cell-item>
      <u-cell-item
        title="群简介"
        :value="groupInfo.remark"
        @click="editInfo"
      ></u-cell-item>
    </u-cell-group>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.container {
  padding: 20rpx 0;
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
      .btn {
        background-color: transparent;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        &::after {
          border: none;
        }
      }
    }
  }
}
</style>
