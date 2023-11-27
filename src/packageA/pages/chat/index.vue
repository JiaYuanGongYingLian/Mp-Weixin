<!-- eslint-disable consistent-return -->
<!-- eslint-disable no-plusplus -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 聊天界面
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-11-27 10:21:29
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch, onUnmounted } from 'vue'
import { onLoad, onShow, onReady, onHide } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import RongIMLib from '@/common/rongYun/im_init'
import { baseApi, productApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  previewImage,
  dateFormat,
  handleMapLocation
} from '@/utils/index'
import { useUserStore, useChatStore, useRyStore } from '@/store'
import { RY_AVATAR } from '@/common/config'
import c_foot from './c_foot.vue'
import c_msgpup from './c_msgpup.vue'

const $config = reactive({})
const emojiAllJson = reactive([])
const userStore = useUserStore()
const chatStore = useChatStore()
const ryStore = useRyStore()
const { singleInfo, syncConversation, groupMemberList } = storeToRefs(chatStore)
const { userinfo, pinia_messagelist } = storeToRefs(ryStore)
const chatType = ref(0)
const targetId = ref()
const chatList = computed(() => {
  if (!ryStore.userinfo?.id) return []
  if (!targetId.value) return []
  if (!pinia_messagelist.value[ryStore.userinfo.id]) return []
  onChatClick()
  return pinia_messagelist.value[ryStore.userinfo.id][targetId.value] || []
})
const isScrollHeight = ref(false)
function setChatScrollTop(arg_isScrollHeight?: boolean | undefined) {
  isScrollHeight.value = arg_isScrollHeight || false
  setTimeout(() => {
    chatScrollTop.value += 1
  }, 200)
}
watch(
  chatList,
  (n) => {
    if (n) {
      setChatScrollTop()
    }
  },
  { deep: true }
)
const chatScrollTop = ref(999999)
const thouUsername = ref('')
const groupInfo = reactive({
  name: '',
  gid: ''
})
const footerRef = ref()
function onChatClick() {
  footerRef.value?.onChatClick()
}

// 是否显示消息日期
function showTime(i: number) {
  if (i === 0) return true
  const s_time = chatList.value[i - 1]?.sentTime
  const e_time = chatList.value[i]?.sentTime
  return e_time - s_time > 60 * 1000
}
// 长按消息监听
const msgPupData = ref({})
const msgpupRef = ref()
function onLongPress(e: { message?: any; my_user_id?: any }, message: any) {
  e.message = message
  msgPupData.value = e
  setTimeout(() => {
    msgpupRef.value?.showPop()
  }, 200)
  console.log(msgPupData.value)
}
// 引用消息
const referMessage = ref<null | Object>(null)
function setReferFn(data: Object | null) {
  referMessage.value = data
}

onLoad(async (option) => {
  thouUsername.value = option?.username || ''
  groupInfo.gid = option?.groupId
  groupInfo.name = option?.groupName
  chatType.value = Number(option?.type)
  targetId.value = option?.targetId
  // if (userinfo.value?.id) {
  //   chatList.value =
  //     ryStore.pinia_messagelist[ryStore.userinfo.id][targetId.value] || []
  // }
  await ryStore.clearMessagesUnreadStatus({
    targetId: targetId.value,
    isGroup: false
  })
})

onUnmounted(() => {})
</script>
<template>
  <view class="container">
    <hy-nav-bar
      :title="chatType === 1 ? groupInfo.name : singleInfo.nickname"
    ></hy-nav-bar>
    <view class="l-chat-body" @tap="onChatClick">
      <scroll-view
        scroll-y="true"
        class="l-char-scroll"
        scroll-with-animation
        :class="{ 'l-char-scroll-height': isScrollHeight }"
        :scroll-top="chatScrollTop"
      >
        <view class="l-char-scroll-content">
          <view class="l-char-empty"> 已经没有聊天记录了~ </view>
          <template v-for="(s, i) in chatList" :key="i">
            <view
              class="l-chat-item"
              :class="{
                'l-chat-mine': s.messageDirection === 1
              }"
              v-if="s.messageType !== 'RC:SRSMsg'"
              @longpress="onLongPress($event, s)"
            >
              <view class="l-chat-item-time" v-if="showTime(i)">
                {{ dateFormat(new Date(s.sentTime), 'MM-dd hh:mm') }}
              </view>
              <view class="l-chat-item-content">
                <view class="l-chat-avatar">
                  <u-image
                    width="80"
                    height="80"
                    :src="RY_AVATAR"
                    mode="aspectFill"
                  ></u-image>
                </view>
                <view class="l-chat-view">
                  <view class="l-chat-name" v-if="chatType === 1">
                    {{ s.senderUserId }}
                  </view>
                  <template v-if="s.messageType == 'RC:TxtMsg'">
                    <view class="l-chat-text">
                      {{ s.content.content || '' }}
                    </view>
                  </template>
                  <template v-else-if="s.messageType === 'RC:ImgMsg'">
                    <view>
                      <u-image
                        @tap="previewImage([s.content.imageUri])"
                        :src="s.content.imageUri"
                        :style="{
                          'max-width': '250rpx'
                        }"
                        width="250rpx"
                        height="auto"
                        mode="widthFix"
                        border-radius="14"
                        class="l-upload-img"
                      ></u-image>
                    </view>
                  </template>
                  <template v-else-if="s.messageType === 'RC:LBSMsg'">
                    <!-- {{ s.content }} -->
                    <view
                      class="l-chat-location"
                      @click="
                        handleMapLocation({
                          latitude: s.content.latitude,
                          longitude: s.content.longitude,
                          addr: s.content.content
                        })
                      "
                    >
                      <view class="l-chat-con">
                        <view class="name">{{ s.content.content }}</view>
                      </view>
                      <map
                        :longitude="s.content.longitude"
                        :latitude="s.content.latitude"
                        style="width: 350rpx; height: 180rpx"
                      ></map>
                    </view>
                  </template>
                  <template v-else-if="s.messageType === 'RC:ReferenceMsg'">
                    <view class="l-chat-text">
                      {{ s.content.content || '' }}
                    </view>
                    <view class="l-chat-text-refer">
                      <view class="rname">{{ s.content.referMsgUserId }}:</view>
                      <view
                        class="rcon"
                        v-if="s.content.objName == 'RC:TxtMsg'"
                      >
                        {{ s.content.referMsg.content }}
                      </view>
                      <view
                        class="rimg"
                        v-if="s.content.objName == 'RC:ImgMsg'"
                      >
                        <u-image
                          :src="s.content.referMsg.imageUri"
                          :width="'100%'"
                          :height="'auto'"
                          mode="widthFix"
                          border-radius="10"
                          @tap="previewImage([s.content.referMsg.imageUri])"
                        ></u-image>
                      </view>
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </template>

          <c_msgpup
            ref="msgpupRef"
            :chatType="chatType"
            :msgPupData="msgPupData"
            @reference="setReferFn"
          ></c_msgpup>
        </view>
      </scroll-view>
    </view>
    <c_foot
      ref="footerRef"
      @on-focus="setChatScrollTop"
      :chatType="chatType"
      :target-id="targetId"
      :referMessage="referMessage"
      @closeRefer="setReferFn"
    />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.l-chat-body {
  width: 100%;
  flex: 1;
}

