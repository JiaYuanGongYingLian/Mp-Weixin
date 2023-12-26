<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-29 17:12:32
 * @LastEditTime: 2023-12-26 17:04:58
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
import { webUploadVideo } from '@/common/ali-oss'
import { UPLOADURL } from '@/common/config'

const userStore = useUserStore()
const { hasLogin, hasNewDynamic } = storeToRefs(userStore)
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
const videoUrl = ref('')
const progress = ref(0)
const progressPrev = ref(0)
const counter = ref()

async function dynamicAdd() {
  const { code } = await socialApi.dynamicAdd({
    content: '',
    count: 0,
    type: 3,
    status: enumAll.audit_status_enum.SUCCESS,
    videoUrl: videoUrl.value,
    remark: '',
    userId: userStore.userInfo.id,
    previewImage: `${videoUrl.value}?x-oss-process=video/snapshot,t_0,f_jpg,w_540,ar_auto`
  })
  if (code === 200) {
    uni.showToast({
      title: '发布成功',
      success() {
        hasNewDynamic.value = true
        uni.navigateBack()
      }
    })
  }
}
function chooseVideo() {
  uni.chooseVideo({
    compressed: true,
    sourceType: ['album', 'camera'],
    camera: 'back',
    maxDuration: 60,
    success: (res) => {
      // #ifdef H5
      webUploadVideo({
        file: res.tempFile,
        onSuccess: async (ret: { name: string }) => {
          videoUrl.value = ret.name
          progress.value = 0
          dynamicAdd()
        },
        onError() {
          uni.showToast({
            title: '上传失败'
          })
        },
        onProgress(p: number) {
          progressPrev.value = progress.value
          progress.value = p
          counter.value.start()
        },
        uploadPath: ''
      })
      // #endif
      // #ifndef H5
      uni.uploadFile({
        url: UPLOADURL,
        filePath: res.tempFilePath,
        header: {
          Authorization: `Bearer ${uni.getStorageSync('accessToken') || ''}`
        },
        name: 'object',
        success(ret) {
          const { data } = ret
          const jsonData = JSON.parse(data)
          videoUrl.value = jsonData.data
          progress.value = 80
          setTimeout(async () => {
            await dynamicAdd()
            progress.value = 0
          }, 1000)
        }
      })
      // #endif
    }
  })
}
const submit = () => {
  form.value.validate((valid: any) => {
    if (valid) {
      dynamicAdd()
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
  <!-- <hy-nav-bar
    title=""
    backIconColor="#333"
    :borderBottom="false"
    :background="{ background: 'transparent' }"
  ></hy-nav-bar> -->
  <view class="container">
    <u-form :model="formData" ref="form" label-position="top">
      <view class="section">
        <view class="item">
          <u-form-item
            label=""
            label-width="auto"
            prop="content"
            :border-bottom="false"
            ><u-input
              v-model="formData.content"
              type="textarea"
              maxlength="120"
              placeholder="说点什么"
          /></u-form-item>
        </view>
      </view>
    </u-form>
    <view class="actions">
      <view class="act">
        <u-icon
          name="tupian"
          :custom-prefix="'custom-icon'"
          @click="chooseVideo"
        ></u-icon>
        <u-icon
          name="shipin"
          :custom-prefix="'custom-icon'"
          @click="chooseVideo"
        ></u-icon>
        <u-icon
          name="wenjianjia"
          :custom-prefix="'custom-icon'"
          @click="chooseVideo"
        ></u-icon>
      </view>
      <u-button class="submitBtn" @click="submit()" type="primary" ripple
        >发布</u-button
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
  position: fixed;
  left: 0;
  bottom: env(safe-area-inset-bottom);
  width: 100%;
  box-sizing: border-box;
  display: flex;
  padding: 30rpx;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  box-shadow: 0 0 5rpx 0 rgba(0, 0, 0, 0.1);
  .act {
    display: flex;
    font-size: 50rpx;
    font-weight: bold;
    gap: 60rpx;
  }
  .u-btn {
    margin: 0;
  }
}
</style>
