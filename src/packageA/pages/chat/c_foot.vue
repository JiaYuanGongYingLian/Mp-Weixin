<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 对话操作
 * @Author: Kerwin
 * @Date: 2023-07-28 16:01:21
 * @LastEditTime: 2023-12-18 11:03:00
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted, computed, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { socialApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { $toast } from '@/utils/common'
import { useUserStore, useRyStore } from '@/store'
// #ifdef MP-WEIXIN
const RongEmoji = require('../../static/js/RongIMEmoji-2.2.6.js')
// #endif
const emoji = ref([])
// #ifdef H5
RongIMLib.RongIMEmoji.init()
for (let i = 0; i < RongIMLib.RongIMEmoji.list.length; i += 36) {
  emoji.value.push(RongIMLib.RongIMEmoji.list.slice(i, i + 36))
}
// #endif
// #ifdef MP-WEIXIN
RongEmoji.init()
for (let i = 0; i < RongEmoji.list.length; i += 36) {
  emoji.value.push(RongEmoji.list.slice(i, i + 36))
}
// #endif

const props = withDefaults(
  defineProps<{
    chatType?: number
    targetId?: number | string
    referMessage?: object | null
  }>(),
  {
    chatType: 0,
    referMessage: () => {
      return null
    }
  }
)
const referMsg = computed(() => {
  if (props.referMessage) {
    const { senderUserId, senderUserName, content } = props.referMessage
    return { senderUserId, senderUserName, content }
  }
  return null
})
const isSingle = computed(() => {
  return props.chatType === 0
})
const userStore = useUserStore()
const ryStore = useRyStore()
const videoList = reactive({
  list: [],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const isEmoji = ref(false)
const isUpload = ref(false)
const emit = defineEmits(['onFocus', 'showPacket', 'closeRefer'])
const content = ref('')
const onFocus = (isScrollHeight: boolean) => {
  emit('onFocus', isScrollHeight)
}
defineExpose({
  onChatClick
})
function onChatClick() {
  isEmoji.value = false
  isUpload.value = false
  onFocus(false)
}
watch([isEmoji, isUpload], (n) => {
  if (n) {
    if (n[0] || n[1]) {
      onFocus(true)
    } else {
      onFocus(false)
    }
  }
})
function sendEmojiItem(emoji: { emoji: string }) {
  content.value += emoji.emoji
}
function sendFilesItem(tempFilePaths: any) {
  content.value = ''
  if (isUpload.value) {
    isUpload.value = !isUpload.value
  }
}
function sendImageItem(
  tempFilePath: string,
  info: UniApp.GetImageInfoSuccessData
) {
  // const fd = new FormData();
  // fd.append('image',tempFilePath)
  const params = {
    targetId: props?.targetId,
    content: tempFilePath,
    msgType: 2,
    imageUri: tempFilePath,
    group: !isSingle.value
  }
  ryStore.sendMessage(params)
  content.value = ''
  if (isUpload.value) {
    isUpload.value = !isUpload.value
  }
}
function chooseImage() {
  uni.chooseImage({
    count: 1,
    success(res) {
      const tempFilePath = res.tempFilePaths[0]
      uni.getImageInfo({
        src: tempFilePath,
        success(info) {
          sendImageItem(tempFilePath, info)
        }
      })
    }
  })
}
function chooseMessageFile() {
  // #ifdef H5
  const input = document.createElement('input')
  input.setAttribute('type', 'file')
  input.click()
  input.onchange = (e) => {
    const ipt = e.path[0]
    const file = ipt.files[0]
    sendFilesItem(file)
  }
  // #endif
  // #ifndef H5
  uni.chooseMessageFile({
    count: 1,
    success(res) {
      console.log(res)
    }
  })
  // #endif
}
// 地图选择地址
function chooseLocation() {
  uni.chooseLocation({
    success: async (data) => {
      const { latitude, longitude, name, address } = data
      const params = {
        targetId: props?.targetId,
        content: name,
        msgType: 8,
        latitude,
        longitude,
        group: !isSingle.value
      }
      ryStore.sendMessage(params)
    },
    fail: (error) => {
      console.log('error', error)
    }
  })
}
function sendMsg() {
  if (!content.value) {
    $toast('请先输入内容')
    return
  }
  const params = {
    targetId: props?.targetId,
    content: content.value,
    msgType: 1,
    group: !isSingle.value
  }
  if (referMsg.value) {
    params.msgType = 7
    params.referMsg = referMsg.value
  }
  ryStore.sendMessage(params)
  content.value = ''
  closeRefer()
}

function collapse() {
  isUpload.value = false
  isEmoji.value = false
}
function toggleEmoji(item: { value: boolean }) {
  isEmoji.value = !isEmoji.value
  isUpload.value = false
}
function toggleUpload() {
  isUpload.value = !isUpload.value
  isEmoji.value = false
}
function submit(fn: (arg0: any) => void, params: any) {
  collapse()
  fn(params)
}
function showPacket() {
  collapse()
  emit('showPacket', true)
}
function closeRefer() {
  emit('closeRefer', null)
}

onMounted((option) => {})
</script>
<template>
  <view class="wrapper">
    <view class="l-chat-posi">
      <view class="l-chat-foot">
        <view class="l-chat-form">
          <textarea
            class="l-chat-textarea"
            v-model="content"
            @focus="onFocus(false)"
            auto-height
            placeholder=""
            :cursor-spacing="20"
            :show-confirmbar="false"
          />
          <view class="refer" v-if="referMsg">
            <view class="txt">
              {{ referMsg.senderUserId }}:{{ referMsg.content.content }}
            </view>
            <u-icon
              name="close-circle-fill"
              size="26"
              color="#999"
              @click="closeRefer"
            ></u-icon>
          </view>
        </view>
        <view class="l-chat-handle">
          <image
            class="l-send-emoji"
            @tap="toggleEmoji(isEmoji)"
            :src="
              isEmoji
                ? 'https://image.blacksilverscore.com/uploads/42889f3f-9cd6-44f9-8fde-097b94d952fb.png'
                : 'https://image.blacksilverscore.com/uploads/02438d4f-40ae-40c0-8e01-524d0937e02e.png'
            "
            mode="aspectFill"
          ></image>
          <view class="l-chat-send">
            <image
              class="l-send-upload"
              @tap="toggleUpload()"
              :class="{ 'l-send-upload-50': !content }"
              src="https://image.blacksilverscore.com/uploads/fe7263ec-3b7a-4acd-879b-b542c38c29ea.png"
              mode="aspectFill"
            >
            </image>
            <button
              class="l-chat-send-btn"
              :class="{ 'l-chat-send-btn-100': content }"
              @click="submit(sendMsg, content)"
              type="default"
            >
              发送
            </button>
          </view>
        </view>
      </view>

      <view
        :class="{ 'l-chat-emoji-height': isEmoji }"
        class="l-chat-emoji-item"
      >
        <swiper :indicator-dots="true">
          <swiper-item v-for="(s, i) in emoji" :key="i">
            <view class="l-swiper-item">
              <view
                @tap="sendEmojiItem(emoji)"
                v-for="(emoji, index) in s"
                :key="index"
                class="l-icon-emoji"
                >{{ emoji.emoji }}</view
              >
            </view>
          </swiper-item>
        </swiper>
      </view>

      <view
        :class="{ 'l-chat-emoji-height': isUpload }"
        class="l-chat-head-upload"
      >
        <swiper :indicator-dots="false">
          <swiper-item>
            <view class="l-swiper-item l-chat-handle-upload">
              <view class="l-chat-upload-item">
                <view class="l-upload-img-wrap">
                  <image
                    class="l-upload-img"
                    @tap="chooseImage"
                    src="https://image.blacksilverscore.com/uploads/88fe43db-bbcb-4426-861a-628b9562c3c4.png"
                    mode="aspectFill"
                  ></image>
                </view>
                <view class="l-upload-name">相册</view>
              </view>
              <!-- <view class="l-chat-upload-item">
                <view class="l-upload-img-wrap">
                  <image class="l-upload-img" @tap="chooseMessageFile"
                    src="https://image.blacksilverscore.com/uploads/6d00c584-b472-4b78-85d2-2da964a1f7fc.png"
                    mode="aspectFill"></image>
                </view>
                <view class="l-upload-name">文件</view>
              </view> -->
              <view class="l-chat-upload-item">
                <view class="l-upload-img-wrap">
                  <u-icon
                    size="50"
                    @tap="chooseLocation"
                    name="map-fill"
                    color="#888"
                  ></u-icon>
                </view>
                <view class="l-upload-name">位置</view>
              </view>
              <view class="l-chat-upload-item">
                <view class="l-upload-img-wrap">
                  <u-icon
                    size="50"
                    @tap="showPacket"
                    name="red-packet-fill"
                    color="#888"
                  ></u-icon>
                </view>
                <view class="l-upload-name">红包</view>
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.wrapper {
  .l-chat-posi {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #ffffff;
  }

  .l-chat-foot {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    min-height: 100rpx;
    overflow: hidden;
    padding: 18rpx 21rpx;
    background-color: #f6f6f6;
    border-top: 1rpx solid #ededed;
  }

  .l-chat-emoji-item {
    background-color: #ffffff;
    width: 100%;
    height: 0;
    transition: height 0.3s;
    overflow: hidden;
    .l-swiper-item {
      display: flex;
      flex-wrap: wrap;
    }
  }

  .l-chat-emoji-height {
    height: 150px;
  }

  .l-swiper-item {
    padding-bottom: 40rpx;
  }

  .l-chat-handle-upload {
    display: flex;

    .l-chat-upload-item {
      margin-top: 20rpx;
      margin-left: 20rpx;
      flex-direction: column;

      .l-upload-img-wrap {
        background: #f6f6f6;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 110rpx;
        height: 110rpx;
        border-radius: 8rpx;

        .l-upload-img {
          width: 40rpx;
          height: 40rpx;
        }
      }

      .l-upload-name {
        font-size: 24rpx;
        text-align: center;
        margin-top: 10rpx;
      }
    }
  }

  .l-icon-emoji {
    width: 36rpx;
    height: 36rpx;
    margin: 20rpx calc((100% / 9 - 36rpx) / 2) 0;
    font-size: 38rpx;
  }
  .l-chat-form {
    flex: 1;
    margin-right: 30rpx;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    min-height: 64rpx;
    padding: 10rpx 0;
    flex-wrap: wrap;
    .l-chat-textarea {
      flex: 1;
      width: 100%;
      padding: 10rpx 20rpx;
      font-size: 30rpx;
      border-radius: 6rpx;
      background-color: #ffffff;
      min-height: 60rpx;
    }
    .refer {
      margin-top: 16rpx;
      border-radius: 6rpx;
      font-size: 22rpx;
      color: #666;
      width: 100%;
      background: rgba(0, 0, 0, 0.05);
      padding: 10rpx 20rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .refer {
        flex: 1;
        margin-right: 20rpx;
      }
    }
  }

  .l-chat-handle {
    /* min-width: 180rpx; */
    height: 64rpx;
    padding: 6rpx 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    align-self: flex-end;

    .l-send-emoji {
      width: 54rpx;
      height: 54rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }
  }

  .l-chat-send {
    display: flex;
    align-items: center;

    .l-send-upload {
      width: 0;
      height: 50rpx;
      transition: width 0.3s;
    }

    .l-send-upload-50 {
      width: 50rpx;
    }
  }
}

.l-chat-send-btn {
  width: 0;
  height: 50rpx;
  font-size: 28rpx;
  display: flex;
  margin: 0;
  padding: 0;
  color: #ffffff;
  transition: width 0.3s;
  align-items: center;
  background-color: #19be6b;
  justify-content: center;

  &.l-chat-send-btn-100 {
    width: 100rpx;
  }
}

.l-chat-head-upload {
  width: 100%;
  height: 0;
  transition: height 0.3s;
}
</style>
