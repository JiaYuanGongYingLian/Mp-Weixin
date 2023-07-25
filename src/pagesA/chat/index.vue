<!--
 * @Description: 聊天界面
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-07-25 18:07:21
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore, useChatStore } from '@/store'

const userStore = useUserStore()
const chatStore = useChatStore()
const { hasLogin } = storeToRefs(userStore)
const isEmoji = ref(false)
const isUpload = ref(false)
const chatScrollTop = ref(99999)
const thouUsername = ref('')

function onChatClick() {
  if (this.isEmoji) {
    this.isEmoji = !this.isEmoji
  }
  if (this.isUpload) {
    this.isUpload = !this.isUpload
  }
}
const isScrollHeight = computed(() => {
  return isEmoji.value && isUpload.value
})
onReady(() => {
  const params = {
    username: 'kerwin',
    password: 123456,
    is_md5: false
  }
  chatStore.jimLogin(params)
})
onLoad((option) => {
  if (option) {
    const { username } = option
    thouUsername.value = username || ''
    chatStore.jimGetSingleInfo(thouUsername.value)
  }
})
</script>
<template>
  <hy-nav-bar title="title"></hy-nav-bar>
  <view class="container">
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
            :class="{ 'l-chat-mine': s.content.from_id !== thouUsername }"
          >
            <view class="l-chat-item-time">
              {{ s.ctime_ms | formatTime }}
            </view>
            <view class="l-chat-item-content">
              <view class="l-chat-avatar">
                <image
                  class="l-chat-img-avatar"
                  v-if="s.content.from_id == thouUsername"
                  @tap="$nav({ url: '/pages/info/info?type=single' })"
                  :src="singleInfoAvatar"
                  mode="aspectFill"
                ></image>
                <image
                  class="l-chat-img-avatar"
                  v-else
                  :src="jimUserInfoAvatar"
                  mode="aspectFill"
                ></image>
              </view>
              <view class="l-chat-view">
                <view class="l-chat-name">
                  {{
                    s.content.from_id !== thouUsername
                      ? jimUserInfo.nickname || jimUserInfo.username
                      : singleInfo.nickname || singleInfo.username
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
                        '../../static/emoji/' +
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
                      @tap="previewImage(s.content.msg_body.image)"
                      v-if="s.content.msg_body.type"
                      :src="s.content.msg_body.image"
                      :style="{
                        'max-width': '250rpx',
                        width: s.content.msg_body.width,
                        height: s.content.msg_body.height
                      }"
                      mode="aspectFit"
                      class="l-upload-img"
                    ></image>
                    <image
                      v-else
                      @tap="
                        previewImage(jimLocalhost + s.content.msg_body.media_id)
                      "
                      :src="jimLocalhost + s.content.msg_body.media_id"
                      :style="{
                        'max-width': '250rpx',
                        width: s.content.msg_body.width,
                        height: s.content.msg_body.height
                      }"
                      mode="aspectFit"
                      class="l-upload-img"
                    ></image>
                  </view>
                </template>
                <template v-else>
                  <button class="l-chat-file">
                    <view class="l-chat-flie-view">
                      <view class="l-cfv-name">
                        文件名文件名文件名文件名文件名文件名文件名文件名文件名
                      </view>
                      <image
                        class="l-chat-file-img"
                        src="../../static/wenjian.png"
                        mode="aspectFill"
                      ></image>
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
  </view>
</template>

<style lang="scss" scoped></style>
