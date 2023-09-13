<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore, useChatStore } from '@/store'
import { onMounted } from 'vue';

const userStore = useUserStore()
const chatStore = useChatStore()
const { chatHasLogin } = storeToRefs(chatStore)
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
})
onShow(async () => {
  console.log('App Show')
  if (!accessToken.value) {
    userStore.$patch((v) => {
      v.accessToken = uni.getStorageSync('accessToken') || ''
      v.userInfo = uni.getStorageSync('userInfo') || null
    })
  }
  console.log('chatHasLogin', chatHasLogin.value)
  if (!chatHasLogin.value) {
    await chatStore.jimInit()
    await chatStore.jimLoginFn()
  }
})
onHide(() => {
  console.log('App Hide')
})
// onMounted(()=>{

// })
</script>
<style lang="scss">
@import 'vk-uview-ui/index.scss';
</style>
