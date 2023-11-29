<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群聊列表
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-11-29 18:50:42
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { onLoad, onShow, onReady, onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  previewImage,
  dateFormat,
  handleMapLocation
} from '@/utils/index'
import { UPLOADURL } from '@/common/config'
import { useUserStore, useChatStore } from '@/store'
import c_newGroup from './c_newGroup.vue'
import { route } from '@/utils/common'

const userStore = useUserStore()
const userDetailName = ref('')
const friendCircleId = ref(null)
const userDetailId = ref(null)
const popRef = ref()
function addNewGroup() {
  popRef.value.addNewGroup()
}
const title = ref('群聊')
const groupList = reactive({
  list: [],
  loading: true,
  pageIndex: 1,
  pageSize: 20
})
const roleList = ref([
  {
    name: '主群',
    roleId: 401
  },
  {
    name: '副群',
    roleId: 0
  }
])
const roleNow = ref({})
const status = ref('loadmore')
async function getList() {
  if (status.value === 'nomore') return
  uni.showLoading()
  try {
    const { data } = await socialApi.circleUserList({
      pageIndex: groupList.pageIndex,
      pageSize: groupList.pageSize,
      detail: true,
      type: 0,
      userId: userStore.userInfo.id,
      roleId: roleNow.value.roleId
    })
    const { records, current, pages } = data
    groupList.list.push(...records)
    if (current < pages && pages !== 0) {
      groupList.pageIndex += 1
    } else {
      status.value = 'nomore'
    }
  } catch {}
  uni.hideLoading()
}
// 切换主副群
function switchType() {
  if (roleNow.value.roleId === roleList.value[0].roleId) {
    roleNow.value = roleList.value[1]
  } else {
    roleNow.value = roleList.value[0]
  }
  groupList.list = []
  groupList.pageIndex = 1
  status.value = 'loadmore'
  getList()
}
async function toGroupChat(item: {
  type?: any
  chatGroupId: any
  id: any
  name?: any
  joined?: boolean
}) {
  route({
    url: '/packageA/pages/chat/index',
    params: {
      targetId: item.chatGroupId,
      groupName: item.name,
      cid: item.id,
      type: 1
    }
  })
}
const permission = computed(() => {
  const p = userStore.userInfo?.permissions.find(
    (item: { permission: any }) => item.permission === 'Function_CreateGroup'
  )
  return !!p
})
onLoad((option) => {
  userDetailName.value = `${option?.username}`
  friendCircleId.value = option?.friendCircleId ?? null
  userDetailId.value = option?.userDetailId ?? null
  if (option?.roleId) {
    roleNow.value = roleList.value.find((item) => item.roleId == option.roleId)
  }
  getList()
})
onReachBottom(() => {
  getList()
})
</script>
<template>
  <view class="container">
    <u-navbar :title="`我的${roleNow?.name || title}`">
      <view slot="right">
        <u-icon
          class="u-m-r-30"
          custom-prefix="custom-icon"
          name="switch"
          size="40"
          @click="switchType"
        ></u-icon> </view
    ></u-navbar>
    <view>
      <view
        class="new-box"
        v-if="
          !groupList?.list?.length && roleNow?.name === '主群' && permission
        "
      >
        <view class="tips">还没有主群？点击下方按钮新建群聊</view>
        <u-button
          type="error"
          ripple
          :custom-style="{ background: '#ff522d', height: '70rpx' }"
          @click="addNewGroup"
          >+创建群聊</u-button
        >
      </view>
      <u-empty
        text="暂无副群"
        mode="message"
        v-if="!groupList.list.length && roleNow?.name === '副群'"
        margin-top="100"
      ></u-empty>
      <view
        class="circle"
        v-for="item in groupList.list"
        :key="item.id"
        @click="toGroupChat(item.friendCircle)"
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
              :src="getImgFullPath(item.friendCircle?.avatar)"
            ></u-image>
          </view>
          <view class="con">
            <view class="top">
              <view class="name">{{ item.friendCircle?.name }}</view>
              <view class="date">{{
                dateFormat(new Date(item.friendCircle.createTime), 'MM-dd')
              }}</view>
            </view>
            <view class="desc"> {{ item.friendCircle?.remark }}</view>
          </view>
        </view>
      </view>
    </view>
    <c_newGroup @onSuccess="getList" ref="popRef" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.container {
  padding: 20rpx;
}
.new-box {
  background: #fff;
  border-radius: 10rpx;
  padding: 30rpx;
  box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.05);
  .tips {
    color: #444;
    margin-bottom: 20rpx;
    text-align: left;
  }
}
.circle {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 18rpx;

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
