<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: 群相关信息编辑
 * @Author: Kerwin
 * @Date: 2023-12-08 12:37:48
 * @LastEditTime: 2024-01-13 17:01:05
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref, computed } from 'vue'
import { getImgFullPath } from '@/utils/index'
import { RY_AVATAR } from '@/common/config'
import { socialApi } from '@/api'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const infoTemplate = [
  {
    type: 1,
    tit: '我在群里的昵称',
    con: '昵称修改后，只会在此群内显示，群内成员都可以看见',
    key: 'nickname',
    fn: circleUserUpdate
  },
  {
    type: 2,
    tit: '修改群聊名称',
    con: '修改群聊名称后，将在群内通知其他成员',
    key: 'name',
    fn: circleUpdate
  },
  {
    type: 3,
    tit: '修改群简介',
    con: '修改群简介后，群内成员都可以看见',
    key: 'remark',
    fn: circleUpdate
  }
]
const type = ref(1)
const info = ref({})
const avatarList = ref([])
const textVal = ref('')
const groupInfo = ref({})
const changed = computed(() => {
  return !!textVal.value
})
async function circleUserUpdate() {
  const { code } = await socialApi.circleUserUpdate({
    chatGroupId: groupInfo.value.gid,
    friendCircleId: groupInfo.value.cid,
    userId: userStore.userInfo.id,
    nickname: textVal.value,
    id: info.value.id
  })
  if (code === 200) {
    uni.showToast({
      icon: 'none',
      title: '更新成功'
    })
    uni.navigateBack({ delta: 1 })
  }
}
async function circleUpdate() {
  const data = {
    chatGroupId: groupInfo.value.gid,
    friendCircleId: groupInfo.value.cid,
    id: info.value.id
  }
  if (type.value === 2) {
    data.name = textVal.value
  }
  if (type.value === 3) {
    data.remark = textVal.value
  }
  const { code } = await socialApi.circleUpdate(data)
  if (code === 200) {
    uni.showToast({
      icon: 'none',
      title: '更新成功'
    })
    uni.navigateBack({ delta: 1 })
  }
}
function submit() {
  info.value.fn()
}
function onChange(e: { detail: { value: string } }) {
  textVal.value = e.detail.value
}
onLoad((option) => {
  type.value = Number(option?.type)
  if (!option?.type) {
    uni.navigateBack()
  }
  info.value = infoTemplate.find((item) => item.type === type.value) as {}
  groupInfo.value = JSON.parse(option?.groupInfo)
  avatarList.value = JSON.parse(option?.avatarList)
  if (type.value === 1) {
    const mySelfInfoInGroup = JSON.parse(
      uni.getStorageSync('mySelfInfoInGroup')
    )
    textVal.value = mySelfInfoInGroup?.circle_nickname
    info.value.id = mySelfInfoInGroup?.fid
  } else if (type.value === 2) {
    const groupInfo = JSON.parse(option?.groupInfo)
    textVal.value = groupInfo?.name
    info.value.id = groupInfo?.id
  } else if (type.value === 3) {
    const groupInfo = JSON.parse(option?.groupInfo)
    textVal.value = groupInfo?.remark
    info.value.id = groupInfo?.id
  }
  console.log(groupInfo.value)
})
</script>
<template>
  <view class="container">
    <view class="tit">{{ info.tit }}</view>
    <view class="con">{{ info.con }}</view>
    <view class="inpt">
      <view class="imgBox">
        <u-image
          v-for="(item, index) in avatarList"
          :key="index"
          :src="getImgFullPath(item)"
          mode="widthFix"
          width="25rpx"
          height="25rpx"
          :error-icon="RY_AVATAR"
        ></u-image>
      </view>
      <view class="inptr">
        <u-input
          v-model="textVal"
          type="textarea"
          :border="false"
          :height="40"
          :auto-height="true"
          clearable
          v-if="type != 1"
        />
        <input
          v-else
          v-model="textVal"
          type="nickname"
          :border="false"
          :height="40"
          :auto-height="true"
          clearable
          @change="onChange"
        />
      </view>
    </view>
    <view class="btn">
      <u-button
        type="success"
        size="default"
        :custom-style="{ width: '200rpx' }"
        :disabled="!changed"
        ripple
        @click="submit"
        >完成</u-button
      >
    </view>
  </view>
</template>
<style lang="scss" scoped>
.container {
  padding: 30rpx;
  text-align: center;

  .tit {
    font-size: 40rpx;
    font-weight: bold;
    margin-top: 100rpx;
  }

  .con {
    margin-top: 40rpx;
  }

  .inpt {
    display: flex;
    align-items: center;
    margin-top: 40rpx;

    .imgBox {
      width: 95rpx;
      height: 95rpx;
      border-radius: 8rpx;
      background: #ccc;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
      gap: 6;
      margin-right: 18rpx;
    }
    .inptr {
      flex: 1;
    }
  }

  .btn {
    margin-top: 200rpx;
  }
}
</style>
