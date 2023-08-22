<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-08-15 10:27:44
 * @LastEditTime: 2023-08-22 11:02:38
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-24 14:50:01
 * @LastEditTime: 2023-08-14 14:18:50
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, socialApi } from '@/api'
import { getImgFullPath, getDistance, dateFormat } from '@/utils/index'
import { useUserStore, useChatStore, useConfigStore } from '@/store'

const userStore = useUserStore()
const chatStore = useChatStore()
const configStore = useConfigStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const circleList = reactive({
  list: [],
  loading: true,
  pageIndex: 1,
  pageSize: 20
})
const status = ref('loadmore')
async function getList() {
  if (status.value === 'nomore') return
  try {
    const { data } = await socialApi.circleList({
      pageIndex: circleList.pageIndex,
      pageSize: circleList.pageSize,
      detail: true,
      type: 0
    })
    const { records, current, pages } = data
    circleList.list.push(...records)
    if (current < pages && pages !== 0) {
      circleList.pageIndex += 1
    } else {
      status.value = 'nomore'
    }
  } catch {}
}
function reload() {
  circleList.list = []
  circleList.pageIndex = 1
  getList()
}
async function toGroupChat(item: {
  type?: any
  chatGroupId: any
  id: any
  name?: any
  joined?: boolean
}) {
  if (!item.joined) {
    joinGroup(item)
  } else {
    uni.navigateTo({
      url: `/packageA/pages/chat/index?groupId=${item.chatGroupId}&groupName=${item.name}`
      // url: `/packageA/pages/chat/index?groupId=75293282&groupName=${item.name}`
    })
  }
}
async function joinGroup(item: {
  type?: any
  id: any
  chatGroupId: any
  name?: any
}) {
  const { code } = await socialApi.circleUserAdd({
    friendCircleId: item.id,
    chatGroupId: item.chatGroupId,
    nickname: userInfo.value.nickname,
    userId: userInfo.value.id
  })
  if (code === 200) {
    await reload()
    uni.navigateTo({
      url: `/packageA/pages/chat/index?groupId=${item.chatGroupId}&groupName=${item.name}`
    })
  }
}
onMounted(() => {
  getList()
})
onReachBottom(() => {
  getList()
})
</script>
<template>
  <!-- <hy-nav-bar title="title"></hy-nav-bar> -->
  <view class="container">
    <view class="circle" v-for="item in circleList.list" :key="item.id">
      <view class="c-top">
        <view class="left">
          <view class="name">{{ item.name }}</view>
          <view class="num">共{{ item.friendCircleUsers?.length }}人</view>
        </view>
        <u-button
          class="right"
          type="primary"
          size="mini"
          shape="circle"
          :ripple="true"
          :plain="item.joined"
          @click="toGroupChat(item)"
        >
          {{ item.joined ? '进入聊天' : '加入圈子' }}
        </u-button>
      </view>
      <view class="c-bot">
        <u-image
          class="avatar"
          shape="circle"
          width="100rpx"
          height="100rpx"
          :src="
            getImgFullPath(
              item.lastFriendCircleDynamic?.user.avatar ||
                configStore.cardDefualtAvatar
            )
          "
        ></u-image>
        <view class="con">
          <view class="top">
            <view class="name">{{
              item.lastFriendCircleDynamic?.user.nickname
            }}</view>
            <view class="date" v-if="item.lastFriendCircleDynamic">{{
              dateFormat(
                new Date(item.lastFriendCircleDynamic?.createTime * 1000),
                'yyyy-MM-dd hh:mm'
              )
            }}</view>
          </view>
          <view class="desc"> {{ item.lastFriendCircleDynamic?.content }}</view>
        </view>
      </view>
    </view>
    <u-loadmore v-if="circleList.list.length > 3" :status="status" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
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
      flex: 1;
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
        @include ellipsis(2);
      }
    }
  }
}
</style>