.l-char-scroll {
  width: 100%;
  /* #ifdef H5 */
  height: calc(100vh - 190rpx);
  /* #endif */
  /* #ifndef H5 */
  height: calc(100vh - 250rpx);
  /* #endif */
  background-color: #f6f6f6;
}

.l-char-scroll-height {
  /* #ifdef H5 */
  height: calc(100vh - 190rpx - 350rpx);
  /* #endif */
  /* #ifndef H5 */
  height: calc(100vh - 250rpx - 350rpx);
  /* #endif */
}

.l-char-content {
  width: 100%;
  box-sizing: border-box;
  padding: 40rpx 20rpx 40rpx;
}

.l-char-scroll-content {
  padding: 0 20rpx 20rpx;
  width: 100%;
  box-sizing: border-box;
}

.l-chat-item {
  width: 100%;
  font-size: 32rpx;
  margin-bottom: 20rpx;
}

.l-char-empty,
.l-chat-item-time {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 92rpx;
  font-size: 24rpx;
  color: #999999;
}

.l-chat-item-content {
  display: flex;
}

.l-chat-img-avatar,
.l-chat-avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.l-chat-avatar {
  margin: 0 20rpx 0 0;
}

.l-chat-view {
  max-width: 515rpx;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.l-chat-name {
  width: 100%;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 10rpx;
}

.l-chat-text {
  min-width: 100rpx;
  max-width: 515rpx;
  padding: 15rpx 30rpx;
  box-sizing: border-box;
  background-color: #ffffff;
  position: relative;
  word-break: break-all;
  border-radius: 3px;
  font-size: 30rpx;
}

.l-chat-text::after {
  content: ' ';
  display: block;
  position: absolute;
  top: 34rpx;
  width: 0;
  height: 0;
  left: -18rpx;
  transform: translate(0, -50%);
  border: 10rpx solid;
  border-color: transparent #ffffff transparent transparent;
}
.l-chat-text-refer {
  background: rgba(0, 0, 0, 0.05);
  margin-top: 10rpx;
  border-radius: 6rpx;
  font-size: 27rpx;
  color: #333;
  padding: 10rpx;
  max-width: 400rpx;
  word-break: break-all;
  display: flex;
  align-items: flex-start;
  .rname {
    flex-shrink: 0;
    margin-right: 10rpx;
  }
  .rcon {
    @include ellipsis(2);
  }
  .rimg {
    width: 100rpx;
  }
}

.l-chat-text-wapper {
  min-width: 100rpx;
  max-width: 515rpx;
  padding: 20rpx 20rpx;
  box-sizing: border-box;
  background-color: #ffffff;
  margin: 0 0 0 15rpx;
  position: relative;
  word-break: break-all;
  border-radius: 3px;
}

.l-chat-text-wapper::after {
  content: ' ';
  display: block;
  position: absolute;
  top: 40rpx;
  width: 0;
  height: 0;
  left: -10rpx;
  transform: translate(0, -50%);
  border: 15rpx solid;
  border-color: transparent #ffffff transparent transparent;
}

.l-chat-mine .l-chat-item-content {
  flex-direction: row-reverse;
}

.l-chat-mine .l-chat-avatar {
  margin: 0 0 0 20rpx;
}

.l-chat-mine .l-chat-name {
  text-align: right;
}

.l-chat-mine .l-chat-text {
  background-color: #95eb6c;
  color: #000;
  border-radius: 3px;
}

.l-chat-mine .l-chat-text::after {
  left: auto;
  right: -18rpx;
  border-color: transparent transparent transparent #95eb6c;
}
.l-chat-mine {
  .l-chat-view {
    align-items: flex-end;
  }
}

.l-chat-location {
  background-color: #fff;
  border: 8rpx;
  overflow: hidden;
  max-width: 350rpx;
  border-radius: 20rpx;
  .l-chat-con {
    padding: 20rpx;
    font-size: 26rpx;
  }
}

.l-chat-file {
  line-height: 1;
  margin: 0;
  text-align: left;
  padding: 20rpx;
  width: 420rpx;
  background-color: #ededed;
}

.l-chat-flie-view {
  display: flex;
}

.l-upload-img {
  border-radius: 6rpx;
}
</style>
