<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-12-04 17:27:08
 * @LastEditTime: 2023-12-04 18:10:38
 * @LastEditors:  Please set LastEditors
-->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-12-04 15:57:32
 * @LastEditTime: 2023-12-04 17:10:26
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi, enumAll } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const form = ref()
onLoad((option) => {})
</script>
<template>
  <view class="container"> </view>
</template>

<style lang="scss" scoped></style>
