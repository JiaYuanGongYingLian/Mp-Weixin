<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-22 04:42:53
 * @LastEditTime: 2023-07-22 05:30:16
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { userApi } from '@/api'
import { getImgFullPath, checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const info = ref()
const showPop = ref(false)
function openPop() {
  showPop.value = true
}
const form = reactive({
  name: '',
  phone: '',
  remark: ''
})
const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: ['blur', 'change']
    }
  ]
})
const form1 = ref()
function submit() {
  form1.value.validate((valid: any) => {
    if (valid) {
      console.log('验证通过')
    } else {
      console.log('验证失败')
    }
  })
}
defineExpose({
  openPop
})
onMounted((option) => {
  info.value = uni.getStorageSync('businessCard')
})
onReady(() => {
  try {
    form1.value.setRules(rules)
  } catch { }
})
</script>
<template>
  <view class="wrapper">
    <u-popup v-model="showPop" mode="center" width="298px" closeable border-radius="20" close-icon-color="#fff"
      close-icon="close-circle" close-icon-size="40">
      <view class="pop-head">
        <u-image src="https://image.blacksilverscore.com/uploads/05a779ee-c342-49be-a9da-541f2d9a614d.png" width="100%"
          height="130px"></u-image>
        <view class="head-con">
          <view class="pop-tit">对接提示</view>
          <view class="des">
            注：您支付咨询费，被对接人同意对接后，您可直接与其聊天咨询，如拒绝对接，资金24小时内退回。
          </view>
        </view>
      </view>
      <view class="pop-body">
        <view class="label">被对接人</view>
        <view class="card">
          <!-- <u-image :src="getImgFullPath(info.avatar)"></u-image> -->
          <view>
            <view class="name">{{ info.nickName }}</view>
          </view>
        </view>
        <view class="label">给TA留言</view>
        <u-form :model="form" ref="form1">
          <u-form-item placeholder="请输入" prop="name">
            <u-input v-model="form.name" />
          </u-form-item>
        </u-form>
        <u-button class="btn" @click="submit" shape="circle" type="primary" ripple>立即支付 ￥30</u-button>
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.wrapper {
  .pop-head {
    position: relative;
    color: #fff;

    .head-con {
      position: absolute;
      width: 100%;
      left: 0;
      top: 20px;

      .pop-tit {
        text-align: center;
        font-size: 32rpx;
        font-weight: bold;
      }

      .des {
        padding: 20rpx;
        font-size: 24rpx;
      }
    }
  }

  .pop-body {
    padding: 30rpx;
    .label {
      font-weight: bold;
      margin: 20rpx 0;
    }
    .card {
      .name {
        font-size: 30rpx;
      }
    }
  }
}
.btn {
  margin-top: 50rpx;
}
</style>
