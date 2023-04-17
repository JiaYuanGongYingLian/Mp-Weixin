<template>
  <view class="rf-search-bar bg-primary">
    <view
      class="header"
      :style="{
        width: clientInfo.width + 'px',
        marginTop: clientInfo.inputTop + 'px'
      }"
    >
      <!-- 搜索框 -->
      <view class="input-box" @tap="toSearch">
        <input class="input" disabled />
        <view class="wrapper">
          <text class="iconfont hy-icon-search"></text>
          <text class="keyword">{{ placeholder }}</text>
        </view>
      </view>
      <!-- 扫一扫 -->
      <view class="icon-box">
        <text class="iconfont" @tap.stop="link" :class="[icon]"></text>
      </view>
    </view>
  </view>
  <view
    class="placeholder-box"
    :style="{
      height: clientInfo.height + 'px'
    }"
  ></view>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    icon?: string;
  }>(),
  {
    placeholder: '热门搜索',
    icon: 'hy-icon-scan'
  }
)
const clientInfo = reactive({
  width: 0,
  height: 0,
  inputTop: 0
})
// #ifdef MP-WEIXIN
const obj = wx.getMenuButtonBoundingClientRect()
// #endif
// #ifdef H5
const obj = {
  top: 15,
  height: 40
}
// #endif
uni.getSystemInfo({
  success: (res) => {
    clientInfo.width = obj.left || res.windowWidth
    clientInfo.height = obj.top ? obj.top + obj.height : res.statusBarHeight
    clientInfo.inputTop = obj.top
      ? obj.top + (obj.height - 30) / 2
      : res.statusBarHeight + 7
  }
})

// 扫一扫
const link = () => {
  const _this = this
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
  padding-bottom: 36rpx;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 12;

    .icon-box {
      margin: 0 $uni-spacing-row-sm 0 0;
      color: $uni-text-color-inverse;

      .iconfont {
        font-weight: 400;
        font-size: 50rpx;
      }

      .logo {
        width: 45rpx;
        height: 45rpx;
        border-radius: 8rpx;
        margin-left: 10rpx;
      }
    }

    .input-box {
      flex: 1;
      height: 60rpx;
      line-height: 60rpx;
      background-color: $uni-bg-color-white;
      border-radius: 30rpx;
      position: relative;
      display: flex;
      align-items: center;
      margin: 0 $uni-spacing-row-sm;

      .wrapper {
        display: flex;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        font-size: $uni-font-size-sm + 2rpx;
        color: $uni-text-color-light;
        transform: translate(-50%, -50%);

        .iconfont {
          font-size: 34rpx;
          margin-right: $uni-spacing-row-sm;
        }
      }

      .input {
        width: 100%;
        padding-left: 28rpx;
        height: 28rpx;
        color: #888;
        font-size: 28rpx;
      }
    }
  }
}

.bg {
  &-primary {
    background-color: $bg-primary;
  }
}

.placeholder-box {
  width: 100%;
  padding-bottom: 40rpx;
  box-sizing: content-box;
}
</style>
