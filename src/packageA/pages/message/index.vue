<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-08-17 18:27:47
 * @LastEditTime: 2023-08-18 14:31:12
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-empty -->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted, computed } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, socialApi } from '@/api'
import { getImgFullPath, getDistance, dateFormat } from '@/utils/index'
import { useUserStore, useChatStore } from '@/store'
import $config from '@/common/jim/config.js'

const userStore = useUserStore()
const chatStore = useChatStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const { conversation } = storeToRefs(chatStore)
const singleConversations = computed(() => {
  return conversation.value?.filter((item) => item?.type === 3)
})
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
      // url: `/packageA/pages/chat/index?groupId=${item.chatGroupId}&groupName=${item.name}`
      url: `/packageA/pages/chat/index?groupId=75293282&groupName=${item.name}`
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
    reload()
    uni.navigateTo({
      url: `/packageA/pages/chat/index?groupId=${item.chatGroupId}`
    })
  }
}
function toChat(data: { username: any }) {
  uni.navigateTo({
    url: `/packageA/pages/chat/index?username=${data?.username}`
  })
}
onLoad(() => {
  getList()
})
onReachBottom(() => {
  getList()
})
</script>
<template>
  <!-- <hy-nav-bar title="title"></hy-nav-bar> -->
  <view class="container">
    <view
      class="circle"
      v-for="item in singleConversations"
      :key="item.id"
      @click="toChat(item)"
    >
      <view class="c-bot">
        <view class="avatar-wrap">
          <u-badge
            :is-dot="true"
            type="success"
            is-center
            v-if="item.unread_msg_count > 0"
          ></u-badge>
          <u-image
            class="avatar"
            width="120rpx"
            height="120rpx"
            border-radius="10rpx"
            :src="
              item?.avatar.slice(0, 5) == 'qiniu'
                ? $config.jimLocalhost + item?.avatar
                : item?.avatar
            "
          ></u-image>
        </view>

        <view class="con">
          <view class="top">
            <view class="name">{{ item?.name }}</view>
            <view class="date">{{
              dateFormat(new Date(item.mtime), 'yyyy-MM-dd hh:mm')
            }}</view>
          </view>
          <view class="desc"> {{ item?.content }}</view>
        </view>
      </view>
    </view>
    <u-empty
      text="暂无消息"
      mode="message"
      v-if="!singleConversations.length"
      margin-top="100"
    ></u-empty>
    <u-loadmore
      v-if="singleConversations.length > 3"
      :status="status"
      margin-top="30"
    />
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
  margin-bottom: 10rpx;

  .c-bot {
    display: flex;
    align-items: flex-start;
    .avatar-wrap {
      position: relative;
    }
    .avatar {
      flex-shrink: 0;
    }

    .con {
      margin-left: 20rpx;
      flex: 1;

      .top {
        display: flex;
        justify-content: space-between;

        .name {
          font-weight: bold;
          font-size: 30rpx;
        }

        .date {
          font-size: 24rpx;
          color: #999;
        }
      }

      .desc {
        margin-top: 20rpx;
        @include ellipsis(2);
        color: #666;
      }
    }
  }
}
</style>
