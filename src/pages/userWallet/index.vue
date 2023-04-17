<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'

const info = ref()
onLoad((option) => { })
</script>
<template>
  <div class="container wallet"></div>
</template>

<style lang="scss" scoped></style>
