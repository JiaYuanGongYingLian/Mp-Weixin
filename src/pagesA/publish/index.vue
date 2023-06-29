<!-- eslint-disable no-empty -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-console -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-28 17:45:12
 * @LastEditTime: 2023-06-29 17:21:23
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { json } from 'stream/consumers'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import { upload, webUploadVideo } from '@/common/ali-oss'

const store = useUserStore()
const { hasLogin, userInfo } = storeToRefs(store)
const list = [
  {
    name: '短视频'
  },
  {
    name: '完善传记'
  },
  {
    name: '完善展览馆'
  }
]
const subList = [
  {
    name: '草稿',
    num: 10
  },
  {
    name: '已发布'
  }
]
const subCurrent = ref(0)
const videoList1 = reactive({
  list: [
    {
      nickName: 'kerwin1',
      avatar:
        'https://oss.wyh139.com/Uploads/null/20230518/1684380540000557.png',
      previewImage:
        'https://oss.wyh139.com/Uploads/Merchants/20230624/1687553245000297.png',
      title: '玖玖乐房车俱乐部欢迎您，新时代的房车轻奢生活，带你体验美好生活',
      share: 661,
      videoUrl:
        'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/afeba9213270835009088706262/v.f30.mp4',
      like: 900
    },
    {
      nickName: 'kerwin1',
      avatar:
        'https://oss.wyh139.com/Uploads/null/20230518/1684380540000557.png',
      previewImage:
        'https://oss.wyh139.com/Uploads/Merchants/20230624/1687553245000297.png',
      title: '玖玖乐房车俱乐部欢迎您，新时代的房车轻奢生活，带你体验美好生活',
      share: 661,
      videoUrl:
        'https://1400340355.vod2.myqcloud.com/d64cd6c3vodtranscq1400340355/afeba9213270835009088706262/v.f30.mp4',
      like: 900
    }
  ],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const videoList2 = reactive({
  list: [],
  loading: true,
  finished: false,
  pageIndex: 1,
  pageSize: 20
})
const progress = ref(0)
const counter = ref()
const currentTab = ref(0)
function change(index: any) {
  currentTab.value = index
}
const videoUrl = ref('')
function chooseVideo() {
  uni.chooseVideo({
    compressed: true,
    sourceType: ['album', 'camera'],
    camera: 'back',
    maxDuration: 60,
    success: (res) => {
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
          progress.value = p
          console.log(progress.value)
          counter.value.start()
        },
        uploadPath: ''
      })
    }
  })
}
function toPreview(item: any) {
  localStorage.setItem('video', JSON.stringify(item))
  uni.navigateTo({
    url: '/pagesA/shortVideo/index?type=preview'
  })
}
async function dynamicList() {
  console.log(userInfo.value)
  try {
    const res1 = await socialApi.dynamicList({
      noPaging: true,
      type: 3,
      userId: userInfo.value.id,
      detail: true
    })
    videoList1.list = res1.data
    const res2 = await socialApi.dynamicList({
      noPaging: true,
      type: 3,
      userId: userInfo.value.id,
      detail: true
    })
    videoList2.list = res1.data
  } catch {}
}
async function dynamicAdd() {
  await socialApi.dynamicAdd({
    content: '',
    count: 0,
    type: 3,
    videoUrl: videoUrl.value,
    remark: '',
    userId: userInfo.value.id,
    previewImage: `${videoUrl.value}?x-oss-process=video/snapshot,t_0,f_jpg,w_800,h_600,m_fast`
  })
  dynamicList()
}
function toTweetEdit(item) {
  localStorage.setItem('video', JSON.stringify(item))
  uni.navigateTo({
    url: '/pagesA/tweetEdit/index'
  })
}
onLoad((option) => {
  dynamicList()
})
</script>
<template>
  <view class="container">
    <hy-nav-bar
      title="发布中心"
      :background="{ background: '#fff' }"
    ></hy-nav-bar>
    <u-tabs
      :list="list"
      sticky
      :style="{ top: 0, zIndex: 2 }"
      v-model="currentTab"
      @change="change"
    ></u-tabs>
    <view class="upload-view" @click="chooseVideo">
      <text class="iconfont hy-icon-yunshangchuan"></text>
      <text class="text">点击上传 / 拍摄视频</text>
    </view>
    <view class="section">
      <u-subsection :list="subList" v-model="subCurrent"></u-subsection>
      <view class="video-view" v-if="subCurrent === 0">
        <view class="video-item loading" v-show="progress > 0">
          <view class="ring">
            <view>上传中</view>
            <view
              ><u-count-to
                ref="counter"
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
        <view class="video-item" v-for="item in videoList1.list" :key="item.id">
          <u-image
            width="100%"
            height="360rpx"
            :src="getImgFullPath(item.previewImage)"
            @click="toPreview(item)"
          ></u-image>
          <view class="delete">
            <text class="iconfont hy-icon-delete"></text>
          </view>
          <view class="action">
            <u-button
              size="mini"
              type="success"
              rapple
              @click="toTweetEdit(item)"
              >修改</u-button
            >
            <u-button
              size="mini"
              type="success"
              rapple
              @click="toTweetEdit(item)"
              >发布</u-button
            >
          </view>
        </view>
      </view>
      <view class="video-view" v-else>
        <view class="video-item" v-for="item in videoList2.list" :key="item.id">
          <u-image
            width="100%"
            height="360rpx"
            :src="getImgFullPath(item.previewImage)"
            @click="toPreview(item)"
          ></u-image>
          <view class="delete">
            <text class="iconfont hy-icon-delete"></text>
          </view>
          <view class="action">
            <u-button
              size="mini"
              type="success"
              rapple
              @click="toTweetEdit(item)"
              >修改</u-button
            >
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.upload-view {
  background: #fff;
  padding: 30rpx;
  display: flex;
  align-items: center;
  margin-top: 20rpx;

  .hy-icon-yunshangchuan {
    font-size: 60rpx;
    color: rgb(41, 121, 255);
    margin-right: 20rpx;
  }

  .text {
    font-weight: 600;
  }
}

.section {
  background: #fff;
  padding: 30rpx;
  margin-top: 20rpx;
  flex: 1;
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
