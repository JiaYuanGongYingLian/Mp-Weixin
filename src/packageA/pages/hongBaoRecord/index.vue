<!--
 * @Description: 红包记录
 * @Author: Kerwin
 * @Date: 2023-11-30 17:11:21
 * @LastEditTime: 2023-11-30 17:30:36
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { route } from '@/utils/common'
import { socialApi } from '@/api'

const id = ref('')
const loading = ref(false)
const hongBaoInfo = ref({})
async function gethongBaoInfo() {
  uni.showLoading()
  const { code, data } = await socialApi.circleInfo({})
  if (code === 200) {
    hongBaoInfo.value = data
    this.loading = true
    uni.hideLoading()
  }
}
onLoad((opt) => {
  id.value = opt?.id
  gethongBaoInfo()
})
</script>
<template>
  <view>
    <view v-if="loading">
      <view class="head">
        <view class="title"
          >{{
            hongBaoInfo.senduser ? '你' : hongBaoInfo.nickname
          }}发出的红包</view
        >
        <view class="info">{{ hongBaoInfo.ps }}</view>
        <view v-if="hongBaoInfo.type == 1">
          <view class="money" v-if="!hongBaoInfo.senduser"
            >¥{{ hongBaoInfo.moneys }}</view
          >
        </view>
        <view v-if="hongBaoInfo.type == 2">
          <view
            class="money"
            v-if="hongBaoInfo.senduser && hongBaoInfo.moneys != 0"
            >¥{{ hongBaoInfo.moneys }}</view
          >
          <view
            class="money"
            v-if="!hongBaoInfo.senduser && hongBaoInfo.moneys != 0"
            >¥{{ hongBaoInfo.moneys }}</view
          >
        </view>
        <view class="tip" v-if="hongBaoInfo.moneys != 0"
          >已存入钱包，可用于发红包 ></view
        >
      </view>
      <view class="item" v-if="hongBaoInfo.senduser || hongBaoInfo.type == 2">
        <view class="tips" v-if="hongBaoInfo.senduser">
          <view v-if="hongBaoInfo.balancesize == 0">
            {{ hongBaoInfo.size }}个红包共{{ hongBaoInfo.money }}元，已被抢完
          </view>
          <view v-else>
            已领取{{ hongBaoInfo.size - hongBaoInfo.balancesize }}/{{
              hongBaoInfo.size
            }}个
          </view>
        </view>
        <view
          class="tips"
          v-if="!hongBaoInfo.senduser && hongBaoInfo.type == 2"
        >
          <view v-if="hongBaoInfo.size - hongBaoInfo.balancesize != 0">
            领取{{ hongBaoInfo.size - hongBaoInfo.balancesize }}/{{
              hongBaoInfo.size
            }}个
          </view>
          <view v-else> 共{{ hongBaoInfo.size }}个，已被抢完 </view>
        </view>
        <view class="u-border-top u-m-t-20 u-m-b-20"></view>
        <view class="body-item" v-for="item in hongBaoInfo.log" :key="item.id">
          <view class="u-m-t-20" style="position: relative">
            <u-lazy-load
              class="images"
              border-radius="12"
              height="100"
              :image="item.avatar"
              threshold="300"
              img-mode="aspectFill"
            ></u-lazy-load>
          </view>
          <view class="content u-m-t-20">
            <view class="title">
              {{ item.nickname }}
            </view>
            <view class="head_right"> ¥{{ item.money }} </view>
            <view class="item_content text-line-1 u-m-b-5">
              <!-- {{ item.time | date('hh:MM') }} -->
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.head {
  margin-top: 100rpx;
  .title {
    display: flex;
    justify-content: center;
    font-size: 45rpx;
    font-weight: bold;
  }
  .info {
    display: flex;
    justify-content: center;
    color: #c0c4cc;
  }
  .money {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    color: #bea375;
    font-size: 100rpx;
  }
  .tip {
    display: flex;
    justify-content: center;
    color: #bea375;
  }
}

.item {
  margin-top: 100rpx;
  padding: 18rpx;
  .tips {
    color: #909399;
  }
  .body-item {
    display: flex;
    height: auto;
    width: 100%;
    color: #333;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
      .title {
        display: flex;
        padding-top: 10rpx;
        font-size: 35rpx;
        line-height: 40rpx;
        font-weight: bold;
      }
      .head_right {
        position: absolute;
        right: 30rpx;
        font-size: 40rpx;
        color: #000000;
      }
      .item_content {
        color: #82848a;
        font-size: 28rpx;
      }
    }
  }
}

.body-item .images {
  width: 100rpx;
  height: 100rpx;
}
</style>
