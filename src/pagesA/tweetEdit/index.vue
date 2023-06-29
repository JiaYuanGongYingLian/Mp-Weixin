<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-29 17:12:32
 * @LastEditTime: 2023-06-29 17:51:04
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const shopId = ref('')
const form = ref()
let formData = reactive({
  shopType: 3,
  categoryName: '',
  categoryId: '',
  name: '',
  remark: ''
})
const rules = reactive({
  name: [
    {
      required: true,
      message: '请填写商家名称',
      trigger: ['change', 'blur']
    }
  ],
  remark: [
    {
      required: true,
      message: '请填写商家简介',
      trigger: ['change', 'blur']
    },
    {
      min: 5,
      message: '简介不能少于5个字',
      trigger: 'change'
    }
  ]
})
const submit = () => {
  form.value.validate((valid: any) => {
    console.log(205, formData)
    if (valid) {
      formData = reactive({ ...formData })
      if (shopId.value) {
        // shopUpdate()
      } else {
        // shopAdd()
      }
    } else {
      console.log('验证失败')
    }
  })
}
onLoad((option) => {})
</script>
<template>
  <hy-nav-bar
    title=""
    backIconColor="#fff"
    :borderBottom="false"
    :background="{ background: 'transparent' }"
  ></hy-nav-bar>
  <view class="container">
    <u-form :model="formData" ref="form" label-position="top">
      <view class="section">
        <!-- <view class="title">基本信息</view> -->
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
    </u-form>
    <u-button class="submitBtn" @click="submit" type="primary" ripple
      >提交</u-button
    >
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 22rpx;
  .section {
    padding: 30rpx 24rpx;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 30rpx;
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
</style>
