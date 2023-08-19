<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-29 17:12:32
 * @LastEditTime: 2023-08-19 10:45:52
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi, enumAll } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const form = ref()
const formData = reactive({
  id: '',
  name: '',
  content: ''
})
const rules = reactive({
  name: [
    {
      required: true,
      message: '请填写标题',
      trigger: ['change', 'blur']
    }
  ],
  content: [
    {
      required: false,
      message: '请填写内容',
      trigger: ['change', 'blur']
    },
    {
      max: 120,
      message: '内容不能超过120字',
      trigger: 'change'
    }
  ]
})
async function dynamicUpdate(status: any) {
  const { data, code } = await socialApi.dynamicUpdate({
    ...formData,
    status
  })
  if (code === 200) {
    uni.showToast({
      title: '发布成功'
    })
  }
}
const submit = (status: any) => {
  form.value.validate((valid: any) => {
    if (valid) {
      dynamicUpdate(status)
    } else {
      console.log('验证失败')
    }
  })
}
onReady(() => {
  form.value.setRules(rules)
})
onLoad((option) => {
  const video = JSON.parse(uni.getStorageSync('video') || '') || {}
  formData.name = video.name
  formData.content = video.content
  formData.id = video.id
})
</script>
<template>
  <hy-nav-bar
    title="发布视频"
    backIconColor="#333"
    :borderBottom="false"
    :background="{ background: 'transparent' }"
  ></hy-nav-bar>
  <view class="container">
    <u-form :model="formData" ref="form" label-position="top">
      <view class="section">
        <!-- <view class="title">基本信息</view> -->
        <view class="item">
          <u-form-item
            required
            label="标题"
            label-width="auto"
            prop="name"
            :border-bottom="false"
            ><u-input
              v-model="formData.name"
              type="textarea"
              maxlength="60"
              placeholder="请填写标题"
          /></u-form-item>
        </view>
        <view class="item">
          <u-form-item
            label="内容"
            label-width="auto"
            prop="content"
            :border-bottom="false"
            ><u-input
              v-model="formData.content"
              type="textarea"
              maxlength="120"
              placeholder="填写描述（选填）"
          /></u-form-item>
        </view>
      </view>
    </u-form>
    <view class="actions">
      <u-button
        class="submitBtn"
        @click="submit(enumAll.audit_status_enum.DEFAULT)"
        type="warning"
        ripple
        >存入草稿</u-button
      >
      <u-button
        class="submitBtn"
        @click="submit(enumAll.audit_status_enum.SUCCESS)"
        type="primary"
        ripple
        >发布视频</u-button
      >
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 22rpx;
  .section {
    // background: #fff;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
    .item {
      background: #fff;
      padding: 0 30rpx;
      margin-bottom: 20rpx;
    }
    .title {
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }
    .tips {
      font-size: 20rpx;
      color: red;
    }
  }
}
.actions {
  display: flex;
  gap: 30rpx;
  margin-top: 40rpx;
  .u-btn {
    flex: 1;
  }
}
</style>
