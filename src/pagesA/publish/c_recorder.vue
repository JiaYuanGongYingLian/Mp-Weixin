<!-- eslint-disable max-len -->
<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable prefer-destructuring -->
<!-- eslint-disable no-use-before-define -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-01 16:22:48
 * @LastEditTime: 2023-08-08 17:47:48
 * @LastEditors:  Please set LastEditors
-->
<template>
  <view class="c_container">
    <view class="recLoader" v-if="recLoader">
      <image
        class="img"
        mode="heightFix"
        :src="
          recValue === recStatus[3]
            ? 'https://image.blacksilverscore.com/uploads/d28f4fce-d7df-4f16-8ca1-abee1af98c54.png'
            : 'https://image.blacksilverscore.com/uploads/018ef8b6-d331-46a5-bce9-c605027aac24.svg'
        "
      >
      </image>
      <view class="tips"> 正在录音，手指上滑取消录制 </view>
    </view>
    <!-- <view class="preview" v-if="!recLoader && recUrl">
      <u-button @click="recPlay" type="primary" size="mini">播放</u-button>
      <u-icon name="trash-fill" color="red"></u-icon>
    </view> -->
    <u-button
      type="success"
      ripple
      size="medium"
      style="width: 100%"
      @click="recOpen"
      @touchstart="touchstartFn"
      @touchmove="touchmoveFn"
      @touchend="touchendFn"
    >
      <u-icon name="mic" size="27" mr-1></u-icon>
      {{ recValue }}</u-button
    >
  </view>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import Recorder from 'recorder-core'
import 'recorder-core/src/engine/mp3'
import 'recorder-core/src/engine/mp3-engine'
import 'recorder-core/src/extensions/waveview'

const props = withDefaults(
  defineProps<{
    isBack?: boolean
  }>(),
  {
    isBack: true
  }
)
// 录音
const rec = ref()
const recBlob = ref()
const recStatus = {
  0: '点击开始录音',
  1: '按住 说话',
  2: '松开 结束',
  3: '松开手指，取消录制',
  4: '重新录制'
}
const recValue = ref(recStatus[0])
const posObj = reactive({
  posStart: 0,
  posEnd: 0,
  posMove: 0
})
const recLoader = ref(false)
const recUrl = computed(() => {
  if (recBlob.value) {
    return URL.createObjectURL(recBlob.value)
  }
  return 'http://96.ierge.cn/15/238/476996.mp3?v=0524'
})

function touchstartFn(e: {
  preventDefault: () => void
  touches: { pageY: number }[]
}) {
  e.preventDefault()
  console.log(e)
  posObj.posStart = 0
  posObj.posStart = e.touches[0].pageY
  if (recValue.value === recStatus[1]) {
    recLoader.value = true
    recValue.value = recStatus[2]
    recStart()
  }
}
function touchmoveFn(e: {
  preventDefault: () => void
  touches: { pageY: number }[]
}) {
  if (recValue.value !== recStatus[2]) return
  e.preventDefault()
  console.log(e)
  posObj.posMove = e.touches[0].pageY
  if (posObj.posStart - posObj.posMove > 200) {
    recValue.value = recStatus[3]
  }
}
function touchendFn(e: { preventDefault: () => void }) {
  e.preventDefault()
  console.log(e)
  recLoader.value = false
  if (recValue.value === recStatus[3]) {
    // cancel
    recStop()
    recBlob.value = ''
  } else {
    recStop()
  }
}
function recOpen() {
  // 创建录音对象
  rec.value = Recorder({
    type: 'mp3', // 录音格式，可以换成wav等其他格式
    sampleRate: 16000, // 录音的采样率，越大细节越丰富越细腻
    bitRate: 16, // 录音的比特率，越大音质越好
    onProcess: (
      buffers: string | any[],
      powerLevel: any,
      bufferDuration: any,
      bufferSampleRate: any,
      newBufferIdx: any,
      asyncEnd: any
    ) => {
      // 录音实时回调，大约1秒调用12次本回调
      // 可实时绘制波形，实时上传（发送）数据
    }
  })

  // 打开录音，获得权限
  rec.value.open(
    () => {
      console.log('录音已打开')
      recValue.value = recStatus[1]
    },
    (msg: string, isUserNotAllow: any) => {
      // 用户拒绝了录音权限，或者浏览器不支持录音
      console.log(`${isUserNotAllow ? 'UserNotAllow，' : ''}无法录音:${msg}`)
    }
  )
}
function recStart() {
  if (!rec.value) {
    console.error('未打开录音')
    return
  }
  rec.value.start()
  console.log('已开始录音')
}

function recStop() {
  if (!rec.value) {
    console.error('未打开录音')
    return
  }
  rec.value.stop(
    (blob: Blob | MediaSource, duration: string) => {
      // blob就是我们要的录音文件对象，可以上传，或者本地播放
      recBlob.value = blob
      // 简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
      const localUrl = (window.URL || webkitURL).createObjectURL(blob)
      console.log('录音成功', blob, localUrl, `时长:${duration}ms`)
      // upload(blob);//把blob文件上传到服务器
      rec.value.close() // 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec.value = null
    },
    (err: string) => {
      console.error(`结束录音出错：${err}`)
      rec.value.close() // 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec.value = null
    }
  )
}
function recPlay() {
  // 本地播放录音试听，可以直接用URL把blob转换成本地播放地址，用audio进行播放
  const innerAudioContext = uni.createInnerAudioContext()
  innerAudioContext.autoplay = true
  innerAudioContext.src = recUrl.value
  innerAudioContext.onPlay(() => {
    console.log('开始播放')
  })
  innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}
</script>

<style lang="scss" scoped>
.recLoader {
  background: #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 30rpx;
  margin-bottom: 30rpx;
  border-radius: 20rpx;

  .img {
    width: 100rpx;
    height: 80rpx;
  }

  .tips {
    color: #fff;
    font-weight: bold;
    text-align: center;
  }
}

.preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20rpx;
}
</style>
