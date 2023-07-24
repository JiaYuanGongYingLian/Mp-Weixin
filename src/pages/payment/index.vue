<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-console -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable no-use-before-define -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, orderApi, moneyApi } from '@/api'
import { isWeChat } from '@/utils/common'
import { useConfigStore, useUserStore } from '@/store'
import icon_wechat from '@/static/pay_icon_wechat.png'
import icon_ali from '@/static/pay_icon_alipay.png'
import icon_hy from '@/static/pay_icon_money.png'
import icon_select from '@/static/ic_pop_select_normal.png'
import icon_selected from '@/static/ic_pop_select_selected.png'
import icon_verify from '@/static/icon_verify.png'

const configStore = useConfigStore()
const { isWeChatBrowser, isAlipayClient } = storeToRefs(configStore)
const userStore = useUserStore()
const order = ref()
const info = reactive({
  money: ''
})
const payWay = reactive([
  {
    name: '微信支付',
    icon: icon_wechat,
    // #ifdef H5
    selected: isWeChat(),
    // #endif
    // #ifdef MP-WEIXIN
    selected: true,
    // #endif
    // #ifdef H5
    available: isWeChat(),
    // #endif
    // #ifdef MP-WEIXIN
    available: true,
    // #endif
    payWay: 3
  },
  {
    name: '支付宝支付',
    icon: icon_ali,
    // #ifdef H5
    selected: !isWeChat(),
    // #endif
    // #ifdef MP-WEIXIN
    selected: false,
    // #endif
    // #ifdef H5
    available: !isWeChat(), // !isWeChat()
    // #endif
    // #ifdef MP-WEIXIN
    available: false,
    // #endif
    payWay: 2
  },
  {
    name: '余额支付', // 余额支付通过钱包动态获取，钱包名称可能多样
    icon: icon_hy,
    selected: false,
    available: false,
    payWay: 1
  }
])
const sms_code = ref()
const wallet = ref({})

// 获取订单的钱包规则
async function getWalletRuleList() {
  try {
    const { data } = await moneyApi.walletList({ noPaging: true })
    const res = await productApi.walletRuleList({
      noPaging: true,
      orderId: order.value.id
    })
    if (res.data && res.data.length > 0) {
      const wallet_temp = res.data[0]
      payWay[2].name = wallet_temp.walletRuleName
      if (wallet_temp.uniqueness) {
        // 唯一可用的支付方式uniqueness为true,只显示余额支付
        payWay.forEach((item) => {
          item.available = false
          item.selected = false
        })
        payWay[2].available = true
        payWay[2].selected = true
      } else {
        payWay[2].available = true
      }
      if (data && data.length) {
        // 当前钱包信息
        const w = data.find((item: { walletRuleId: any }) => {
          return item.walletRuleId === wallet_temp.walletRuleId
        })
        if (w) {
          wallet.value = w
        }
        console.log(wallet.value)
      }
    }
  } catch (err) {
    console.log(err)
  }
}
// 单选选择支付方式
function handleSlect(way: { selected: boolean }) {
  payWay.forEach((item) => {
    item.selected = false
  })
  way.selected = true
}
// 发送验证码
const uCode1 = ref()
const codeText = ref('')
async function sendSmsCode() {
  if (uCode1.value[0].canGetCode) {
    try {
      uCode1.value[0].start()
      await baseApi.smsSend({
        type: 6,
        phone: userStore.userInfo.phone
      })
    } catch {}
  }
}
function codeChange(text: string) {
  codeText.value = text
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
      url: `/pages/order/detail?orderId=${order.value.id}`
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
  const selectedPayWay = payWay.find((item) => item.selected)
  if (!selectedPayWay) {
    uni.showToast({
      title: '请选择支付方式',
      icon: 'none'
    })
    return
  }
  const shopId = order.value.orderProductSkus[0].shopId || ''
  const { code, data } = await orderApi.orderPay({
    orderId: order.value.id,
    openId: uni.getStorageSync('openid'),
    // #ifdef H5
    payPlatform: payPlatform_enum.H5,
    // #endif
    // #ifdef MP-WEIXIN
    payPlatform: payPlatform_enum.MP,
    // #endif
    payWay: selectedPayWay?.payWay,
    walletId: wallet.value.id || '',
    code: sms_code.value,
    // #ifdef H5
    returnUrl: shopId
      ? `https://wap.blacksilverscore.com/?redirect_url=/pages/physicalShop/index&qrcode=1&shopId=${shopId}`
      : null
    // #endif
  })
  if (code === 200) {
    if (selectedPayWay?.payWay === 3) {
      const jsonData = data ? JSON.parse(data) : {}
      wxPay(jsonData)
    } else if (selectedPayWay?.payWay === 2) {
      aliPay(data)
    } else {
      jfPay(data)
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
function aliPay(data: string) {
  const div = document.createElement('div')
  div.id = 'formdata'
  div.innerHTML = data
  document.body.appendChild(div)
  const form = document.getElementById('formdata')
  document.forms[0].submit()
  document.body.removeChild(form)
}
function jfPay(data: object) {
  paySuccess()
}
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
    console.log(order.value)
    info.money = order.value.money
    info.moneyUnit = order.value.moneyUnit
    getWalletRuleList()
  }
})
</script>
<template>
  <div class="payment">
    <u-navbar
      back-text=""
      :title="'订单支付'"
      :title-bold="true"
      v-if="!isWeChatBrowser && !isAlipayClient"
    ></u-navbar>
    <view class="money"
      ><text v-if="!info.moneyUnit">￥</text> {{ info.money }}
      <text class="unit" v-if="info.moneyUnit"> {{ info.moneyUnit }}</text>
    </view>
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
            v-if="item.payWay === 1 && item.selected"
          >
            <u-input v-model="sms_code" placeholder="请填写验证码" />
            <template v-slot:right>
              <u-button size="mini" type="success" @click="sendSmsCode">
                {{ codeText }}</u-button
              >
            </template>
            <u-verification-code
              ref="uCode1"
              @change="codeChange"
            ></u-verification-code>
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

    .unit {
      font-size: 30rpx;
    }
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
