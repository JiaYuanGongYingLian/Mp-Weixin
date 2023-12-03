<!-- eslint-disable consistent-return -->
<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { moneyApi } from '@/api'
import { useUserStore, useRyStore } from '@/store'
import { route } from '@/utils/common'

const emit = defineEmits(['received'])
const ryStore = useRyStore()
const userStore = useUserStore()
const hongbaoshow = ref(false)
const money = ref<string | number>('')
const count = ref(1)
const content = ref('')
const totalMoney = computed(() => {
  const m = money.value || 0
  return Number((m * count.value).toFixed(2))
})
const typeMaps = [
  {
    name: '普通红包',
    value: 1
  },
  // {
  //   name: '专属红包',
  //   value: 2
  // },
  {
    name: '普通积分红包',
    value: 3
  }
  // {
  //   name: '专属积分红包',
  //   value: 4
  // }
]
const hbType = ref(typeMaps[1])
const isScoreWallet = computed(() => {
  return [3, 4].includes(hbType.value.value)
})
const toWalletRuleId = computed(() => {
  if ([3, 4].includes(hbType.value.value)) {
    return 3
  }
  return 1
})

const actionSheetCallback = (e: number) => {
  hbType.value = typeMaps[e]
}
const showPicker1 = ref(false)
const hongBaoInfo = ref({})
const props = withDefaults(
  defineProps<{
    chatType?: number
    targetId?: number | string
    circleId?: number | string
  }>(),
  {
    chatType: 0
  }
)
const isSingle = computed(() => {
  return props.chatType === 0
})
function sendRedPacketShow() {
  money.value = ''
  count.value = 1
  content.value = ''
  hongbaoshow.value = !hongbaoshow.value
}
// 点击红包
const openhongbao = ref(false)
function openhb(e: { open: number }) {
  hongBaoInfo.value = e
  openhongbao.value = true
}
// 开启红包
async function receive_hongbao(data: { friendCircleRedPacketId: any }) {
  const { friendCircleRedPacketId } = data

  const { code } = await moneyApi.redPacketDistribution({
    id: friendCircleRedPacketId,
    userId: userStore.userInfo.id,
    friendCircleId: props.circleId
  })
  if (code === 200) {
    emit('received', friendCircleRedPacketId)
    openhongbao.value = false
    route({
      url: '/packageA/pages/hongBaoRecord/index',
      params: {
        id: friendCircleRedPacketId
      }
    })
  }
}
// 发起红包
async function submithb() {
  if (!money.value) {
    return false
  }
  const { code, data } = await moneyApi.redPacketAdd({
    title: isScoreWallet.value ? '积分红包' : '现金红包',
    status: 1,
    userId: userStore.userInfo.id,
    money: money.value,
    content: content.value || '恭喜发财，大吉大利',
    toUserId: '',
    totalMoney: totalMoney.value,
    count: Number(count.value),
    friendCircleId: props.circleId,
    nickname: userStore.userInfo.nickname,
    toWalletRuleId: toWalletRuleId.value
  })
  if (code === 200) {
    sendRedPacketShow()
    const params = {
      title: isScoreWallet.value ? '积分红包' : '现金红包',
      targetId: props?.targetId,
      content: content.value || '恭喜发财，大吉大利',
      msgType: 9,
      count: count.value,
      totalMoney: totalMoney.value,
      status: 1,
      group: !isSingle.value,
      nickname: userStore.userInfo.nickname,
      friendCircleRedPacketId: data.id,
      toWalletRuleId: toWalletRuleId.value
    }
    ryStore.sendMessage(params)
  }
}
defineExpose({
  openhb,
  sendRedPacketShow
})
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <u-popup
      v-model="hongbaoshow"
      mode="bottom"
      length="100%"
      duration="200"
      :mask="false"
      z-index="10100"
    >
      <view
        style="width: 100%; height: 100%; background-color: rgba(237, 237, 237)"
      >
        <u-top-tips ref="uTips"></u-top-tips>
        <u-navbar
          back-icon-name="close"
          back-icon-size="30"
          title="发红包"
          :title-bold="true"
          :custom-back="sendRedPacketShow"
        ></u-navbar>

        <view class="sendhongbao">
          <view class="hb_type" @click="showPicker1 = true">
            <text style="margin-right: 6rpx">{{ hbType.name }}</text>
            <u-icon name="arrow-down" size="10"></u-icon>
          </view>
          <u-action-sheet
            :list="typeMaps"
            v-model="showPicker1"
            label-name="name"
            @click="actionSheetCallback"
          ></u-action-sheet>
          <view class="item">
            <view class="label">数量</view>
            <view class="content-text">
              <u-input
                type="number"
                :clearable="false"
                maxlength="10"
                v-model="count"
                input-align="right"
                placeholder="填写个数"
              />
            </view>
            <view class="foot">个</view>
          </view>
          <view class="item">
            <view class="label" v-if="isScoreWallet">积分</view>
            <view class="label" v-else>金额</view>
            <view class="content-text">
              <u-input
                type="digit"
                :clearable="false"
                maxlength="10"
                v-model="money"
                input-align="right"
                placeholder="0.00"
              />
            </view>
            <view class="foot" v-if="!isScoreWallet">元</view>
          </view>
          <view class="item" style="height: 130rpx">
            <view class="content-textarea">
              <u-input
                v-model="content"
                :custom-style="{ fontSize: '35rpx' }"
                :auto-height="true"
                type="textarea"
                maxlength="16"
                placeholder-style="font-size: 35rpx;"
                placeholder="恭喜发财,大吉大利"
              />
            </view>
          </view>
          <view class="money">
            <text class="unit" v-if="!isScoreWallet">¥</text>
            <text>{{ totalMoney }}</text>
            <text class="unit" v-if="isScoreWallet">积分</text>
          </view>
          <view class="buttom">
            <u-button
              ripple
              type="warning"
              :disabled="!totalMoney"
              :custom-style="{
                width: '400rpx',
                backgroundColor: '#FB5353'
              }"
              :hair-line="false"
              @click="submithb"
            >
              塞{{ isScoreWallet ? '积分' : '钱' }}进红包
            </u-button>
          </view>
        </view>
      </view>
    </u-popup>
    <u-popup
      v-model="openhongbao"
      width="80%"
      height="60%"
      negative-top="35%"
      border-radius="16"
      mode="center"
    >
      <view class="openhongbao">
        <view class="bj"></view>
        <view class="head">
          <view class="title">{{ hongBaoInfo.nickname }}发出的红包</view>
          <view class="info">{{ hongBaoInfo.content }}</view>
        </view>
        <view class="an">
          <view class="an1" @click="receive_hongbao(hongBaoInfo)">開</view>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.sendhongbao {
  width: 100%;
  height: 100%;
  padding: 30rpx 40rpx;
  .hb_type {
    margin-bottom: 12rpx;
    color: orange;
  }

  .item {
    width: 100%;
    height: 100rpx;
    margin-bottom: 40rpx;
    display: flex;
    background-color: #ffffff;
    border-radius: 12rpx;
    align-items: center;
    padding-right: 30rpx;

    .label {
      padding-left: 20rpx;
      align-items: center;
      font-size: 35rpx;
      flex-shrink: 0;
    }

    .content-text {
      padding-left: 20rpx;
      align-items: right;
      position: relative;
      flex: 1;
    }

    .content-textarea {
      padding: 10rpx;
      width: 100%;
      font-size: 35rpx;
    }

    .foot {
      padding-left: 20rpx;
      align-items: center;
      font-size: 35rpx;
      position: relative;
      flex-shrink: 0;
    }
  }

  .money {
    display: flex;
    margin-top: 50rpx;
    justify-content: center;
    font-size: 80rpx;
    font-weight: bold;
    align-items: flex-start;
    .unit {
      font-size: 34rpx;
    }
  }

  .buttom {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;

    .anniu {
      background-color: #e0c0b5;
      // background-color: #da6844;
      width: 350rpx;
      border: none;
      color: #ffffff;
    }
  }
}
.openhongbao {
  width: 100%;
  height: 100%;
  background-color: #e1604c;
  overflow: hidden;
  .bj {
    width: 200%;
    height: 80%;
    background-color: #e36754;
    position: absolute;
    top: 0;
    left: -50%;
    border-radius: 0 0 50% 50%;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 0px 3px 1px;
  }
  .head {
    position: relative;
    color: #e5cda0;
    margin-top: 30%;
    font-size: 35rpx;
    font-weight: bold;
    .title {
      display: flex;
      justify-content: center;
    }
    .info {
      margin-top: 30rpx;
      display: flex;
      justify-content: center;
    }
  }
  .an {
    display: flex;
    justify-content: center;
    .an1 {
      position: absolute;
      bottom: 13%;
      width: 150rpx;
      height: 150rpx;
      background-color: #e5cda0;
      border-radius: 50%;
      text-align: center;
      line-height: 150rpx;
      font-size: 50rpx;
    }
  }
}
</style>
