<!-- eslint-disable no-unused-expressions -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-29 17:12:32
 * @LastEditTime: 2023-12-31 21:50:23
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi, enumAll } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'
import { webUploadVideo } from '@/common/ali-oss'
import { UPLOADURL } from '@/common/config'

const userStore = useUserStore()
const { hasLogin, hasNewDynamic } = storeToRefs(userStore)
const form = ref()
const formData = reactive({
  id: '',
  name: '',
  content: '',
  videoUrl: '',
  resources: []
})
const friendCircleId = ref('')
const dynamicId = ref('')
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
const progress = ref(0)
const progressPrev = ref(0)
const counter = ref()

async function dynamicAdd() {
  const { code } = await socialApi.circleDynamicAdd({
    content: formData.content,
    status: enumAll.audit_status_enum.SUCCESS,
    videoUrl: formData.videoUrl,
    resources: formData.resources,
    remark: '',
    userId: userStore.userInfo.id,
    previewImage: formData.videoUrl
      ? `${formData.videoUrl}?x-oss-process=video/snapshot,t_0,f_jpg,w_540,ar_auto`
      : '',
    friendCircleId: friendCircleId.value
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

function handleChooseSuccess(i: number, res: any) {
  console.log('chooseRes===>', res)
  if (i === 1) {
    res.tempFiles = [res.tempFile]
  }
  // #ifdef H5
  res.tempFiles.forEach((e: any) => {
    webUploadVideo({
      file: e,
      onSuccess: async (ret: { name: string }) => {
        if (i === 0) {
          formData.resources.push({
            resourceUrl: ret.name
          })
        }
        if (i === 1) {
          formData.videoUrl = ret.name
        }
        progress.value = 0
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
  })

  // #endif
  // #ifndef H5
  if (!res.tempFilePaths) {
    res.tempFilePaths = res.tempFiles.map((item: { path: any }) => item.path)
  }
  res.tempFilePaths.forEach((e: any) => {
    uni.uploadFile({
      url: UPLOADURL,
      filePath: e,
      header: {
        Authorization: `Bearer ${uni.getStorageSync('accessToken') || ''}`
      },
      name: 'object',
      success(ret) {
        const { data } = ret
        const jsonData = JSON.parse(data)
        formData.resources.push({
          resourceUrl: jsonData.data
        })
        if (i === 1) {
          formData.videoUrl = jsonData.data
        }
        progress.value = 80
        setTimeout(async () => {
          progress.value = 0
        }, 1000)
      }
    })
  })

  // #endif
}
function chooseMedia(i: number) {
  if (i === 0) {
    uni.chooseImage({
      count: 9,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album'], // 从相册选择
      success(res: any) {
        handleChooseSuccess(i, res)
      }
    })
    formData.videoUrl = ''
    return
  }
  if (i === 1) {
    uni.chooseVideo({
      compressed: true,
      sourceType: ['album', 'camera'],
      camera: 'back',
      maxDuration: 60,
      success(res: any) {
        handleChooseSuccess(i, res)
      }
    })
    formData.resources = []
    return
  }
  if (i === 2) {
    // #ifdef MP-WEIXIN
    wx.chooseMessageFile({
      count: 10,
      type: 'image',
      success(res: any) {
        // tempFilePath可以作为img标签的src属性显示图片
        handleChooseSuccess(i, res)
      }
    })
    // #endif
  }
}
function deleteImg(i: number) {
  formData.resources.splice(i, 1)
}
function deleteFn() {
  formData.videoUrl = ''
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
// 预览视频
function toPreview() {
  const data = {
    videoUrl: formData.videoUrl,
    previewImage: `${formData.videoUrl}?x-oss-process=video/snapshot,t_0,f_jpg,w_540,ar_auto`
  }
  uni.setStorageSync('video', JSON.stringify(data))
  uni.navigateTo({
    url: '/packageA/pages/shortVideo/index?type=preview'
  })
}
onReady(() => {
  form.value.setRules(rules)
})
onLoad((option) => {
  option?.friendCircleId && (friendCircleId.value = option?.friendCircleId)
  option?.dynamicId && (dynamicId.value = option?.dynamicId)
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
              maxlength="1000"
              height="200"
              placeholder="说点什么"
          /></u-form-item>
        </view>
      </view>
    </u-form>
    <view class="img-view">
      <view
        class="imgItem"
        v-for="(item, index) in formData.resources"
        :key="index"
      >
        <u-image
          :src="getImgFullPath(item.resourceUrl)"
          width="200"
          height="200"
          border-radius="12"
          mode="widthFix"
        ></u-image>
        <u-icon
          class="close"
          name="close-circle-fill"
          size="30"
          color="rgba(0,0,0,0.7)"
          @click="deleteImg(index)"
        ></u-icon>
      </view>
    </view>
    <view class="video-view">
      <view class="video-item loading" v-show="progress > 0">
        <view class="ring">
          <view>上传中</view>
          <view
            ><u-count-to
              ref="counter"
              :start-val="progressPrev"
              :end-val="progress"
              :autoplay="true"
              :font-size="30"
              color="#fff000"
            ></u-count-to
            >%</view
          >
          <text></text>
        </view>
      </view>
      <view class="video-item" v-if="formData.videoUrl">
        <u-image
          width="100%"
          height="360rpx"
          :src="
            getImgFullPath(
              `${formData.videoUrl}?x-oss-process=video/snapshot,t_0,f_jpg,w_540,ar_auto`
            )
          "
          @click="toPreview()"
        ></u-image>
        <view class="delete" @click="deleteFn()">
          <text class="iconfont hy-icon-delete"></text>
        </view>
      </view>
    </view>
    <view class="actions">
      <view class="act">
        <u-icon
          name="tupian"
          :custom-prefix="'custom-icon'"
          @click="chooseMedia(0)"
        ></u-icon>
        <u-icon
          name="shipin"
          :custom-prefix="'custom-icon'"
          @click="chooseMedia(1)"
        ></u-icon>
        <u-icon
          name="wenjianjia"
          :custom-prefix="'custom-icon'"
          @click="chooseMedia(2)"
        ></u-icon>
      </view>
      <u-button
        class="submitBtn"
        shape="circle"
        @click="submit()"
        type="primary"
        ripple
        >发布</u-button
      >
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 22rpx;
  background: #fff;

  .section {
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
    min-width: 200rpx;
  }
}
.img-view {
  display: flex;
  flex-wrap: wrap;
  gap: 40rpx;
  .imgItem {
    position: relative;
    .close {
      position: absolute;
      top: 10rpx;
      right: 10rpx;
      z-index: 1;
    }
  }
}
.video-view {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 30rpx;

  .video-item {
    width: calc((100% - 20rpx) / 2);
    position: relative;
    // border-radius: 8rpx;
    overflow: hidden;
    margin-bottom: 20rpx;
    min-height: 360rpx;
    &.loading {
      background-color: #262626;
    }

    .delete {
      position: absolute;
      top: 0;
      right: 0;
      padding: 6rpx;
      z-index: 1;
      background: #fa3534;
      opacity: 0.8;

      // border-bottom-left-radius: 8rpx;
      .hy-icon-delete {
        color: #fff;
      }
    }

    .action {
      position: absolute;
      left: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10;
      padding: 10rpx;
    }
  }
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 150px;
  height: 150px;
  background: transparent;
  border: 3px solid #3c3c3c;
  border-radius: 50%;
  text-align: center;
  font-family: sans-serif;
  font-size: 30rpx;
  color: #fff000;
  letter-spacing: 4px;
  text-transform: uppercase;
  text-shadow: 0 0 10px #fff000;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  &:before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    width: 100%;
    height: 100%;
    border: 3px solid transparent;
    border-top: 3px solid #fff000;
    border-right: 3px solid #fff000;
    border-radius: 50%;
    animation: animateC 2s linear infinite;
  }
  > text {
    display: block;
    position: absolute;
    top: calc(50% - 2px);
    left: 50%;
    width: 50%;
    height: 4px;
    background: transparent;
    transform-origin: left;
    animation: animate 2s linear infinite;
    &:before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #fff000;
      top: -6px;
      right: -8px;
      box-shadow: 0 0 20px #fff000;
      display: none;
    }
  }
}

@keyframes animateC {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes animate {
  0% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
</style>
