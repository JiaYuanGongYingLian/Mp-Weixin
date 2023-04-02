<template>
  <web-view v-if="url" :src="url"></web-view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'

const url = ref()
onLoad((option) => {
  url.value = option?.url
})
</script>

<style scoped lang="scss"></style>
