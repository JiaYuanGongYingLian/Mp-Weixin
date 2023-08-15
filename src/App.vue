<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { Md5 } from 'ts-md5'
import { useUserStore, useChatStore } from '@/store'

const storeUser = useUserStore()
const chatStore = useChatStore()
const { hasLogin, isJimInit } = storeToRefs(chatStore)
const { userInfo } = storeToRefs(storeUser)
watch(isJimInit, (n) => {
  if (n) {
    const data = uni.getStorageSync('jimLoginInfo')
    if (data && data?.username === `hy_${userInfo.value.id}`) {
      chatStore.jimLogin(data)
    } else {
      const loginInfo = {
        username: `hy_${userInfo.value.id}`,
        password: Md5.hashStr(`hy_${userInfo.value.id}_Ji`),
        nickname: userInfo.value.nickname,
      }
      chatStore.jimLogin(loginInfo)
    }
  }
})
onLaunch(() => {
  if (!hasLogin.value) {
    chatStore.jimInit()
  }
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
  storeUser.$patch((v) => {
    v.accessToken = uni.getStorageSync('accessToken') || ''
    v.userInfo = uni.getStorageSync('userInfo') || null
  })
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style lang="scss">
@import 'vk-uview-ui/index.scss';
</style>
