<!-- eslint-disable max-len -->
<!--
 * @Description: 下载引导页
 * @Author: Kerwin
 * @Date: 2023-11-01 14:51:39
 * @LastEditTime: 2023-11-03 17:28:29
 * @LastEditors:  Please set LastEditors
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <!-- <u-navbar
      back-text=""
      title=""
      :title-bold="true"
      v-if="!userStore.isWeChatBrowser"
      color="#fff"
      title-color="#fff"
      :border-bottom="false"
      back-icon-color="#fff"
    ></u-navbar> -->
    <view class="content">
      <view class="ptip_container">
        点击右上角<br />
        <text class="pandroid_tip" style="visibility: visible"
          >选择在浏览器<i class="pbrowser"></i>中打开</text
        >
        <text class="pios_tip" style="display: none"
          >选择在Safari中<i class="pbrowser"></i>打开</text
        >
      </view> </view
    >>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background: #fff;
  line-height: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #caedfe, #f4fbff);
  .ptip_container {
    &::after {
      display: block;
      content: '';
      position: absolute;
      right: -0.6rem;
      top: 0.6rem;
      width: 1.85rem;
      height: 2.625rem;
      background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE4AAABpCAMAAACj3eWhAAAAnFBMVEUAAAA0NDQzMzMzMzM0NDQ3Nzc3NzdGRkY0NDQzMzMzMzMzMzM0NDQ7OzszMzMzMzM0NDQzMzM0NDQ4ODgzMzM0NDQ0NDQ1NTUzMzMzMzMzMzMzMzMzMzM0NDQzMzM0NDQ2NjYzMzMzMzM0NDQ1NTU0NDQ0NDQzMzMzMzM0NDQ0NDQ2NjYzMzMzMzMzMzM0NDQ0NDQzMzM1NTUzMzProukdAAAAM3RSTlMAiPvxNhcOBmv368XUCbZxJ9hWEp9dRSvu4r+rpYJ3UB3njGdCMN6xl3xkItzMkTuElExSQeOkAAADAUlEQVRo3q3Y53KjMBQFYBnTMd0FB3cb95bo/d9tV7pAlmSTSaRzfjhyZvINQtwrEaYby2G4mH3ONzjN43/TA14beTCNPJxGHk4jD6eRh9B8hNdqg7v4fKk9bc3qiR+LXu3pamwjOablrYpGY3KyMWu8WIWbtxo7ipHLGm+typHGhmJ4ZuQpciu/0dhMICM5fNJ1KsRyRw6NSsFlNH7ED6aZg+CWDBX5BI9hXCC4B4wbCK6CcXvBJTDOF5wF4wzBhSjNFprBUFlRZaFSCS6FcWPBBTBuJLgDjIsFd0Rp1OTmKI3anYttKEtsyVbYGrNR2kVofexTfNN3QmoiruBmWpKdzVKD8yKYV7RpnzSwvNfnbYIrbYvKWfq8E73W/uSf09eqUIphtMMX5ZnWVDm2mFO5V/rq7dS00KersdpmZ9BsK/XexjedmpAZOCpc+rGRuzpn9sunpyJoF2aiuBCDT74nPoa/59yPf7eRk19I09Lmcllt59BXO7FnH1biVXwvQjZX6yqJvOmX5uuO15vYQ/EgsP53izblHH2bsVwOfs+dqCgScaU9j7dvAIqHqLyoW8jA55SSiUjZYQqL0c3Nft/NmEIWHS3I6bfqJ8Zs3WLes55frtFD7UUgrSjOWZ2J3onRWU06JTX+riUr1zIqQ3p9R2UAfckLDcHlII1awZWhcqf+hMqUjimgmLLEbJBGG0YEW9dCcGdoSXg5irtCX6IyjvxXQLiHLgRtRjuQtvKgF3cQmpGANNqIesgXKL62QTfOl9wbRnNuUpuDtJIDVzWMpLbHFKsdSM2rIJp14zIjiHZJJWZgtG2fZrqEPG4Rl+lDCn9UkOabACw5cEo60ccmM17nHupjZYNN9W/bo8X4zNa0zM20xaaZ5iSfV/6ObR0d6jxMOQSzx6eoIKXBXAXMWZnL+Pgy5d145fKnmL2d9zb312EZBanP/xMjGtk/n9aefxcjcK1fdYivqSI67agAdDkjHZ47hak42fXtcIzfEke9829Pizh2z9nYTCymmT9utdP6dbO6TgAAAABJRU5ErkJggg==')
        no-repeat;
      background-size: contain;
    }
  }
  .pbrowser {
    // eslint-disable-next-line max-len
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA8CAYAAAA6/NlyAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQwIDc5LjE2MDQ1MSwgMjAxNy8wNS8wNi0wMTowODoyMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjU5M0ZGQjdENjcyRjExRTlCOTgyRjcwQzMwRTVCODU5IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjU5M0ZGQjdFNjcyRjExRTlCOTgyRjcwQzMwRTVCODU5Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NTkzRkZCN0I2NzJGMTFFOUI5ODJGNzBDMzBFNUI4NTkiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NTkzRkZCN0M2NzJGMTFFOUI5ODJGNzBDMzBFNUI4NTkiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5x88ScAAAGT0lEQVR42uxba2xU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');
  }
}
</style>
