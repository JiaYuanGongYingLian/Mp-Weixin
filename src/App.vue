<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app';
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/store'

const store = useUserStore();
onLaunch(() => {
  console.log('App Launch');
})
onShow(() => {
  console.log('App Show');
  store.$patch((v) => {
    v.accessToken = uni.getStorageSync('accessToken') || '';
  })
});
onHide(() => {
  console.log('App Hide');
})
</script>
<style lang="scss">
@import 'vk-uview-ui/index.scss';
</style>
