<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!--
 * @Description: 消息长按弹出操作条
 * @Author: Kerwin
 * @Date: 2023-11-23 14:36:33
 * @LastEditTime: 2023-12-01 16:41:40
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore, useRyStore } from '@/store'

const userStore = useUserStore()
const ryStore = useRyStore()
const { hasLogin } = storeToRefs(userStore)
const props = withDefaults(
  defineProps<{
    chatType?: number
    msgPupData: object
  }>(),
  {
    chatType: 0,
    msgPupData: () => {
      return {}
    }
  }
)
const emit = defineEmits(['reference', 'delete'])

const isSingle = computed(() => {
  return props.chatType === 0
})
const popStyle = ref('')
const showPup = ref(false)
const showClass = ref(false)
const winSize = reactive({
  witdh: 0,
  height: 0
})
const navList = ref([
  {
    name: '复制',
    icon: 'fuzhi_o',
    show: false,
    fn: (data: { content: any }) => {
      const { content } = data
      uni.setClipboardData({
        data: content.content,
        success() {}
      })
    }
  },
  {
    name: '转发',
    icon: 'zhuanfa',
    show: true,
    fn: () => {}
  },
  {
    name: '收藏',
    icon: 'shoucang',
    show: false,
    fn: () => {}
  },
  {
    name: '撤回',
    icon: 'chehui',
    show: false,
    fn: (data: { targetId: any; messageUId: any; sentTime: any }) => {
      const { targetId, messageUId, sentTime } = data
      const params = {
        targetId,
        messageUId,
        sentTime,
        group: isSingle
      }
      ryStore.recallMessage(params)
    }
  },
  {
    name: '引用',
    icon: 'yinyong',
    show: true,
    fn: (data: any) => {
      emit('reference', data)
    }
  },
  {
    name: '删除',
    icon: 'shanchu',
    show: true,
    fn: (data: any) => {
      emit('delete', data)
    }
  }
])

function showPop() {
  let [touches, style] = [props.msgPupData.touches[0], '']
  /* 因 非H5端不兼容 style 属性绑定 Object ，所以拼接字符 */
  if (touches.clientY > winSize.height / 2) {
    style = `bottom:${winSize.height - touches.clientY}px;`
  } else {
    style = `top:${touches.clientY}px;`
  }
  if (touches.clientX > winSize.witdh / 2) {
    style += 'right:32rpx'
  } else {
    style += 'left:32rpx'
  }
  popStyle.value = style
  const timestamp = Date.parse(new Date())
  const start = props.msgPupData.message.sentTime
  const end = timestamp
  const utc = end - start
  const m = Number((utc / (60 * 1000)).toFixed(2))
  navList.value[3].show = m < 3
  navList.value[0].show = props.msgPupData.message.messageType === "RC:TxtMsg"

  // 显示弹窗
  showPup.value = true
  showClass.value = true
}
defineExpose({
  showPop
})
function handleClick(item: { fn: () => void }) {
  item.fn(props.msgPupData.message)
}
/* 获取窗口尺寸 */
function getWindowSize() {
  uni.getSystemInfo({
    success: (res) => {
      winSize.witdh = res.windowWidth
      winSize.height = res.windowHeight
    }
  })
}
/* 隐藏弹窗 */
function hidePop() {
  showClass.value = false
  showPup.value = false
}
onLoad((option) => {
  getWindowSize()
})
</script>
<template>
  <view class="c_container">
    <view class="shade" v-show="showPup" @click="hidePop">
      <view class="pop" :style="popStyle" :class="{ show: showClass }">
        <template v-for="(item, index) in navList" :key="index">
          <view class="item" v-if="item.show" @click="handleClick(item)">
            <text :class="['iconfont', `hy-icon-${item.icon}`]" />
            <text class="name">{{ item.name }}</text>
          </view>
        </template>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.c_container {
  /* 遮罩 */
  .shade {
    position: fixed;
    z-index: 100;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    -webkit-touch-callout: none;

    .pop {
      position: fixed;
      z-index: 101;
      color: #333;
      background: rgb(76, 76, 76);
      border-radius: 12rpx;
      padding: 24rpx;
      transition: transform 0.15s ease-in-out 0s;
      user-select: none;
      -webkit-touch-callout: none;
      transform: scale(0, 0);
      display: flex;
      align-items: center;
      gap: 50rpx;
      &.show {
        transform: scale(1, 1);
      }
      .item {
        color: #fff;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 20%;
        .iconfont {
          font-weight: 400;
          font-size: 36rpx;
        }
        .name {
          margin-top: 8rpx;
          font-size: 22rpx;
        }
      }
    }
  }
}
</style>
