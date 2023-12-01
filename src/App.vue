<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useUserStore, useRyStore } from '@/store'
import RongIMLib from '@/common/rongYun/im_init'

const userStore = useUserStore()
const ryStore = useRyStore()
const chatHasLogin = ref(false)
const { accessToken } = storeToRefs(userStore)

onLaunch(() => {
  console.log('App Launch')
  uni.onNetworkStatusChange((res) => {
    const { isConnected, networkType } = res
    if (['2g', '3g', '4g', '5g'].includes(networkType)) {
      uni.showToast({
        icon: 'none',
        title: '当前网络为移动数据流量，请注意流量使用情况'
      })
    }
    if (!isConnected) {
      chatHasLogin.value = false
    }
  })
  const { Events } = RongIMLib
  RongIMLib.addEventListener(Events.CONNECTING, () => {
    console.log('正在链接服务器')
  })
  RongIMLib.addEventListener(Events.CONNECTED, () => {
    console.log('已经链接到服务器')
  })
  RongIMLib.addEventListener(Events.MESSAGES, (evt) => {
    const { messages } = evt
    if (messages && messages.length > 0) {
      messages.forEach((message) => {
        ryStore.setMessage(message, 'add')
      })
    }
  })
})
onShow(async () => {
  console.log('App Show')
  if (!accessToken.value) {
    userStore.$patch((v: { accessToken: any }) => {
      v.accessToken = uni.getStorageSync('accessToken') || ''
    })
    const userInfo = uni.getStorageSync('userInfo') || null
    userInfo && userStore.syncSetUserInfo(userInfo)
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'vk-uview-ui/index.scss';
</style>
