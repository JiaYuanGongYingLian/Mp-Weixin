<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-console -->
<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const storeUser = useUserStore()
onLaunch(() => {
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
