<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!--
 * @Description: 分享弹窗
 * @Author: Kerwin
 * @Date: 2023-09-20 11:50:40
 * @LastEditTime: 2023-12-18 01:51:49
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { route } from '@/utils/common'
import {
  updateAppMessageShareData,
  updateTimelineShareData
} from '@/common/wechat-share'

const props = withDefaults(
  defineProps<{
    shareData?: object
    useInnerGroup?: boolean
  }>(),
  {
    shareData: () => {
      return {
        title: '',
        desc: '',
        link: '',
        imgUrl: ''
      }
    },
    useInnerGroup: true
  }
)

const options = ref([
  {
    text: '好友',
    icon: 'weixin',
    openType: 'share',
    show: true,
    shareFn: updateAppMessageShareData
  },
  {
    text: '朋友圈',
    icon: 'pengyouquan',
    openType: 'share',
    show: true,
    shareFn: updateTimelineShareData
  },
  {
    text: '内部群',
    icon: 'qunliao',
    openType: 'share',
    show: props.useInnerGroup,
    shareFn: innerGroupShareData
  }
])
function innerGroupShareData() {
  console.log('转发内部群==>', props.shareData)
  // eslint-disable-next-line vue/no-mutating-props
  props.shareData.path = encodeURIComponent(props.shareData.path)
  route({
    url: '/packageB/pages/chatGroupSelector/index',
    params: {
      shareData: JSON.stringify(props.shareData)
    }
  })
}
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
watch(props.shareData, (data) => {
  wx.ready(() => {
    options.value[0].shareFn(data)
    options.value[1].shareFn(data)
  })
})
</script>

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
          <template v-for="(item, index) in options" :key="index">
            <view
              class="uni-share-content-box"
              @click="handleShare(index)"
              v-if="item.show"
            >
              <button :open-type="item.openType" class="btn"></button>
              <view class="uni-share-content-image">
                <u-icon
                  :name="item.icon"
                  :custom-prefix="'custom-icon'"
                  class="content-image"
                  size="60"
                />
              </view>
              <text class="uni-share-content-text">{{ item.text }}</text>
            </view>
          </template>
        </view>
      </view>
    </hy-transition>
  </view>
</template>

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
      position: relative;

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
        overflow: hidden;
        border-radius: 10rpx;

        .content-image {
          display: flex;
          justify-content: center;
          align-items: center;
          color: $text-color-primary;
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
      .btn {
        background-color: transparent;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        &::after {
          border: none;
        }
      }
    }
  }
}
</style>
