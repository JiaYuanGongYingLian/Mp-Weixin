<!--
 * @Description: 红包记录
 * @Author: Kerwin
 * @Date: 2023-11-30 17:11:21
 * @LastEditTime: 2023-12-09 14:19:58
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { route } from '@/utils/common'
import { getImgFullPath } from '@/utils'
import { moneyApi } from '@/api'
import { useUserStore, useRyStore } from '@/store'
import { RY_AVATAR } from '@/common/config'

const userStore = useUserStore()
const ryStore = useRyStore()
const { pinia_groupUserlist } = storeToRefs(ryStore)
console.log(pinia_groupUserlist.value)
const id = ref('')
const loading = ref(false)
const hongBaoInfo = ref({})
const targetId = ref('')
const wallets = [
  {
    name: '余额',
    value: 1
  },
  {
    name: '购物积分',
    value: 3
  }
]
async function gethongBaoInfo() {
  uni.showLoading()
  const { code, data } = await moneyApi.redPacketInfo({
    id: id.value,
    detail: true,
    otherColumns: 'user,wallet',
    noPaging: true
  })
  if (code === 200) {
    hongBaoInfo.value = data
    loading.value = true
    uni.hideLoading()
    const groupUser =
      pinia_groupUserlist.value[ryStore.userinfo.id][targetId.value]
    hongBaoInfo.value.senderNickname =
      groupUser.find((item) => item.userId === hongBaoInfo.value.userId)
        ?.nickname || ''
    hongBaoInfo.value.walletFlows.forEach((e) => {
      e.user.circle_nickname =
        groupUser.find((item) => item.userId === e.userId)?.nickname || ''
    })
  }
}
const isScoreWalet = computed(() => {
  return hongBaoInfo.value?.toWalletRuleId === wallets[1].value
})
onLoad((optons) => {
  id.value = optons?.id
  targetId.value = optons?.targetId
  gethongBaoInfo()
})
</script>
<template>
  <view class="container">
    <view v-if="loading">
      <view class="head">
        <view class="title"
          >{{
            hongBaoInfo?.senderNickname || hongBaoInfo?.user.nickname
          }}发出的红包</view
        >
        <view class="info">{{ hongBaoInfo?.content }}</view>
        <view class="money">
          <text>{{ hongBaoInfo?.totalMoney }}</text>
          <text class="unit" v-if="!isScoreWalet">元</text>
          <text class="unit" v-if="isScoreWalet">积分</text>
        </view>
        <view class="tip"
          >已存入{{ isScoreWalet ? '积分' : '' }}钱包，可用于发红包</view
        >
      </view>
      <view class="item">
        <view class="tips">
          <view v-if="hongBaoInfo.status == 20">
            {{ hongBaoInfo.totalCount }}个红包共{{ hongBaoInfo.totalMoney
            }}{{ isScoreWalet ? '积分' : '元' }}，已被抢完
          </view>
          <view v-else>
            已领取{{ hongBaoInfo.walletFlows.length }}/{{
              hongBaoInfo.totalCount
            }}个
          </view>
        </view>
        <view class="u-border-top u-m-t-20 u-m-b-20"></view>
        <view
          class="body-item"
          v-for="item in hongBaoInfo.walletFlows"
          :key="item.id"
        >
          <view class="u-m-t-20" style="position: relative">
            <u-image
              width="80"
              height="80"
              border-radius="8"
              :loading-icon="RY_AVATAR"
              :error-icon="RY_AVATAR"
              :src="
                item?.user?.avatar
                  ? getImgFullPath(item?.user?.avatar)
                  : RY_AVATAR
              "
              :lazy-load="false"
              :fade="false"
              mode="aspectFill"
            ></u-image>
          </view>
          <view class="content u-m-t-20">
            <view class="title">
              {{ item?.user?.circle_nickname || item?.user?.nickname }}
            </view>
            <view class="head_right">
              <text>{{ item?.money }}</text>
              <text v-if="!isScoreWalet">元</text>
              <text v-if="isScoreWalet">积分</text>
            </view>
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
.container {
  padding-top: 100rpx;
}
.head {
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
