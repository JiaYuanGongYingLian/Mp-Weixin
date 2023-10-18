<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-16 17:48:25
 * @LastEditTime: 2023-10-18 16:20:47
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { BrowserMultiFormatReader } from '@zxing/library'
import { baseApi, powerBankApi, userApi } from '@/api'
import { checkLoginState, getImgFullPath } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { userInfo } = storeToRefs(userStore)
const deviceInfo = ref({})
const siteInfo = ref({})
const deviceSn = ref()
const serviceType = ref()
const phoneNumber = ref('4006381238')
function mobileFn() {
  uni.makePhoneCall({
    phoneNumber: phoneNumber.value
  })
}
function jump() {
  uni.navigateTo({
    url: '/packageB/pages/powerBank/order'
  })
}
const cuInfo = ref()
async function getInfo() {
  const { data } = await powerBankApi.getCustomerInfo({})
  cuInfo.value = data
}
onLoad((option) => {
  const userInfo = uni.getStorageSync('userInfo')
  if (userInfo) {
    userStore.syncSetUserInfo(userInfo)
  }
  getInfo()
})
</script>
<template>
  <view class="container">
    <hy-nav-bar
      :title="'个人中心'"
      :is-fixed="true"
      :immersive="true"
      :background="{ background: 'rgba(0,0,0,0)' }"
      :border-bottom="false"
    ></hy-nav-bar>
    <view class="top_bg">
      <image
        src="https://image.blacksilverscore.com/uploads/08f5b73f-85c9-4a99-8dde-c6ba05b6a17c.png"
        mode="scaleToFill"
        class="bg"
      />
      <view class="top_box">
        <view class="avatar_box">
          <u-avatar
            class="avatar"
            :src="getImgFullPath(userInfo?.avatar)"
          ></u-avatar>
          <view class="name_box">
            <view class="name">{{
              userInfo?.nickname || userInfo?.username
            }}</view>
            <view class="phone">{{ userInfo?.phone }}</view>
          </view>
        </view>
        <view class="info_box">
          <view class="info">
            <view class="item">
              <view class="label">会员余额（元）</view>
              <view class="value_box">
                <view class="count">{{
                  cuInfo?.washCustomer?.balance || 0
                }}</view>
                <u-icon name="arrow-right"></u-icon>
              </view>
            </view>
            <view class="item">
              <view class="label">会员券</view>
              <view class="value_box">
                <view class="count">{{ cuInfo?.couponCount || 0 }}</view>
                <u-icon name="arrow-right"></u-icon>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="main">
        <u-cell-group :border="false">
          <u-cell-item
            icon="list-dot"
            title="充电宝使用记录"
            @click="jump"
          ></u-cell-item>
        </u-cell-group>
        <u-cell-group :border="false" style="margin-top: 20rpx">
          <u-cell-item
            icon="phone"
            title="招商加盟"
            :border-bottom="false"
            value="周一至周五9:00-18:00"
            @click="mobileFn"
          ></u-cell-item>
          <u-cell-item
            icon="server-man"
            title="联系客服"
            value="周一至周五9:00-18:00"
            @click="mobileFn"
          ></u-cell-item>
        </u-cell-group>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #f7f7f7;
  .top_bg {
    width: 100%;
    height: 440rpx;
    position: relative;
    .bg {
      width: 100%;
      height: 100%;
    }
  }
  .top_box {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 30rpx;
    .avatar_box {
      display: flex;
      align-items: center;
      margin-bottom: 40rpx;
      .name_box {
        margin-left: 20rpx;
        .name {
          font-size: 30rpx;
          margin-bottom: 8rpx;
          font-weight: bold;
        }
        .phone {
          font-size: 20rpx;
          color: #666;
        }
      }
    }
    .info_box {
      background: #84a3fe;
      width: 100%;
      border-top-right-radius: 40rpx;
      border-top-left-radius: 40rpx;
      overflow: hidden;
      .info {
        display: flex;
        align-items: center;
        padding: 40rpx 30rpx;
        color: #fff;
        box-shadow: 0 30rpx 20rpx 0 rgba(0, 0, 0, 0.1);
        .item {
          width: 50%;
          box-sizing: border-box;
          &:first-child {
            padding-right: 30rpx;
          }
          &:last-child {
            border-left: 1px solid rgba(255, 255, 255, 0.5);
            padding-left: 40rpx;
          }
          .label {
            font-size: 24rpx;
            margin-bottom: 20rpx;
          }
          .count {
            font-size: 32rpx;
            font-weight: bold;
          }
        }
        .value_box {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
  .main {
    padding: 30rpx;
    border-top-right-radius: 20rpx;
    border-top-left-radius: 20rpx;
    position: relative;
    top: -20rpx;
    background: #f7f7f7;
    :deep(.u-cell-item-box) {
      border-radius: 10rpx;
    }
    :deep(.u-cell) {
      padding: 10rpx 20rpx;
      border-radius: 20rpx;
      color: #333;
    }
  }
}

.btn {
  margin: 20rpx 40rpx 0 40rpx;
}
</style>
