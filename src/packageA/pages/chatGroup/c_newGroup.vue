<!--
 * @Description: 新增群聊
 * @Author: Kerwin
 * @Date: 2023-11-29 11:16:12
 * @LastEditTime: 2024-01-13 01:01:24
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { UPLOADURL } from '@/common/config'
import { useUserStore } from '@/store'
import { socialApi } from '@/api'
import { getImgFullPath } from '@/utils'

const userStore = useUserStore()
const showPop = ref(false)
const formData = reactive({
  type: 20,
  avatar: '',
  name: '',
  userId: userStore.userInfo.id,
  remark: ''
})
const tempImageData = reactive({
  avatar: ''
})
function addNewGroup() {
  showPop.value = true
}
const header = {
  Authorization: `Bearer ${uni.getStorageSync('accessToken') || ''}`,
  // #ifdef MP-WEIXIN
  'Content-Type': 'multipart/form-data'
  // #endif
}
function uploadSuccess(data: any, index: any, lists: any, name: string) {
  tempImageData[name] = data.data
}
defineExpose({
  addNewGroup
})
const emit = defineEmits(['onSuccess'])
async function submit() {
  if (!tempImageData.avatar) {
    uni.showToast({
      icon: 'none',
      title: '请上传群头像'
    })
    return
  }
  if (!formData.name) {
    uni.showToast({
      icon: 'none',
      title: '请填写群名称'
    })
    return
  }
  if (!formData.remark) {
    uni.showToast({
      icon: 'none',
      title: '请填写群简介'
    })
    return
  }
  const { code } = await socialApi.circleAdd({
    ...formData,
    ...tempImageData
  })
  showPop.value = false
  uni.showToast({
    icon: 'none',
    title: '创建成功'
  })
  emit('onSuccess')
}
</script>
<template>
  <view>
    <u-popup
      v-model="showPop"
      mode="center"
      width="298px"
      closeable
      border-radius="20"
      close-icon-color="#fff"
      close-icon="close-circle"
      close-icon-size="40"
      :z-index="3"
    >
      <view class="pop-head">
        <u-image
          src="https://image.blacksilverscore.com/uploads/05a779ee-c342-49be-a9da-541f2d9a614d.png"
          width="100%"
          height="80px"
        ></u-image>
        <view class="head-con">
          <view class="pop-tit">群聊信息</view>
        </view>
      </view>
      <view class="pop-body">
        <u-form
          :model="formData"
          ref="form"
          :label-style="{ fontWeight: 'bold' }"
        >
          <view class="section">
            <u-form-item
              label="群头像"
              label-width="auto"
              prop="avatar"
              required
            >
              <u-upload
                width="140"
                height="140"
                ref="upload1"
                :action="UPLOADURL"
                max-count="1"
                :header="header"
                name="object"
                @on-success="uploadSuccess"
                index="avatar"
                :uploadText="null"
                :file-list="
                  formData.avatar
                    ? [{ url: getImgFullPath(formData.avatar) }]
                    : []
                "
              ></u-upload>
            </u-form-item>
            <u-form-item required label="群名称" label-width="auto" prop="name"
              ><u-input v-model="formData.name" placeholder="请填写群名称"
            /></u-form-item>
            <u-form-item
              :border-bottom="false"
              label="群简介"
              label-width="auto"
              label-position="left"
              required
              ><u-input
                v-model="formData.remark"
                input-align="left"
                type="textarea"
                placeholder="请填写群简介"
            /></u-form-item>
          </view>
        </u-form>
        <u-button
          class="btn"
          @click="submit"
          shape="circle"
          type="primary"
          ripple
          :custom-style="{ background: '#ff522d', height: '70rpx' }"
          >保存</u-button
        >
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.pop-head {
  position: relative;
  color: #fff;

  .head-con {
    position: absolute;
    width: 100%;
    left: 0;
    top: 30px;

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
  .btn {
    margin-top: 30rpx;
  }
  :deep(.u-add-wrap) {
    border-radius: 50%;
    .u-add-tips {
      display: none;
    }
    .u-preview-wrap {
      // background: none;
      border: 0;
    }
  }
  :deep(.u-preview-wrap) {
    border-radius: 50%;
    .u-preview-image {
      border-radius: 50%;
    }
  }
}
</style>
