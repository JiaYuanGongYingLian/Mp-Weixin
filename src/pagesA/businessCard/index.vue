<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-25 09:26:40
 * @LastEditTime: 2023-07-24 10:05:15
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onPageScroll } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import hyNavBarSimpler from '@/components/hy-nav-bar-simpler/index.vue'
import c_shop from './c_shop.vue'
import c_biography from './c_biography.vue'
import c_video from './c_video.vue'
import c_contact from './c_contact.vue'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)

const tabList = ref([
  {
    name: '传记'
  },
  {
    name: '视频'
  },
  {
    name: '橱窗'
  },
  {
    name: '排行榜'
  }
])
const currentTab = ref(0)
function toEdit() {}
const pop = ref()
function contact() {
  uni.setStorageSync('businessCard', {
    nickName: '钱祥龙',
    cate: '亲子教育'
  })
  pop.value.openPop()
}
function tabChange() {}
onLoad((option) => {})

const show = ref(true)
const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
  if (e.scrollTop > 50) {
    show.value = false
  } else {
    show.value = true
  }
})
</script>
<template>
  <view class="container">
    <hyNavBarSimpler v-show="show" />
    <view class="topView">
      <u-image
        src="https://oss.wyh139.com/Uploads/Merchants/20230606/1686017975000501.png"
        width="100%"
        height="400rpx"
      ></u-image>
      <view class="headBox">
        <view class="avatar">
          <u-image
            src="https://oss.wyh139.com/Uploads/Merchants/20230606/1686017975000501.png"
            width="180rpx"
            height="180rpx"
            shape="circle"
            @click="toEdit"
          ></u-image>
        </view>
        <view class="info">
          <view class="name">钱祥龙</view>
          <uni-view class="badge">亲子教育</uni-view>
        </view>
      </view>
    </view>
    <view class="main">
      <view class="section">
        <view class="accountInfo">
          <view class="item">
            <text class="val">194.0万</text>
            <text class="label">获赞</text>
          </view>
          <view class="item">
            <text class="val">8</text>
            <text class="label">关注</text>
          </view>
          <view class="item">
            <text class="val">10万</text>
            <text class="label">粉丝</text>
          </view>
        </view>
        <view class="remark"> "人生是美好的，好好珍惜每一天！" </view>
        <view class="action">
          <view class="subscribe focus">
            <text class="text">+关注</text>
          </view>
          <view class="subscribe link" @click="contact">
            <text class="text">立即对接</text>
          </view>
          <c_contact ref="pop" />
        </view>
      </view>
      <u-tabs
        active-color="#333"
        :list="tabList"
        :is-scroll="false"
        v-model="currentTab"
        bar-width="200"
        item-width="50%"
        @change="tabChange"
        sticky
        :style="{ top: '0', zIndex: 2 }"
      ></u-tabs>
      <!-- 传记 -->
      <view class="tabBox biography" v-show="currentTab === 0">
        <c_biography />
      </view>
      <!-- 视频 -->
      <view class="video" v-show="currentTab === 1">
        <c_video />
      </view>
      <!-- 橱窗 -->
      <view class="shop" v-show="currentTab === 2">
        <c_shop />
      </view>
      <!-- 排行榜 -->
      <view class="shop" v-show="currentTab === 3">
        <u-empty text="暂无数据" mode="list" style="margin-top: 30px"></u-empty>
      </view>
      <u-back-top :scroll-top="scrollTop"></u-back-top>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.topView {
  position: relative;

  .headBox {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 60rpx 40rpx;
    display: flex;
    align-items: center;
    box-shadow: inset 0rpx -100rpx 20rpx -10rpx rgba(0, 0, 0, 0.1);

    .avatar {
      width: 180rpx;
      height: 180rpx;
      border: 2px solid #fff;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30rpx;
    }

    .info {
      display: flex;
      align-items: center;

      .name {
        color: #fff;
        font-size: 36rpx;
        font-weight: bold;
      }

      .badge {
        max-width: 77px;
        color: #fff;
        font-size: 20rpx;
        background: linear-gradient(128deg, #ff522d, #ff913e);
        border-radius: 17px;
        padding: 2px 8px;
        margin-left: 7px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 0rpx;
      }
    }
  }
}

.main {
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  position: relative;
  top: -30rpx;
  background: #fff;
  flex: 1;
  box-shadow: 0rpx 30rpx 0rpx 0 rgb(255, 255, 255);

  .section {
    padding: 40rpx 30rpx;
  }

  .accountInfo {
    display: flex;
    align-items: center;
    gap: 30rpx;

    .val {
      font-size: 34rpx;
      font-weight: bold;
      margin-right: 10rpx;
    }

    .label {
      color: #666;
    }
  }

  .remark {
    padding: 30rpx 0 20rpx 0;
  }
}

.action {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10rpx;
  .subscribe {
    background-color: #fc2b55;
    border-radius: 6rpx;
    color: #fff;
    text-align: center;
    line-height: 60rpx;
    font-weight: bold;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.3);
    &.focus {
      width: 40%;
    }
    &.link {
      flex: 1;
    }
    &:active {
      box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
      transform: translateY(0em) scale(0.99);
      transition: background-color 150ms ease-out, box-shadow 150ms ease-out,
        transform 150ms ease-out;
    }
  }
}

.u-tabs {
  border-bottom: 1px solid #ccc;

  :deep(.u-tab-bar) {
    // transform: translateY(0) !important;
    bottom: -3px;
  }
}

.biography {
  padding: 26rpx;
}

.shop {
  padding: 30rpx;
}
</style>
