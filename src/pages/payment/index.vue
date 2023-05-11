<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { baseApi, productApi, orderApi } from '@/api'
import { isWeChat } from '@/utils/common'
import { useUserStore } from '@/store'
import icon_wechat from '@/static/pay_icon_wechat.png'
import icon_ali from '@/static/pay_icon_alipay.png'
import icon_hy from '@/static/pay_icon_money.png'
import icon_select from '@/static/ic_pop_select_normal.png'
import icon_selected from '@/static/ic_pop_select_selected.png'
import icon_verify from '@/static/icon_verify.png'

const userStore = useUserStore()
const order = ref()
const info = reactive({
  money: ''
})
const payWay = reactive([
  {
    name: '微信支付',
    icon: icon_wechat,
    selected: true,
    available: true
  },
  {
    name: '支付宝支付',
    icon: icon_ali,
    selected: false,
    available: false
  },
  {
    name: '黑银积分',
    icon: icon_hy,
    selected: false,
    available: false
  }
])
const sms_code = ref()
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
function weChatPaymentApp(config: any) {
  uni.requestPayment({
    provider: 'wxpay',
    // #ifdef APP-PLUS
    orderInfo: JSON.stringify(config),
    // #endif
    // #ifdef MP-WEIXIN
    timeStamp: config.timeStamp, // 时间戳
    nonceStr: config.nonceStr, // 随机字符串，长度为32个字符以下。
    package: config.package, // 统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=xx。
    signType: config.signType, // 签名算法，暂支持 MD5。
    paySign: config.paySign, // 签名
    // #endif
    success: (_res) => {
      paySuccess()
    },
    fail: (_err) => {
      payFail()
    }
  })
}
// 支付成功回调
function paySuccess() {
  uni.showToast({
    icon: 'none',
    title: '支付成功',
    duration: 2000
  })
  setTimeout(() => {
    uni.redirectTo({
      url: `/pages/order/detail?id=${order.value.id}`
    })
  }, 1000)
}
// 支付失败回调
function payFail() {
  uni.showToast({
    icon: 'none',
    title: '支付失败',
    duration: 2000
  })
}
enum payPlatform_enum {
  MP = 2,
  H5 = 3
}
async function onSubmit() {
  // if (!uni.getStorageSync('openid')) {
  //   const { code } = await userStore.wxAuth()
  //   if (code) {
  //     await userStore.wxMiniLogin(code)
  //   }
  //   return
  // }
  const { data } = await orderApi.orderPay({
    orderId: order.value.id,
    openId: uni.getStorageSync('openid'),
    // #ifdef H5
    payPlatform: payPlatform_enum.H5,
    // #endif
    // #ifdef MP-WEIXIN
    payPlatform: payPlatform_enum.MP,
    // #endif
    payWay: 3
  })
  if (data) {
    const jsonData = JSON.parse(data)
    const selected = payWay.find((item) => item.selected)
    if (selected?.name === '微信支付') {
      wxPay(jsonData)
    } else if (selected?.name === '支付宝支付') {
      aliPay(jsonData)
    } else {
      jfPay(jsonData)
    }
  }
}
function wxPay(data: object) {
  // #ifdef MP-WEIXIN
  weChatPaymentApp(data)
  // #endif
  // #ifdef H5
  if (typeof WeixinJSBridge === 'undefined') {
    if (document.addEventListener) {
      document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
    } else if (document.attachEvent) {
      document.attachEvent('WeixinJSBridgeReady', onBridgeReady)
      document.attachEvent('onWeixinJSBridgeReady', onBridgeReady)
    }
  } else {
    onBridgeReady(data)
  }
  // #endif
}
function aliPay(data: object) {}
function jfPay(data: object) {}
function onBridgeReady(data: any) {
  WeixinJSBridge.invoke(
    'getBrandWCPayRequest',
    {
      appId: data.appId,
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign
    },
    (res: { err_msg: string }) => {
      if (res.err_msg === 'get_brand_wcpay_request:ok') {
        // 使用以上方式判断前端返回,微信团队郑重提示：
        // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
        uni.redirectTo({
          url: '/pages/payment/success'
        })
      }
    }
  )
}
onLoad(async (option) => {
  if (option?.money) {
    info.money = option.money
  }
  if (option?.order) {
    order.value = JSON.parse(option.order)
    info.money = order.value.money
    getWalletRuleLis()
  }
})
</script>
<template>
  <div class="payment">
    <view class="money">￥{{ info.money }} </view>
    <view class="payWay">
      <view v-for="item in payWay" :key="item.name">
        <view class="options" v-if="item.available" @click="handleSlect(item)">
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
            <u-input v-model="sms_code" placeholder="请填写验证码" />
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
