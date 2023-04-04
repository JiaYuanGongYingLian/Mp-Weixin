<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi, orderApi } from '@/api'
import icon_wechat from '@/static/pay_icon_wechat.png'
// import icon_ali from "@/static/pay_icon_alipay.png"
import icon_hy from '@/static/pay_icon_money.png'
import icon_select from '@/static/ic_pop_select_normal.png'
import icon_selected from '@/static/ic_pop_select_selected.png'
import icon_verify from '@/static/icon_verify.png'

const order = ref()
const info = reactive({
  money: ''
})
const payWay = reactive([
  {
    name: '微信支付',
    icon: icon_wechat,
    selected: true
  },
  {
    name: '黑银积分',
    icon: icon_hy,
    selected: false
  }
])
const code = ref()
const timer = ref<NodeJS.Timer | null>(null)
const countDown = ref(60)

async function getWalletRuleLis() {
  const { data } = await productApi.walletRuleList({
    noPaging: true,
    orderId: order.value.id
  })
}

function handleSlect(way: { selected: boolean }) {
  payWay.forEach((item) => {
    item.selected = false
  })
  way.selected = true
}
function getCode() {
  if (timer.value) return
  timer.value = setInterval(() => {
    countDown.value -= 1
    if (countDown.value === 0) {
      clearInterval(timer.value)
      timer.value = null
    }
  }, 1000)
}

// 调用支付
function weChatPaymentApp(config: { [x: string]: any }, orderId: any) {
  uni.requestPayment({
    provider: 'wxpay',
    // #ifdef APP-PLUS
    orderInfo: JSON.stringify(config),
    // #endif
    // #ifdef MP-WEIXIN
    timeStamp: config.timestamp, // 时间戳
    nonceStr: config.nonceStr, // 随机字符串，长度为32个字符以下。
    package: config.package, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。
    signType: 'MD5', // 签名算法，暂支持 MD5。
    paySign: config.paySign, // 签名
    // #endif
    success: (_res) => {
      // Toast(JSON.stringify(res))
      paySuccess(orderId)
    },
    fail: (_err) => {
      // Toast(JSON.stringify(err))
      payFail(orderId)
    }
  })
}
// 支付成功回调
function paySuccess(orderId) {}
// 支付失败回调
function payFail(orderId: string) {
  uni.showToast({
    icon: 'none',
    title: '支付失败',
    duration: 2000
  })
  // setTimeout(() => {
  //   uni.redirectTo({
  //     url: `/packageA/order/detail?id=${orderId}`
  //   })
  // }, 1000)
}
function onSubmit() {
  orderApi.orderPay({
    orderId: order.value.id,
    // openId: '',
    payPlatform: 3,
    payWay: 3
  })
}
onLoad((option) => {
  if (option?.money) {
    info.money = option.money
  }
  if (option?.order) {
    order.value = JSON.parse(option.order)
    info.money = order.value.money
  }
  getWalletRuleLis()
})
</script>
<template>
  <div class="payment">
    <view class="money">￥{{ info.money }} </view>
    <view class="payWay">
      <view
        class="options"
        v-for="item in payWay"
        :key="item.name"
        @click="handleSlect(item)"
      >
        <view class="option">
          <view class="nameBox">
            <u-icon :name="item.icon" size="50"></u-icon>
            <text class="name">{{ item.name }}</text>
          </view>
          <u-icon
            :name="item.selected ? icon_selected : icon_select"
            size="40"
          ></u-icon>
        </view>
        <u-form-item
          label=""
          prop="name"
          :left-icon="icon_verify"
          :left-icon-style="{ with: 40 }"
          v-if="item.name === '黑银积分' && item.selected"
        >
          <u-input v-model="code" placeholder="请填写验证码" />
          <template v-slot:right>
            <u-button
              type="success"
              size="mini"
              :ripple="true"
              :disabled="Boolean(timer)"
              @click="getCode"
            >
              {{ timer ? `验证(${countDown}s)` : '获取验证码' }}
            </u-button>
          </template>
        </u-form-item>
      </view>
    </view>
    <u-button class="hy-btn" type="primary" ripple @click="onSubmit">
      确认支付
    </u-button>
  </div>
</template>

<style lang="scss" scoped>
.payment {
  padding: 30rpx;
  text-align: center;

  .money {
    font-size: 60rpx;
    margin-bottom: 40rpx;
  }

  .payWay {
    .options {
      .option {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 40rpx;

        .nameBox {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .name {
            font-size: 30rpx;
            margin-left: 15rpx;
          }
        }
      }
    }
  }

  .hy-btn {
    margin-top: 200rpx;
  }
}
</style>
