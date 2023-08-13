<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable max-len -->
<!-- eslint-disable no-console -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!-- eslint-disable prefer-destructuring -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-01 16:22:48
 * @LastEditTime: 2023-08-13 21:03:11
 * @LastEditors:  Please set LastEditors
-->
<template>
  <view class="c_container">
    <view class="recLoader" v-if="recLoader">
      <image
        class="img"
        mode="heightFix"
        :src="
          recValue === recStatus.toStart
            ? 'https://image.blacksilverscore.com/uploads/d28f4fce-d7df-4f16-8ca1-abee1af98c54.png'
            : 'https://image.blacksilverscore.com/uploads/018ef8b6-d331-46a5-bce9-c605027aac24.svg'
        "
      >
      </image>
      <view class="tips"> 正在录音，点击按钮结束录制 </view>
    </view>
    <view class="weixinAudio" v-if="!recLoader && recRet.url" @click="recPlay">
      <AUDIO :src="recRet.url" width="1" height="1" preload></AUDIO>
      <view class="audio_area">
        <view class="audio_play_area">
          <i class="icon" :class="{ playing: playStatus }"></i>
        </view>
        <text class="time">{{ recRet.duration / 1000 }}"</text>
      </view>
    </view>
    <u-button
      type="success"
      ripple
      size="medium"
      style="width: 100%"
      @click="recorderFn"
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
import { webUploadVideo } from '@/common/ali-oss'
import { getImgFullPath } from '@/utils'
import { isWeChat } from '@/utils/common'

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
const recRet = reactive<{ blob: any; url: any; duration: number }>({
  blob: null,
  url: '',
  duration: 0
})
const enum recStatus {
  toStart = '点击开始录音',
  toEnd = '正在录音，点击结束',
  redo = '重新录制'
}
const recValue = ref(recStatus.toStart)
const recLoader = ref(false)
function recStart() {
  rec.value.start()
  recLoader.value = true
  recValue.value = recStatus.toEnd
}

function recStop() {
  if (!rec.value) {
    console.error('未打开录音')
    return
  }
  rec.value.stop(
    (blob: Blob | MediaSource, duration: string) => {
      recRet.blob = blob
      const localUrl = (window.URL || webkitURL).createObjectURL(blob) // 简单利用URL生成本地文件地址，此地址只能本地使用，比如赋值给audio.src进行播放，赋值给a.href然后a.click()进行下载（a需提供download="xxx.mp3"属性）
      recRet.url = localUrl
      recRet.duration = duration
      console.log('录音成功', blob, localUrl, `时长:${duration}ms`)
      // upload(blob);//把blob文件上传到服务器
      const fileOfBlob = new File([blob], '.mp3')
      webUploadVideo({
        file: fileOfBlob,
        fileType: 'mp3',
        onSuccess: async (ret: { name: string }) => {
          recRet.url = getImgFullPath(ret.name)
          console.log('上传成功', recRet.url, 10000005)
        },
        onError() {
          uni.showToast({
            title: '上传失败'
          })
        }
      })
      rec.value.close() // 关闭录音，释放录音资源，当然可以不释放，后面可以连续调用start
      rec.value = null
    },
    (err: string) => {
      console.error(`结束录音出错：${err}`)
      rec.value.close()
      rec.value = null
    }
  )
  recValue.value = recStatus.redo
  recLoader.value = false
}
const innerAudioContext = ref()
const playStatus = ref(false)
function recPlay() {
  if (innerAudioContext.value && playStatus.value) {
    innerAudioContext.value.stop()
    playStatus.value = false
    return
  }
  // 本地播放录音试听，可以直接用URL把blob转换成本地播放地址，用audio进行播放
  innerAudioContext.value = uni.createInnerAudioContext()
  innerAudioContext.value.autoplay = true
  innerAudioContext.value.src = recRet.url
  innerAudioContext.value.onPlay(() => {
    playStatus.value = true
  })
  innerAudioContext.value.onStop(() => {
    playStatus.value = false
  })
  innerAudioContext.value.onEnded(() => {
    playStatus.value = false
  })
  innerAudioContext.value.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
  })
}
function recOpen() {
  try {
    console.log('录音1111')
    // 创建录音对象
    rec.value = Recorder({
      type: 'mp3', // 录音格式，可以换成wav等其他格式
      sampleRate: 16000, // 录音的采样率，越大细节越丰富越细腻
      bitRate: 16 // 录音的比特率，越大音质越好
    })
    console.log('222')
    // 打开录音，获得权限
    rec.value.open(
      () => {
        console.log('录音已打开')
        recStart()
      },
      (msg: string, isUserNotAllow: any) => {
        // 用户拒绝了录音权限，或者浏览器不支持录音
        console.log(`${isUserNotAllow ? 'UserNotAllow，' : ''}无法录音:${msg}`)
      }
    )
  } catch (err) {
    console.log(err, 171)
  }
}
function recorderFn() {
  console.log('录音', 123)
  if (isWeChat()) {
    uni.showToast({
      title: '请在APP进行录制',
      icon: 'none'
    })
    return
  }
  if (recValue.value === recStatus.toStart) {
    console.log('录音', 456)
    recOpen()
  } else if (recValue.value === recStatus.toEnd) {
    recStop()
  } else if (recValue.value === recStatus.redo) {
    recOpen()
  }
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

.weixinAudio {
  margin-bottom: 30rpx;
}

.audio_area {
  display: flex;
  width: 100%;
  align-items: center;
  border: 1px solid #ebebeb;
  background-color: #fcfcfc;
  border-radius: 6rpx;
  padding: 10rpx 20rpx;
}

.audio_play_area {
  float: left;
  font-size: 0;
  width: 18px;
  .icon {
    background: transparent
      url('https://image.blacksilverscore.com/uploads/09f17793-27e7-4bd0-b640-bd6f62a76755.png')
      no-repeat 0 0;
    width: 18px;
    height: 25px;
    vertical-align: middle;
    display: inline-block;
    -webkit-background-size: 54px 25px;
    background-size: 54px 25px;
    background-position: -36px center;
    &.playing {
      background-position: 0px center;
      animation: audio_playing 1s infinite;
    }
  }
}
.time {
  font-size: 28rpx;
  margin-left: 20rpx;
}

@keyframes audio_playing {
  30% {
    background-position: 0px center;
  }
  31% {
    background-position: -18px center;
  }
  61% {
    background-position: -18px center;
  }
  61.5% {
    background-position: -36px center;
  }
  100% {
    background-position: -36px center;
  }
}
</style>
