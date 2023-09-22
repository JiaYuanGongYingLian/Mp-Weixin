<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!--
 * @Description: 分享弹窗
 * @Author: Kerwin
 * @Date: 2023-09-20 11:50:40
 * @LastEditTime: 2023-09-22 16:52:35
 * @LastEditors:  Please set LastEditors
-->
<template>
  <view>
    <hy-transition
      :mode-class="['fade']"
      :styles="maskClass"
      :duration="duration"
      :show="show"
      @click="closePop"
    />
    <hy-transition
      :mode-class="['slide-bottom']"
      :styles="transClass"
      :duration="duration"
      :show="show"
      @click="closePop"
    >
      <view class="uni-share">
        <view class="uni-share-content">
          <view
            v-for="(item, index) in options"
            :key="index"
            class="uni-share-content-box"
            @click="handleShare(index)"
          >
            <view class="uni-share-content-image">
              <!-- <u-icon
                :name="item.icon"
                :custom-prefix="'custom-icon'"
                class="content-image"
              /> -->
              <svg class="hy-icon content-image" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
            </view>
            <text class="uni-share-content-text">{{ item.text }}</text>
          </view>
        </view>
      </view>
    </hy-transition>
  </view>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { onPageScroll } from '@dcloudio/uni-app'
import { launchClientApp } from '@/utils/common'
import {
  updateAppMessageShareData,
  updateTimelineShareData
} from '@/common/wechat-share'

const props = withDefaults(
  defineProps<{
    shareData?: object
  }>(),
  {
    shareData: () => {
      return {
        title: '',
        desc: '',
        link: '',
        imgUrl: ''
      }
    }
  }
)

const options = ref([
  {
    text: '好友',
    icon: '#hy-icon-weixin',
    shareFn: updateAppMessageShareData
  },
  {
    text: '朋友圈',
    icon: '#hy-icon-pengyouquan',
    shareFn: updateTimelineShareData
  }
])
const duration = ref(300)
const maskClass = reactive({
  position: 'fixed',
  bottom: 0,
  top: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  zIndex: 100
})
const transClass = reactive({
  position: 'fixed',
  left: 0,
  right: 0,
  zIndex: 101,
  bottom: 0
})
const show = ref(false)
const showPop = () => {
  show.value = true
}
const closePop = () => {
  show.value = false
}

function handleShare(i: number) {
  options.value[i].shareFn(props.shareData)
}
defineExpose({
  showPop,
  closePop
})
</script>

<style lang="scss" scoped>
.uni-share {
  width: 690rpx;
  margin: 30rpx;
  border-radius: 30rpx;
  /* #ifndef APP-NVUE */
  display: flex;
  flex-direction: column;
  /* #endif */
  background-color: #fff;

  .uni-share-content {
    /* #ifndef APP-NVUE */
    display: flex;
    /* #endif */
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    overflow-x: scroll;
    padding: 15px 50rpx;

    .uni-share-content-box {
      /* #ifndef APP-NVUE */
      display: flex;
      /* #endif */
      flex-direction: column;
      align-items: center;
      // width: 25%;
      // justify-content: space-between;
      margin-right: 60rpx;

      &:nth-last-child(1) {
        margin-right: 0;
      }

      .uni-share-content-image {
        /* #ifndef APP-NVUE */
        display: flex;
        /* #endif */
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 90rpx;
        height: 90rpx;
        overflow: hidden;
        border-radius: 10rpx;

        .content-image {
          width: 80rpx;
          height: 80rpx;
        }
      }

      // &:nth-last-child(1) {
      //   .uni-share-content-image .content-image {
      //     width: 50rpx !important;
      //     height: 50rpx !important;
      //   }
      // }

      .uni-share-content-text {
        font-size: 26rpx;
        color: #333;
        padding-top: 5px;
        padding-bottom: 10px;
      }
    }
  }
}
</style>
