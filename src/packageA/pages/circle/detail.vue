<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-24 14:50:01
 * @LastEditTime: 2023-12-26 18:30:19
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onReachBottom } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { enumAll, socialApi } from '@/api'
import { getImgFullPath, dateFormat } from '@/utils/index'
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
async function getList() {
  if (status.value === 'nomore') return
  try {
    const { data } = await socialApi.dynamicList({
      pageIndex: dynamicList.pageIndex,
      pageSize: dynamicList.pageSize,
      detail: true,
      // type: 0,
      userId: userInfo.value.id,
      status: enumAll.audit_status_enum.SUCCESS
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
  getList()
}
const title = ref('素材中心')
function toEdit() {
  route({
    url: '/packageA/pages/circle/edit'
  })
}
onMounted(() => {
  getList()
})
onReachBottom(() => {
  getList()
})
</script>
<template>
  <hy-nav-bar :title="title"></hy-nav-bar>
  <view class="container">
    <view class="circle" v-for="item in dynamicList.list" :key="item.id">
      <view class="c-top">
        <view class="left"> </view>
      </view>
      <view class="c-mid"> </view>
      <view class="c-bot">
        <view class="act">
          <u-icon name="file-text-fill"></u-icon>
          <view>复制推广文案</view>
        </view>
        <view class="act">
          <u-icon name="download"></u-icon>
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
  .c-top {
    display: flex;
    justify-content: space-between;
    padding-bottom: 20rpx;
    .left {
      .name {
        font-size: 30rpx;
        font-weight: bold;
      }
      .num {
        margin-top: 30rpx;
      }
    }
    .right {
      margin: 0;
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
      padding: 10rpx;
      border-radius: 10rpx;
      background: #ccc;
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
