<template>
  <view class="rf-search-bar">
    <view
      class="header"
      :style="{ width: width + 'px', marginTop: inputTop + 'px' }"
    >
      <!-- 搜索框 -->
      <view class="input-box" @tap="toSearch">
        <input disabled />
        <view class="wrapper">
          <text class="iconfont iconsousuo2"></text>
          <text class="keyword">{{ placeholder }}</text>
        </view>
      </view>
      <!-- 扫一扫 -->
      <view class="addr">
        <text class="iconfont" @tap.stop="link" :class="[icon]"></text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width: number
    inputTop: number
    placeholder: string
  }>(),
  {
    width: 200,
    inputTop: 0,
    placeholder: '请输入关键字'
  }
)
// 扫一扫
const link = () => {
  const _this = this
  /*  #ifndef H5  */
  uni.scanCode({
    success(res) {
      console.log(res)
    },
    fail(_res) {}
  })
}
const toSearch = async () => {
  // await this.$emit('search', {
  // 	searchValue: this.searchValue
  // });
}
</script>

<style lang="scss" scoped>
.rf-search-bar {
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;
}
</style>
