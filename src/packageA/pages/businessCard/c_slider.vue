<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-08-30 15:08:59
 * @LastEditTime: 2023-09-01 18:07:01
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable no-empty -->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { socialApi } from '@/api'
import { getImgFullPath, checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const props = withDefaults(
  defineProps<{
    info?: object
    isMySelf?: boolean
  }>(),
  {
    info() {
      return {}
    }
  }
)
async function dynamicList() {
  try {
    // const res1 = await socialApi.dynamicList({
    //   noPaging: true,
    //   type: 3,
    //   userId: userInfo.value.id,
    //   detail: true
    // })
    // rankList.list = [...res1.data]
  } catch {}
}
function toView(index: number) {
  uni.setStorageSync('videoList', JSON.stringify(videoList.list))
  uni.navigateTo({
    url: `/packageA/pages/shortVideo/index?type=viewSingleUser&index=${index}`
  })
}
function toGroup() {
  uni.navigateTo({
    url: `/packageA/pages/chatGroup/index?username=${
      props.info.name
    }&friendCircleId=${props.info.friendCircleId || ''}&userDetailId=${
      props.info.id
    }`
  })
}
onMounted(() => {})
</script>
<template>
  <view class="c_container">
    <view
      v-if="props.isMySelf && props.info.fansCount > 100"
      class="slider self"
    >
      <view class="item" @click="toGroup">
        <view class="icon">
          <u-icon
            name="group"
            :custom-prefix="'custom-icon'"
            size="36"
          ></u-icon>
        </view>
        <view class="con">
          <view class="tit">我的粉丝群</view>
        </view>
      </view>
    </view>
    <view class="slider" v-else>
      <view class="item" @click="toGroup" v-if="props.info.friendCircleId">
        <view class="icon">
          <u-icon
            name="group"
            :custom-prefix="'custom-icon'"
            size="36"
          ></u-icon>
        </view>
        <view class="con">
          <view class="tit">粉丝群</view>
          <view class="val">1个群聊</view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.slider {
  width: 100%;
  overflow-x: scroll;
  display: flex;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30rpx;
    margin-top: 10rpx;
    .icon {
      width: 80rpx;
      height: 80rpx;
      background: #f6f6f6;
      border-radius: 6rpx;
      margin-right: 16rpx;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .con {
      .tit {
        font-size: 28rpx;
        margin-bottom: 8rpx;
      }
      .val {
        color: #666;
        font-size: 24rpx;
      }
    }
  }
  &.self {
    .item {
      flex-direction: column;
      .icon {
        border-radius: 50%;
        margin-bottom: 16rpx;
      }
      .con {
        .tit {
          font-size: 24rpx;
          color: #666;
        }
      }
    }
  }
}
</style>
