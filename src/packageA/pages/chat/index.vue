<!-- eslint-disable no-plusplus -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 聊天界面
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-09-12 15:28:50
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import {
  getImgFullPath,
  getDistance,
  previewImage,
  dateFormat,
  handleMapLocation
} from '@/utils/index'
import { useUserStore, useChatStore } from '@/store'
import $config from '@/common/jim/config.js'
import { emojiAllJson } from '@/common/jim/emoji.js'
import c_foot from './c_foot.vue'

const userStore = useUserStore()
const chatStore = useChatStore()
const {
  chatHasLogin,
  chatList,
  jimUserInfo,
  singleInfo,
  singleInfoAvatar,
  jimUserInfoAvatar,
  syncConversation,
  groupMemberList
} = storeToRefs(chatStore)
watch(
  [chatList, syncConversation],
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
  footerRef.value.onChatClick()
}
const isScrollHeight = ref(false)
function setChatScrollTop(arg_isScrollHeight?: boolean | undefined) {
  isScrollHeight.value = arg_isScrollHeight ?? false
  setTimeout(() => {
    chatScrollTop.value += 1
  }, 200)
}
const chatType = ref('single')
onLoad((option) => {
  thouUsername.value = option?.username || ''
  groupInfo.gid = option?.groupId
  groupInfo.name = option?.groupName
  if (thouUsername.value) {
    chatHasLogin.value && chatStore.jimGetSingleInfo(thouUsername.value)
  } else {
    chatHasLogin.value && chatStore.jimGetGroupInfo(groupInfo.gid)
    chatType.value = 'group'
  }
})
function showTime(i: number) {
  if (i === 0) return true
  const s_time = chatList.value[i - 1]?.ctime_ms
  const e_time = chatList.value[i]?.ctime_ms
  return e_time - s_time > 60 * 1000
}
function getGroupMemberAvatar(username: any) {
  for (let i = 0; i < groupMemberList.value.length; i++) {
    if (
      groupMemberList.value[i].username === username &&
      groupMemberList.value[i].avatar
    ) {
      return `${$config.jimLocalhost}${groupMemberList.value[i].avatar}`
    }
  }
  return $config.$defaultAvatar
}
function toDetail(data: { userId: any }) {
  // uni.navigateTo({
  //   url: `/packageA/pages/businessCard/index?&userId=${data.userId}`
  // })
}
</script>
<template>
  <view class="container">
    <hy-nav-bar
      :title="chatType === 'group' ? groupInfo.name : singleInfo.nickname"
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
          <!-- chatList -->
          <view
            class="l-chat-item"
            v-for="(s, i) in chatList"
            :key="i"
            :class="{
              'l-chat-mine': s.content.from_id === jimUserInfo.username
            }"
          >
            <view class="l-chat-item-time" v-if="showTime(i)">
              {{ dateFormat(new Date(s.ctime_ms), 'MM-dd hh:mm') }}
            </view>
            <view class="l-chat-item-content">
              <!-- {{ s }} -->
              <view class="l-chat-avatar">
                <u-image
                  shape="circle"
                  width="80"
                  height="80"
                  v-if="s.content.from_id !== jimUserInfo.username"
                  @click="toDetail({ userId: s.content.from_id.split('_')[1] })"
                  :src="
                    chatType === 'group'
                      ? getGroupMemberAvatar(s.content.from_id)
                      : singleInfoAvatar
                  "
                  mode="aspectFill"
                ></u-image>
                <u-image
                  v-else
                  shape="circle"
                  width="80"
                  height="80"
                  :src="jimUserInfoAvatar"
                  mode="aspectFill"
                ></u-image>
              </view>
              <view class="l-chat-view">
                <view class="l-chat-name" v-if="chatType === 'group'">
                  {{
                    s.content.from_id === jimUserInfo.username
                      ? jimUserInfo.nickname || jimUserInfo.username
                      : s.content.from_name
                  }}
                </view>
                <template v-if="s.content.msg_type === 'text'">
                  <view
                    v-if="
                      s.content.msg_body.extras &&
                      s.content.msg_body.extras.isEmoji
                    "
                    class="l-chat-text"
                  >
                    <image
                      :src="
                        '../../../static/emoji/' +
                        emojiAllJson[s.content.msg_body.text]
                      "
                      mode="aspectFit"
                      class="l-icon-emoji-m"
                    ></image>
                  </view>
                  <view class="l-chat-text" v-else>
                    {{ s.content.msg_body.text || '' }}
                  </view>
                </template>
                <template v-else-if="s.content.msg_type === 'image'">
                  <view>
                    <image
                      @tap="previewImage([s.content.msg_body.image])"
                      v-if="s.content.msg_body.type"
                      :src="s.content.msg_body.image"
                      :style="{
                        'max-width': '250rpx',
                        width: s.content.msg_body.width,
                        height:
                          s.content.msg_body.width < 500
                            ? s.content.msg_body.height
                            : (500 / s.content.msg_body.width) *
                              s.content.msg_body.height
                      }"
                      mode="widthFix"
                      class="l-upload-img"
                    ></image>
                    <image
                      v-else
                      @tap="
                        previewImage([
                          $config.jimLocalhost + s.content.msg_body.media_id
                        ])
                      "
                      :src="$config.jimLocalhost + s.content.msg_body.media_id"
                      :style="{
                        'max-width': '250rpx',
                        width: s.content.msg_body.width,
                        height:
                          s.content.msg_body.width < 500
                            ? s.content.msg_body.height
                            : (500 / s.content.msg_body.width) *
                              s.content.msg_body.height
                      }"
                      mode="widthFix"
                      class="l-upload-img"
                    ></image>
                  </view>
                </template>
                <template v-else-if="s.content.msg_type === 'location'">
                  <!-- {{ s.content }} -->
                  <view
                    class="l-chat-location"
                    @click="
                      handleMapLocation({
                        latitude: s.content.msg_body.latitude,
                        longitude: s.content.msg_body.longitude,
                        addr: s.content.msg_body.label
                      })
                    "
                  >
                    <view class="l-chat-con">
                      <view class="name">{{ s.content.msg_body.label }}</view>
                    </view>
                    <map
                      :longitude="s.content.msg_body.longitude"
                      :latitude="s.content.msg_body.latitude"
                      style="width: 350rpx; height: 180rpx"
                    ></map>
                  </view>
                </template>
                <template v-else>
                  <button class="l-chat-file">
                    <view class="l-chat-flie-view">
                      <view class="l-cfv-name">
                        {{ s.content }}
                      </view>
                      <!-- <image
                              class="l-chat-file-img"
                              src="../../static/wenjian.png"
                              mode="aspectFill"
                            ></image> -->
                    </view>
                    <view class="l-chat-file-size"> 5.9MB </view>
                  </button>
                </template>
              </view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
    <c_foot ref="footerRef" @on-focus="setChatScrollTop" :chatType="chatType" />
  </view>
