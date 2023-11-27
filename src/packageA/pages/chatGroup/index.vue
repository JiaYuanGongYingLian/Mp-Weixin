<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群聊列表
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-11-28 01:55:31
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
import { useUserStore, useChatStore, useConfigStore } from '@/store'

const userStore = useUserStore()
const chatStore = useChatStore()
const configStore = useConfigStore()
const { chatHasLogin, chatList } = storeToRefs(chatStore)
const { userInfo } = storeToRefs(userStore)

const userDetailName = ref('')
const friendCircleId = ref(null)
const userDetailId = ref(null)
const showPop = ref(false)
const formData = reactive({
  type: 20,
  avatar: '',
  name: '',
  userId: userStore.userInfo.id,
  remark: ''
})
const tempImageData = reactive({
  avatar: ''
})
const header = {
  Authorization: `Bearer ${uni.getStorageSync('accessToken') || ''}`,
  // #ifdef MP-WEIXIN
  'Content-Type': 'multipart/form-data'
  // #endif
}
function addNewGroup() {
  showPop.value = true
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
    name: '我的主群',
    roleId: 401
  },
  {
    name: '我的副群',
    roleId: 0
  }
])
const roleNow = ref({})
const status = ref('loadmore')
async function getList() {
  if (status.value === 'nomore') return
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
}
function uploadSuccess(data: any, index: any, lists: any, name: string) {
  tempImageData[name] = data.data
}
async function submit() {
  if (!tempImageData.avatar) {
    uni.showToast({
      icon: 'none',
      title: '请上传群头像'
    })
    return
  }
  if (!formData.name) {
    uni.showToast({
      icon: 'none',
      title: '请填写群名称'
    })
    return
  }
  if (!formData.remark) {
    uni.showToast({
      icon: 'none',
      title: '请填写群简介'
    })
    return
  }
  const { code, data } = await socialApi.circleAdd({
    ...formData,
    ...tempImageData
  })
  if (code === 200) {
    // friendCircleId.value = data.chatGroupId
    // const res = await socialApi.userDetailUpdate({
    //   id: userDetailId.value,
    //   friendCircleId: friendCircleId.value
    // })
    uni.showToast({
      icon: 'none',
      title: '创建成功'
    })
    getList()
  }
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
  uni.navigateTo({
    url: `/packageA/pages/chat/index?targetId=${item.chatGroupId}&groupName=${item.name}&type=1`
  })
}
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
    <u-navbar :title="roleNow?.name || title">
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
      <view class="new-box" v-if="!groupList?.list?.length">
        <view class="tips">还没有主群？点击下方按钮新建群聊</view>
        <u-button
          type="error"
          ripple
          :custom-style="{ background: '#ff522d', height: '70rpx' }"
          @click="addNewGroup"
          >+创建群聊</u-button
        >
      </view>
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
    <u-popup
      v-model="showPop"
      mode="center"
      width="298px"
      closeable
      border-radius="20"
      close-icon-color="#fff"
      close-icon="close-circle"
      close-icon-size="40"
      :z-index="3"
    >
      <view class="pop-head">
        <u-image
          src="https://image.blacksilverscore.com/uploads/05a779ee-c342-49be-a9da-541f2d9a614d.png"
          width="100%"
          height="80px"
        ></u-image>
        <view class="head-con">
          <view class="pop-tit">群聊信息</view>
        </view>
      </view>
      <view class="pop-body">
        <u-form
          :model="formData"
          ref="form"
          :label-style="{ fontWeight: 'bold' }"
        >
          <view class="section">
            <u-form-item
              label="群头像"
              label-width="auto"
              prop="avatar"
              required
            >
              <u-upload
                width="140"
                height="140"
                ref="upload1"
                :action="UPLOADURL"
                max-count="1"
                :header="header"
                name="object"
                @on-success="uploadSuccess"
                index="avatar"
                :uploadText="null"
                :file-list="
                  formData.avatar
                    ? [{ url: getImgFullPath(formData.avatar) }]
                    : []
                "
              ></u-upload>
            </u-form-item>
            <u-form-item required label="群名称" label-width="auto" prop="name"
              ><u-input v-model="formData.name" placeholder="请填写群名称"
            /></u-form-item>
            <u-form-item
              :border-bottom="false"
              label="群简介"
              label-width="auto"
              label-position="left"
              required
              ><u-input
                v-model="formData.remark"
                input-align="left"
                type="textarea"
                placeholder="请填写群简介"
            /></u-form-item>
          </view>
        </u-form>
        <u-button
          class="btn"
          @click="submit"
          shape="circle"
          type="primary"
          ripple
          :custom-style="{ background: '#ff522d', height: '70rpx' }"
          >保存</u-button
        >
      </view>
    </u-popup>
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
.pop-head {
  position: relative;
  color: #fff;

  .head-con {
    position: absolute;
    width: 100%;
    left: 0;
    top: 30px;

    .pop-tit {
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
    }

    .des {
      padding: 20rpx;
      font-size: 24rpx;
    }
  }
}

.pop-body {
  padding: 30rpx;
  .btn {
    margin-top: 30rpx;
  }
  :deep(.u-add-wrap) {
    border-radius: 50%;
    .u-add-tips {
      display: none;
    }
    .u-preview-wrap {
      // background: none;
      border: 0;
    }
  }
  :deep(.u-preview-wrap) {
    border-radius: 50%;
    .u-preview-image {
      border-radius: 50%;
    }
  }
}
</style>
