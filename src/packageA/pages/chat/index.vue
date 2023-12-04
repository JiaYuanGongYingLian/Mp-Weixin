<!-- eslint-disable consistent-return -->
<!-- eslint-disable no-plusplus -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 聊天界面
 * @Author: Kerwin
 * @Date: 2023-07-25 10:21:35
 * @LastEditTime: 2023-12-04 14:45:37
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch, onUnmounted } from 'vue'
import { onLoad, onShow, onReady, onHide } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import RongIMLib from '@/common/rongYun/im_init'
import { baseApi, productApi, socialApi } from '@/api'
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
import c_hongbao from './c_hongbao.vue'
import { route } from '@/utils/common'
import hongbao from '../../static/img/hongbao.png'
import hongbao_chai from '../../static/img/red-chai.png'

const $config = reactive({})
const emojiAllJson = reactive([])
const userStore = useUserStore()
const chatStore = useChatStore()
const ryStore = useRyStore()
const { singleInfo, syncConversation, groupMemberList } = storeToRefs(chatStore)
const { userinfo, pinia_messagelist, pinia_groupUserlist } =
  storeToRefs(ryStore)
const chatType = ref(0)
const targetId = ref()
const chatList = computed(() => {
  if (!ryStore.userinfo?.id) return []
  if (!targetId.value) return []
  if (!pinia_messagelist.value[ryStore.userinfo.id]) return []
  const msglist =
    pinia_messagelist.value[ryStore.userinfo.id][targetId.value] || []
  const userlist =
    pinia_groupUserlist.value[ryStore.userinfo.id][targetId.value] || []
  msglist.forEach((msg: { senderUserId: any; user: any }) => {
    const user = userlist.find(
      (item: { rongId: string }) => item.rongId === msg.senderUserId
    )
    if (user) {
      msg.user = user.user
    }
  })
  return msglist
})
const promise = Promise.resolve()
function nextTick(callback?: Function) {
  return promise.then(callback)
}
const isScrollHeight = ref(false)
const scrollView = ref()
function setChatScrollHeight(arg_isScrollHeight?: boolean | undefined) {
  isScrollHeight.value = arg_isScrollHeight || false
}
function setChatScrollTop() {
  chatScrollTop.value += 10
  bottomId.value = `msg${chatList.value.length - 1}`
}
const bottomId = ref(`msg${chatList.value.length - 1}`)
watch(
  chatList,
  (n) => {
    if (n) {
      setChatScrollHeight()
      nextTick(setChatScrollTop)
    }
  },
  { deep: true }
)
const chatScrollTop = ref(999999)
const groupInfo = reactive({
  name: '',
  gid: '',
  cid: ''
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
const message_checked = ref({})
const message_checked_index = ref()
const msgpupRef = ref()
function onLongPress(e: { message?: any }, message: any, i: number) {
  e.message = message
  msgPupData.value = e
  message_checked.value = message
  message_checked_index.value = i
  setTimeout(() => {
    msgpupRef.value?.showPop()
  }, 200)
}
// 引用消息
const referMessage = ref<null | Object>(null)
function setReferFn(data: Object | null) {
  referMessage.value = data
}

function toGroupDetail() {
  route({
    url: '/packageA/pages/chatGroup/detail',
    params: {
      gid: targetId.value,
      cid: groupInfo.cid
    }
  })
}

// 点击红包
const hongBaoRef = ref()
function openhb(message: { content: any }, i: any) {
  message_checked.value = message
  message_checked_index.value = i
  if (message.content.status === 1) {
    hongBaoRef.value.openhb(message.content)
  } else {
    route({
      url: '/packageA/pages/hongBaoRecord/index',
      params: {
        id: message.content.friendCircleRedPacketId
      }
    })
  }
}
// 发送红包
function sendRedPacket() {
  hongBaoRef.value.sendRedPacketShow()
}
// 更新消息
function msgUpdate() {
  message_checked.value.content.status = 0
  ryStore.setMessage(
    message_checked.value,
    'update',
    message_checked_index.value
  )
}
// 删除消息
function msgDelete() {
  ryStore.setMessage(
    message_checked.value,
    'delete',
    message_checked_index.value
  )
}
// 获取群成员
async function circleUserList() {
  const { data } = await socialApi.circleUserList({
    friendCircleId: groupInfo.cid,
    detail: true,
    noPaging: true
  })
  data.map((e: { user: { avatar: string } }) => {
    if (!e.user.avatar) {
      e.user.avatar = RY_AVATAR
    }
    e.user.avatar = getImgFullPath(e.user.avatar)
    return e.user
  })
  ryStore.setGroupUser({ targetId: targetId.value, userList: data }, 'add')
}
onLoad(async (option) => {
  groupInfo.gid = option?.groupId
  groupInfo.cid = option?.cid
  groupInfo.name = option?.groupName
  chatType.value = Number(option?.type)
  targetId.value = option?.targetId
  await ryStore.clearMessagesUnreadStatus({
    targetId: targetId.value,
    isGroup: false
  })
  circleUserList()
})

onUnmounted(() => {})
</script>
<template>
  <view class="container">
    <u-navbar :title="chatType === 1 ? groupInfo.name : singleInfo.nickname">
      <view slot="right">
        <u-icon
          class="u-m-r-30"
          name="more-dot-fill"
          size="40"
          @click="toGroupDetail"
        ></u-icon>
      </view>
    </u-navbar>
    <view class="l-chat-body" @tap="onChatClick">
      <!-- :scroll-top="chatScrollTop" -->
      <!-- :scroll-into-view="bottomId" -->

      <scroll-view
        scroll-y="true"
        class="l-char-scroll"
        scroll-with-animation
        :scroll-top="chatScrollTop"
        :class="{ 'l-char-scroll-height': isScrollHeight }"
      >
        <view class="l-char-scroll-content">
          <view class="l-char-empty"> 已经没有聊天记录了~ </view>
          <template v-for="(s, i) in chatList" :key="i">
            <view
              class="l-chat-item"
              :class="{
                'l-chat-mine': s.messageDirection === 1
              }"
              :id="'msg' + i"
              v-if="s.messageType !== 'RC:SRSMsg'"
              @longpress="onLongPress($event, s, i)"
            >
              <view class="l-chat-item-time" v-if="showTime(i)">
                {{ dateFormat(new Date(s.sentTime), 'MM-dd hh:mm') }}
              </view>
              <view class="l-chat-item-content">
                <view class="l-chat-avatar">
                  <u-image
                    width="80"
                    height="80"
                    :loading-icon="RY_AVATAR"
                    :error-icon="RY_AVATAR"
                    :src="
                      s?.user?.avatar
                        ? getImgFullPath(s?.user?.avatar)
                        : RY_AVATAR
                    "
                    :lazy-load="false"
                    :fade="false"
                    mode="aspectFill"
                  ></u-image>
                </view>
                <view class="l-chat-view">
                  <view class="l-chat-name" v-if="chatType === 1">
                    {{ s?.user?.nickname ? s?.user?.nickname : s.senderUserId }}
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
                  <template v-else-if="s.messageType === 'KX:HongBao'">
                    <view
                      class="message-red-packet"
                      :class="{ chai: !s.content.status }"
                      @click="openhb(s, i)"
                    >
                      <view class="contents">
                        <u-image
                          mode="widthFix"
                          :loading-icon="hongbao"
                          :error-icon="hongbao"
                          :lazy-load="false"
                          :fade="false"
                          :width="s.content.status === 1 ? 70 : 60"
                          :src="s.content.status === 1 ? hongbao : hongbao_chai"
                        ></u-image>
                        <view class="packet">
                          <view class="name">{{
                            s.content.content || '恭喜发财，大吉大利'
                          }}</view>
                          <view class="tips" v-if="s.content.status === 0"
                            >已领取</view
                          >
                        </view>
                      </view>
                      <view class="footer u-border-top">开心红包</view>
                    </view>
                  </template>
                </view>
              </view>
            </view>
          </template>
        </view>
      </scroll-view>
    </view>
    <c_msgpup
      ref="msgpupRef"
      :chatType="chatType"
      :msgPupData="msgPupData"
      @reference="setReferFn"
      @delete="msgDelete"
    ></c_msgpup>
    <c_hongbao
      ref="hongBaoRef"
      :chatType="chatType"
      :target-id="targetId"
      :circleId="groupInfo.cid"
      @received="msgUpdate"
    />
    <c_foot
      ref="footerRef"
      @on-focus="setChatScrollHeight"
      :chatType="chatType"
      :target-id="targetId"
      :referMessage="referMessage"
      @closeRefer="setReferFn"
      @showPacket="sendRedPacket"
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
  overflow-y: scroll;
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
  @include ellipsis();
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
  .message-red-packet::after {
    left: auto;
    right: -18rpx;
    border-color: transparent transparent transparent orange;
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
.message-red-packet {
  position: relative;
  border-radius: 8rpx;
  background: orange;
  color: #fff;
  text-align: left;
  display: inline-table;
  max-width: 300px;
  min-width: 200px;
  height: 70px;
  box-shadow: 1px 1px 1px 1px #efefef;
  &::after {
    content: ' ';
    display: block;
    position: absolute;
    top: 34rpx;
    width: 0;
    height: 0;
    left: -18rpx;
    transform: translate(0, -50%);
    border: 10rpx solid;
    border-color: transparent orange transparent transparent;
  }
  &.chai {
    opacity: 0.4;
  }

  .contents {
    padding: 20rpx;
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    position: relative;
    min-height: 80rpx;
    line-height: 40rpx;
    text-align: left;
    height: 60px;
    color: #fff;
  }

  .packet {
    padding-left: 15rpx;
    display: flex;
    flex-direction: column;
    .name {
      font-size: 28rpx;
      font-weight: bold;
      font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
      @include ellipsis();
    }
    .tips {
      font-size: 20rpx;
    }
  }

  .footer {
    font-size: 20rpx;
    height: 20px;
    padding: 4rpx 0 0 16px;
    color: rgba(255, 255, 255, 0.5);
  }
}
</style>
