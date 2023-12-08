<!-- eslint-disable no-useless-return -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群详情
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-12-08 16:44:08
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
import { json } from 'stream/consumers'
import { socialApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { route } from '@/utils/common'
import { UPLOADURL, RY_AVATAR } from '@/common/config'
import { useUserStore, useChatStore } from '@/store'
import { sharePathFormat } from '@/common/wechat-share'

const userStore = useUserStore()
const groupInfo = ref({})
const userList = ref([])
const mySelfInfoInGroup = computed(() => {
  const user = userList.value.find((item) => item.id == userStore.userInfo.id)
  return user || userStore.userInfo
})
async function circleUserList() {
  const { data } = await socialApi.circleUserList({
    chatGroupId: groupInfo.value.gid,
    friendCircleId: groupInfo.value.cid,
    detail: true,
    // pageSize: 19
    noPaging: true
  })
  userList.value = data.map(
    (e: { user: { avatar: string }; nickname: any; id: any }) => {
      if (!e.user.avatar) {
        e.user.avatar = RY_AVATAR
      }
      return { ...e.user, circle_nickname: e.nickname, fid: e.id }
    }
  )
}
async function getCircleInfo() {
  const { data } = await socialApi.circleInfo({
    id: groupInfo.value.cid
    // detail: true
  })
  groupInfo.value = { ...groupInfo.value, ...data }
}

const editPermission = computed(() => {
  return groupInfo.value.userId === userStore.userInfo.id
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
function editGroupName() {
  if (!hasPermission()) return
  jumpFn(2)
}
function editGroupRemark() {
  if (!hasPermission()) return
  jumpFn(3)
}
function editNickname() {
  jumpFn(1)
}
function jumpFn(type: any) {
  route({
    url: '/packageA/pages/chatGroup/infoEdit',
    params: {
      type,
      groupInfo: JSON.stringify(groupInfo.value),
      avatarList: JSON.stringify(
        userList.value.slice(0, 9).map((item) => item.avatar)
      ),
      mySelfInfoInGroup: JSON.stringify(mySelfInfoInGroup.value)
    }
  })
}
function addNew() {
  route({
    url: '/packageA/pages/chatGroup/addNewcomer',
    params: {
      cid: groupInfo.value.cid,
      gid: groupInfo.value.gid
    }
  })
}
onLoad(async (option) => {
  groupInfo.value.gid = option?.gid
  groupInfo.value.cid = option?.cid
})
onShow(async () => {
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
          :src="getImgFullPath(user.avatar)"
          mode="widthFix"
          width="90rpx"
          height="90rpx"
          :error-icon="RY_AVATAR"
        ></u-image>
        <view class="name">
          {{ user.circle_nickname || user.nickname }}
        </view>
      </view>
      <view class="user">
        <u-icon
          custom-prefix="custom-icon"
          name="tianjia"
          size="95"
          color="#666"
          @click="addNew"
          v-if="editPermission"
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
        @click="editGroupName"
      ></u-cell-item>
      <u-cell-item
        title="群简介"
        :value="groupInfo.remark"
        @click="editGroupRemark"
      ></u-cell-item>
      <u-cell-item
        title="我在群里的昵称"
        :value="mySelfInfoInGroup.circle_nickname || mySelfInfoInGroup.nickname"
        @click="editNickname"
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
      position: relative;
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