</template>

<style lang="scss" scoped>
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
  font-size: 28rpx;
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
}

.l-chat-name {
  width: 100%;
  font-size: 24rpx;
  color: #666666;
  margin-bottom: 20rpx;
}

.l-chat-text {
  min-width: 100rpx;
  max-width: 515rpx;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
  background-color: #ffffff;
  margin: 0 0 0 15rpx;
  position: relative;
  word-break: break-all;
  border-radius: 3px;
  font-size: 28rpx;
}

.l-chat-text::after {
  content: ' ';
  display: block;
  position: absolute;
  top: 40rpx;
  width: 0;
  height: 0;
  left: -28rpx;
  transform: translate(0, -50%);
  border: 15rpx solid;
  border-color: transparent #ffffff transparent transparent;
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
  left: -28rpx;
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
  margin: 0 15rpx 0 0;
  border-radius: 3px;
}

.l-chat-mine .l-chat-text::after {
  left: auto;
  right: -28rpx;
  border-color: transparent transparent transparent #95eb6c;
}

.l-chat-location {
  background-color: #fff;
  border: 8rpx;
  overflow: hidden;

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

.l-icon-emoji-m {
  width: 54rpx;
  height: 54rpx;
}

.l-upload-img {
  border-radius: 6rpx;
}
</style>
