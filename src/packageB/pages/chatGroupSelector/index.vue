<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-11-30 17:32:42
 * @LastEditTime: 2023-12-18 11:36:47
 * @LastEditors:  Please set LastEditors
-->

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import pinyin from 'js-pinyin'
import { route, isEmptyObject } from '@/utils/common'
import { useRyStore, useUserStore } from '@/store'
import { socialApi, userApi } from '@/api'
import { getImgFullPath } from '@/utils'
import { RY_AVATAR } from '@/common/config'

const ryStore = useRyStore()
const userStore = useUserStore()
const scrollTop = ref(0)
const addlist = ref<{}[]>([])
const list = ref<{}[]>([])
const groups = ref<{}[]>([])
const letterArr = computed(() => {
  return list.value.map((item) => item.letter)
})
function checkbox(e: { name?: any; id?: any }) {
  const { name } = e
  // const i = addlist.value.findIndex((item) => item?.id === name)
  // const data = groups.value.find((item) => item?.friendCircleId === name) || {}
  // if (i < 0) {
  //   addlist.value.push(data.friendCircle || {})
  // } else {
  //   addlist.value.splice(i, 1)
  // }
}
function isChineseOrLetter(char) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z]+$/
  return regex.test(char)
}
async function getChatGroups() {
  const { data } = await socialApi.circleUserList({
    detail: true,
    noPaging: true,
    type: 0,
    userId: userStore.userInfo.id
  })
  groups.value = data
  const temp = data.map((item) => {
    const fs = item?.friendCircle?.name.substr(0, 1)
    const ff = isChineseOrLetter(fs)
      ? pinyin.getFullChars(fs).toUpperCase().substr(0, 1)
      : 'fs' // 首字
    return {
      letter: ff,
      data: item
    }
  })
  const dataInfo = {}
  temp.forEach((item: { letter: string }) => {
    const { letter } = item
    if (!dataInfo[letter]) {
      dataInfo[letter] = {
        letter,
        data: []
      }
    }
    dataInfo[letter].data.push({ ...item.data, checked: false })
  })
  list.value = Object.values(dataInfo) // list 转换成功的数据
}
async function sendGroupInfo() {
  console.log(addlist.value)
}
function hideChecked() {
  list.value.forEach((item) => {
    item.forEach((e: { hide: boolean }) => {
      e.hide = true
    })
  })
}
function submit() {
  if (!isEmptyObject(shareData.value)) {
    invokeSendMessage()
    return
  }
  sendGroupInfo()
}
// 发送分享消息
const shareData = ref({})
function invokeSendMessage() {
  const { friendCircle } =
    groups.value.find((item) => item?.friendCircleId === addlist.value[0]) || {}
  ryStore.sendMessage({
    msgType: shareData.value.msgType,
    targetId: friendCircle?.chatGroupId,
    ...shareData.value
  })
  uni.showModal({
    title: '提示',
    content: '消息发送成功，是否立即查看？',
    async success(res) {
      if (res.confirm) {
        route({
          url: '/packageA/pages/chat/index',
          params: {
            targetId: friendCircle?.chatGroupId,
            groupName: friendCircle?.name,
            cid: friendCircle?.id,
            type: 1
          },
          type: 2
        })
      } else {
        console.log('取消查看')
      }
    }
  })
}

onLoad((option) => {
  console.log(option?.shareData)
  if (option?.shareData) {
    shareData.value = JSON.parse(option?.shareData)
  }
  getChatGroups()
})
</script>

<template>
  <view class="container">
    <view class="list">
      <u-index-list
        :scrollTop="scrollTop"
        :sticky="false"
        :indexList="letterArr"
      >
        <u-checkbox-group max="1" v-model="addlist">
          <view v-for="(item, index) in list" :key="index">
            <u-index-anchor :use-slot="true" :index="item.letter">
              <view class="u-m-l-10">{{ item.letter }}</view>
            </u-index-anchor>
            <view
              class="list-wrap u-border-bottom"
              v-for="(item1, index) in item.data"
              :key="index"
              v-show="!item1.hide"
            >
              <view class="body-item">
                <u-checkbox
                  v-model="item1.checked"
                  shape="circle"
                  size="40"
                  :name="item1?.friendCircleId"
                  :key="item1?.friendCircleId"
                  :disabled="
                    addlist.length > 0 && item1?.friendCircleId !== addlist[0]
                  "
                  @change="checkbox"
                ></u-checkbox>
                <u-image
                  width="100"
                  height="100"
                  border-radius="8"
                  :loading-icon="RY_AVATAR"
                  :error-icon="RY_AVATAR"
                  :src="
                    item1?.friendCircle?.avatar
                      ? getImgFullPath(item1?.friendCircle?.avatar)
                      : RY_AVATAR
                  "
                  :lazy-load="false"
                  :fade="false"
                  mode="aspectFill"
                ></u-image>
                <view class="content">
                  <view class="title">
                    <view>{{ item1?.friendCircle?.name }}</view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </u-checkbox-group>
      </u-index-list>
    </view>
    <view class="bottom-wrap">
      <view class="bottom">
        <u-button
          type="primary"
          size="big"
          :custom-style="{
            height: '70rpx'
          }"
          class="button"
          @click="submit"
          ripple
          >完成{{
            addlist.length == 0 ? '' : ' (' + addlist.length + ')'
          }}</u-button
        >
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.container {
  background: #fff;
  display: flex;
  flex-direction: column;
  .list {
    flex: 1;
  }
}
.list-wrap {
  padding: 18rpx 30rpx;

  .body-item {
    display: flex;
    height: auto;
    width: 100%;
    color: #333;
    align-items: center;

    .content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 20rpx;

      .title {
        display: flex;
        padding-top: 10rpx;
        font-size: 35rpx;
        line-height: 40rpx;
        font-weight: bold;
      }
    }
  }
}

.body-item .images {
  width: 73rpx;
  height: 73rpx;
}
.bottom-wrap {
  height: 150rpx;
  flex-shrink: 0;
  .bottom {
    z-index: 1000;
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #f4f4f5;
    margin-bottom: env(safe-area-inset-bottom);
    padding: 20rpx 30rpx;

    .button {
      width: 100%;
      height: 70rpx;
      box-sizing: border;
      margin-bottom: env(safe-area-inset-bottom);
    }
  }
}
:deep(.u-checkbox-group) {
  display: block;
}
</style>
