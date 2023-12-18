<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-11-30 17:32:42
 * @LastEditTime: 2023-12-18 11:37:27
 * @LastEditors:  Please set LastEditors
-->

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { Md5 } from 'ts-md5'
import pinyin from 'js-pinyin'
import { route } from '@/utils/common'
import { useRyStore } from '@/store'
import { socialApi, userApi } from '@/api'
import { getImgFullPath } from '@/utils'
import { RY_AVATAR } from '@/common/config'

const ryStore = useRyStore()
const scrollTop = ref(0)
const addlist = ref<{}[]>([])
const circleInfo = reactive({
  friendCircleId: '',
  chatGroupId: ''
})
const list = ref<{}[]>([])
const letterArr = computed(() => {
  return list.value.map((item) => item.letter)
})
function checkbox(e: { name?: any; id?: any }) {
  const { name } = e
  const i = addlist.value.findIndex((item) => item?.userId == name)
  if (i < 0) {
    addlist.value.push({ userId: name, ...circleInfo })
  } else {
    addlist.value.splice(i, 1)
  }
}
function isChineseOrLetter(char) {
  const regex = /^[\u4e00-\u9fa5a-zA-Z]+$/
  return regex.test(char)
}
async function getUserWithoutGroup() {
  const { data } = await userApi.userList({
    detail: true,
    noPaging: true,
    type: 1
  })
  const temp = data.map((item: { nickname: string }) => {
    const fs = item.nickname.substr(0, 1)
    const ff = isChineseOrLetter(fs)
      ? pinyin.getFullChars(fs).toUpperCase().substr(0, 1)
      : 'fs' // 首字
    return {
      letter: ff,
      user: item
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
    dataInfo[letter].data.push({ ...item.user, checked: false })
  })
  list.value = Object.values(dataInfo) // list 转换成功的数据
}
async function addUserBatch() {
  const { code } = await socialApi.circleUserAddBatch(addlist.value)
  if (code === 200) {
    uni.showToast({
      icon: 'none',
      title: '添加成功'
    })
    hideChecked()
  }
}
function hideChecked() {
  list.value.forEach((item) => {
    item.forEach((e: { hide: boolean }) => {
      e.hide = true
    })
  })
}
function submit() {
  addUserBatch()
}
onLoad((option) => {
  circleInfo.friendCircleId = option?.cid
  circleInfo.chatGroupId = option?.gid
  getUserWithoutGroup()
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
                :name="item1?.id"
                :key="item1?.id"
                @change="checkbox"
              ></u-checkbox>
              <u-image
                width="100"
                height="100"
                border-radius="8"
                :loading-icon="RY_AVATAR"
                :error-icon="RY_AVATAR"
                :src="item1?.avatar ? getImgFullPath(item1?.avatar) : RY_AVATAR"
                :lazy-load="false"
                :fade="false"
                mode="aspectFill"
              ></u-image>
              <view class="content">
                <view class="title">
                  <view>{{ item1?.nickname }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-index-list>
    </view>
    <view class="bottom-wrap">
      <view class="bottom">
        <u-button
          type="primary"
          size="big"
          class="button"
          @click="submit"
          :custom-style="{
            height: '70rpx'
          }"
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
      justify-content: space-between;
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
    }
  }
}
</style>
