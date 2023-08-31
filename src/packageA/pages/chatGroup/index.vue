<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群聊列表
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-08-31 17:44:28
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  previewImage,
  dateFormat,
  handleMapLocation
} from '@/utils/index'
import { useUserStore, useChatStore, useConfigStore } from '@/store'

const userStore = useUserStore()
const chatStore = useChatStore()
const configStore = useConfigStore()
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
const friendCircleId = ref(null)
const groupList = ref([])
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
function toChat(data: { username: any }) {
  uni.navigateTo({
    url: `/packageA/pages/chat/index?username=${data?.username}`
  })
}
function addNewGroup() {
  showPop.value = true
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
  // Object.keys(tempImageData).forEach((key: string) => {
  //   if (tempImageData[key]) {
  //     formData[key] = tempImageData[key]
  //   }
  // })
  const { code, data } = await socialApi.circleAdd({
    ...formData,
    ...tempImageData
  })
  if (code === 200) {
    await socialApi.userDetailUpdate({
      friendCircleId: data.chatGroupId
    })
  }
}
onLoad((option) => {
  title.value = `${option?.username}的粉丝聊`
  friendCircleId.value = option?.username ?? null
})
</script>
<template>
  <view class="container">
    <hy-nav-bar :title="title"></hy-nav-bar>
    <view>
      <view class="new-box">
        <view class="tips">还没有粉丝群？点击下方按钮新建群聊</view>
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
        v-for="item in groupList"
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
                dateFormat(new Date(item.mtime), 'MM-dd hh:mm')
              }}</view>
            </view>
            <view class="desc"> {{ item?.content }}</view>
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
                :action="configStore.uploadUrl"
                max-count="1"
                :header="header"
                name="object"
                @on-success="uploadSuccess"
                index="avatar"
                :uploadText="null"
                :file="true"
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
  }
}
</style>
