<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-24 14:50:01
 * @LastEditTime: 2023-12-31 22:00:34
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import {
  onReachBottom,
  onLoad,
  onShow,
  onPullDownRefresh
} from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { enumAll, socialApi } from '@/api'
import { getImgFullPath, dateFormat, previewImage } from '@/utils/index'
import { useUserStore } from '@/store'
import { route } from '@/utils/common'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const dynamicList = reactive({
  list: [],
  loading: true,
  pageIndex: 1,
  pageSize: 20
})
const status = ref('loadmore')
enum circleIds {
  'sucai' = 11
}
const friendCircleId = ref(circleIds.sucai)
async function getList() {
  if (status.value === 'nomore') return
  try {
    const { data } = await socialApi
      .circleDynamicList({
        pageIndex: dynamicList.pageIndex,
        pageSize: dynamicList.pageSize,
        detail: true,
        friendCircleId: friendCircleId.value,
        // status: enumAll.audit_status_enum.SUCCESS
        sortJson: '[{"column":"createTime","direction":"DESC"}]'
      })
      .finally(() => {
        uni.stopPullDownRefresh()
      })
    const { records, current, pages } = data
    dynamicList.list.push(...records)
    if (current < pages && pages !== 0) {
      dynamicList.pageIndex += 1
    } else {
      status.value = 'nomore'
    }
  } catch {}
}
function reload() {
  dynamicList.list = []
  dynamicList.pageIndex = 1
  status.value = 'loading'
  getList()
}
const title = ref('素材中心')
function toEdit() {
  route({
    url: '/packageA/pages/circle/edit',
    params: {
      friendCircleId: friendCircleId.value
    }
  })
}
function deleteFn(item: { id: any }, index: number) {
  uni.showModal({
    title: '提示',
    content: '确认删除？',
    showCancel: true,
    success: async ({ confirm, cancel }) => {
      if (confirm) {
        await socialApi.circleDynamicDelete({
          friendCircleId: friendCircleId.value,
          id: item.id
        })
        dynamicList.list.splice(index, 1)
      }
    }
  })
}
function previewImageFn(arr: { resourceUrl: string }[], i: number) {
  const pics = arr?.map((item: { resourceUrl: string }) =>
    getImgFullPath(item.resourceUrl)
  )
  previewImage(pics, i)
}
function copyContent(data: { content: any }) {
  const { content } = data
  uni.setClipboardData({
    data: content,
    success() {}
  })
}
function download(data: { resources: any }) {
  const { resources } = data
  resources.forEach((e: { resourceUrl: string }) => {
    uni.downloadFile({
      url: getImgFullPath(e.resourceUrl),
      success(res) {
        uni.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success() {
            uni.showToast({
              title: '保存成功',
              icon: 'success'
            })
          }
        })
      }
    })
  })
}
onLoad((option) => {
  option?.friendCircleId && (friendCircleId.value = option?.friendCircleId)
})
onShow(() => {
  getList()
})
onReachBottom(() => {
  getList()
})
onPullDownRefresh(() => {
  setTimeout(async () => {
    reload()
  }, 1000)
})
</script>
<template>
  <hy-nav-bar :title="title"></hy-nav-bar>
  <view class="container">
    <view
      class="circle"
      v-for="(item, index) in dynamicList.list"
      :key="item.id"
    >
      <view class="delete" @click="deleteFn(item, index)">
        <text class="iconfont hy-icon-delete"></text>
      </view>
      <view class="c-top">
        <u-image
          class="avatar"
          shape="circle"
          width="90rpx"
          height="90rpx"
          :src="
            getImgFullPath(item?.user.avatar || configStore.cardDefualtAvatar)
          "
        ></u-image>
        <view class="con">
          <view class="top">
            <view class="name">{{ item?.user.nickname }}</view>
          </view>
          <view class="date">{{
            dateFormat(new Date(item?.createTime * 1000), 'yyyy-MM-dd hh:mm')
          }}</view>
        </view>
      </view>
      <view class="c-mid">
        <view class="content-view">
          <pre class="pre">{{ item.content }}</pre>
        </view>
        <view class="img-view">
          <view
            class="imgItem"
            v-for="(e, index) in item?.resources"
            :key="index"
            @click="previewImageFn(item?.resources, index)"
          >
            <u-image
              :src="getImgFullPath(e.resourceUrl)"
              :width="item?.resources?.length > 1 ? 200 : 300"
              border-radius="4"
              mode="widthFix"
            ></u-image>
          </view>
        </view>
      </view>
      <view class="c-bot">
        <view class="act" @click="copyContent(item)">
          <u-icon name="file-text-fill" :size="30"></u-icon>
          <view>复制文案</view>
        </view>
        <view class="act" @click="download(item)">
          <u-icon name="download" :size="30"></u-icon>
          <view>下载素材</view>
        </view>
      </view>
    </view>
    <u-loadmore v-if="dynamicList.list.length > 3" :status="status" />
    <view class="edit" @click="toEdit">
      <u-icon name="edit-pen-fill" size="40"></u-icon>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.container {
  padding: 20rpx;
}

.circle {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 30rpx;
  position: relative;
  overflow: hidden;
  .delete {
    position: absolute;
    top: 0;
    right: 0;
    padding: 6rpx;
    z-index: 1;
    // background: #fa3534;
    opacity: 0.8;

    // border-bottom-left-radius: 8rpx;
    .hy-icon-delete {
      color: #333;
    }
  }

  .c-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20rpx;
    display: flex;
    align-items: center;
    padding-top: 20rpx;

    .avatar {
      flex-shrink: 0;
    }

    .con {
      margin-left: 20rpx;
      flex: 1;

      .top {
        display: flex;
        justify-content: space-between;
        .name {
          font-size: 34rpx;
          font-weight: bold;
        }
      }
      .date {
        font-size: 24rpx;
        color: #666;
      }

      .desc {
        margin-top: 10rpx;
        @include ellipsis(2);
      }
    }
  }
  .c-mid {
    padding: 0 20rpx 20rpx 20rpx;
    .content-view {
      font-size: 32rpx;
      .pre {
        font-family: 'Microsoft YaHei';
        white-space: pre-wrap;
      }
    }
    .img-view {
      display: flex;
      flex-wrap: wrap;
      gap: 5rpx;
      padding-top: 20rpx;
    }
  }
  .c-bot {
    display: flex;
    align-items: center;
    padding-top: 20rpx;
    border-top: 2rpx solid #f6f6f6;
    justify-content: space-between;

    .act {
      display: flex;
      align-items: center;
      padding: 10rpx 40rpx;
      border-radius: 50rpx;
      background: #e3f2ff;
      color: #408fff;
      font-weight: bold;
      font-size: 28rpx;
    }

    .avatar {
      flex-shrink: 0;
    }

    .con {
      margin-left: 20rpx;
      flex: 1;

      .top {
        display: flex;
        justify-content: space-between;

        .date {
          font-size: 24rpx;
          color: #ccc;
        }
      }

      .desc {
        margin-top: 10rpx;
        @include ellipsis(2);
      }
    }
  }
}

.edit {
  position: fixed;
  bottom: 300rpx;
  right: 40rpx;
  width: 82rpx;
  height: 82rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 10rpx 2rpx rgba(0, 0, 0, 0.1);
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
