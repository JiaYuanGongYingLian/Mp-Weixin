<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistances, previewImage } from '@/utils/index'

const productData = reactive({})
onLoad((option) => {})
</script>
<template>
  <div class="main">
    <!--商品图轮播-->
    <view class="carousel">
      <swiper class="swiper" indicator-dots circular="true" duration="400">
        <swiper-item
          class="swiper-item"
          v-for="(src, index) in productData.slider_image"
          :key="index"
        >
          <view class="image-wrapper">
            <image
              :src="src"
              class="loaded"
              mode="aspectFill"
              @click="previewImage(index)"
            ></image>
          </view>
        </swiper-item>
      </swiper>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.carousel {
  width: 100%;
  overflow: hidden;
  position: relative;

  .swiper {
    height: 750rpx;
    .image-wrapper {
      width: 100%;
      height: 100%;
    }

    .swiper-item {
      display: flex;
      justify-content: center;
      align-content: center;
      height: 750rpx;
      overflow: hidden;

      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
