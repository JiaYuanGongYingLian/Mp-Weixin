<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable radix -->
<!-- eslint-disable no-useless-escape -->
<!-- eslint-disable no-param-reassign -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-13 11:41:12
 * @LastEditTime: 2023-11-02 17:31:50
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
import {
  isWeChat,
  base64ToFile,
  imageUrlToFile,
  wxUploadImage,
  getCookie,
  browserVersion,
  compareVersion
} from '@/utils/common'

const userStore = useUserStore()
const { userInfo, hasLogin } = storeToRefs(userStore)
const deviceInfo = ref({})
const siteInfo = ref({})
const deviceSn = ref('')
const serviceType = ref()
const loading = ref(false)
const checked = ref(false)

async function getDetail() {
  uni.showLoading({
    mask: true
  })
  const { data } = await powerBankApi
    .getDeviceDetail({
      deviceSn: deviceSn.value
    })
    .finally(() => {
      uni.hideLoading()
    })
  deviceInfo.value = data?.device
  siteInfo.value = data?.site
}

const outOrderNo = ref('')
const paymentSubType = ref(4) // h5=4，app=11
async function start() {
  uni.showLoading({
    title: '启动中'
  })
  loading.value = true
  const { data, code, message } = await powerBankApi
    .deviceStart({
      deviceSn: deviceSn.value,
      serviceType: serviceType.value,
      // consumeType: 5, // 没有支付分
      consumeType: 83, // 有支付分
      paymentType: 1,
      paymentSubType: paymentSubType.value,
      orderId: outOrderNo.value
    })
    .finally(() => {
      loading.value = false
      uni.hideLoading()
    })
  if (code === 0) {
    uni.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      confirmText: '确认',
      success: ({ confirm }) => {
        if (confirm) {
          uni.redirectTo({
            url: `/packageB/pages/powerBank/index?env=${env.value}`
          })
        }
      }
    })
  } else {
    uni.showModal({
      title: '提示',
      content: message,
      showCancel: false,
      confirmText: '确认'
    })
  }
}

function jump() {
  uni.navigateTo({
    url: '/packageB/pages/powerBank/mine'
  })
}

const orders = ref()
async function getOrderInProgress() {
  const { data } = await powerBankApi.getCustomerWashingOrders({
    serviceType: serviceType.value
  })
  data.forEach(
    (item: {
      serviceType: any
      text: string
      deviceDetail: { site: { name: any } }
    }) => {
      switch (item?.washOrder?.serviceType) {
        case 8:
          item.text = `充电宝使用中！-${item.deviceDetail?.site?.name}-归还后可继续取出。`
          break
        default:
          item.text = `设备使用中！-${item.deviceDetail?.site?.name}-归还后可继续取出。`
          break
      }
    }
  )
  orders.value = data
}
const env = ref('')
async function queryStart() {
  const { data } = await powerBankApi.queryScoreServiceOrder({
    outOrderNo: outOrderNo.value,
    paymentSubType: paymentSubType.value
  })
  if (data?.state === 'DOING') {
    start()
  } else {
    uni.showToast({
      icon: 'none',
      title: '支付分未授权'
    })
  }
}
/**
 * 跳转微信支付分
 */
function goToWXScore(queryString: any) {
  jWeixin.checkJsApi({
    jsApiList: ['openBusinessView'], // 需要检测的JS接口列表
    success(res: { checkResult: { openBusinessView: any } }) {
      // 以键值对的形式返回，可用的api值true，不可用为false
      // 如：{"checkResult":{"openBusinessView":true},"errMsg":"checkJsApi:ok"}
      if (res.checkResult.openBusinessView) {
        WeixinJSBridge.invoke(
          'openBusinessView',
          {
            businessType: 'wxpayScoreUse',
            queryString
          },
          async (res: { err_code: string }) => {
            // 从支付分返回时会执行这个回调函数
            if (parseInt(res.err_code) === 0) {
              // 返回成功
              queryStart()
            } else {
              // 返回失败
              console.log(res)
              console.log(queryString)
              uni.showToast({
                icon: 'none',
                title: '支付分授权失败'
              })
            }
          }
        )
      }
    }
  })
}

async function getWxPayScore() {
  if (!checked.value) {
    uni.showToast({
      icon: 'none',
      title: '请勾选委托扣款授权书'
    })
    return
  }
  if (browserVersion().isHeiyin) {
    // ios client
    window.JSBridge.invoke('CallWXScoreService', {
      bridgeName: 'deviceStart',
      paymentSubType: paymentSubType.value
    })
    return
  }
  const { data } = await powerBankApi.createScoreServiceOrder({
    paymentSubType: paymentSubType.value
  })
  const wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i)
  const wechatVersion = wechatInfo[1]
  if (compareVersion(wechatVersion, '7.0.5') >= 0) {
    const obj = {
      mch_id: data.mchId,
      package: data.package,
      timestamp: data.timestamp,
      nonce_str: data.nonceStr,
      sign_type: data.signType,
      sign: data.sign
    }
    outOrderNo.value = data.outOrderNo
    const paramsArray: string[] = []
    Object.keys(obj).forEach(
      (key) => obj[key] && paramsArray.push(`${key}=${obj[key]}`)
    )
    goToWXScore(`${paramsArray.join('&')}`)
  } else {
    // 提示用户升级微信客户端版本
    window.href =
      'https://support.weixin.qq.com/cgi-bin/readtemplate?t=page/common_page__upgrade&text=text005&btn_text=btn_text_0'
  }
}
function toAuthLetter() {
  uni.navigateTo({
    url: '/packageB/pages/powerBank/authLetter'
  })
}
function refresh() {
  window.location.reload()
}
const mask = ref(false)
onLoad((option) => {
  deviceSn.value = option?.deviceSn
  serviceType.value = option?.serviceType
  console.log('deviceSn==>', deviceSn.value)
  console.log('serviceType==>', serviceType.value)
  const isApp = option?.from || browserVersion().isHeiyin
  console.log('isApp==>', isApp)

  if (isApp) {
    // #ifdef H5
    console.log('前端注册回调时机==>', new Date())
    window.JSBridge.registerEvent('HYUserEvent', () => {
      getDetail()
      getOrderInProgress()
    })
    window.JSBridge.registerEvent(
      'deviceStart',
      (data: { outOrderNo: string }) => {
        outOrderNo.value = data.outOrderNo
        queryStart()
      }
    )
    env.value = 'app'
    paymentSubType.value = 1
    // #endif
  } else {
    // mask.value = true
    // 李总的需求，只通过APP扫码取设备
    getDetail()
    getOrderInProgress()
  }
})
</script>
<template>
  <view class="container">
    <view class="topBox">
      <view class="action">
        <u-icon color="#fff" :size="40" name="reload" @click="refresh"></u-icon>
        <view class="mine" @click="jump">
          <u-image
            width="50rpx"
            height="50rpx"
            src="https://image.blacksilverscore.com/uploads/6844def4-1bf8-40ce-8995-a0043bf8e5cf.png"
          ></u-image>
        </view>
      </view>
      <view class="tit">{{ siteInfo.name }}</view>
      <view class="wrap">
        <view>设备使用说明：</view>
        <view>1.设备弹出后开始计费</view>
        <view>2.使用完毕后归还设备，结束计费</view>
        <view>计费规则：</view>
        <view>1.前24小时免费，超过24小时后2元一个小时</view>
        <view>2.日封顶30元，总封顶99元</view>
      </view>
    </view>
    <!-- <view class="section">
      <view class="tit">支付方式说明</view>
      <view> 余额:余额中扣除费用 </view>
      <view> 优惠券:优惠券在洗车过程中会被优先抵扣使用 </view>
    </view> -->
    <view class="img_box">
      <image
        src="https://image.blacksilverscore.com/uploads/88b4d5ba-0361-4482-85bf-fc449361f0ae.jpg"
        mode="scaleToFill"
        class="img"
      />
    </view>
    <view class="btn_wrap">
      <view class="order_tips" v-for="(item, index) in orders" :key="index">
        <u-notice-bar
          mode="horizontal"
          :list="[item.text]"
          :volume-icon="false"
          :more-icon="true"
        ></u-notice-bar>
      </view>
      <!-- <u-button
        ripple
        :hair-line="false"
        class="btn"
        :custom-style="{ background: '#50939c', color: '#fff' }"
        @click="start"
        :loading="loading"
        :disabled="orders?.length > 0"
        >点击取出充电宝</u-button
      > -->
      <u-button
        ripple
        :hair-line="false"
        class="btn"
        :custom-style="{ background: '#50939c', color: '#fff' }"
        @click="getWxPayScore"
        :loading="loading"
        :disabled="orders?.length > 0"
      >
        免押租借
      </u-button>
      <view class="tips"
        ><u-icon
          size="46"
          name="https://image.blacksilverscore.com/uploads/c1f45d56-0d6c-4308-8f77-0203209b4d05.png"
          mr3
          style="margin-right: 10rpx"
        ></u-icon>
        <text>微信⽀付分|550及以上有机会免押</text>
      </view>
      <view class="check">
        <u-checkbox v-model="checked" :label-size="26">
          勾选表示同意<text style="color: #65a674" @click="toAuthLetter"
            >《委托扣款授权书》</text
          ></u-checkbox
        >
      </view>
    </view>
    <u-popup
      v-model="mask"
      :mask-close-able="false"
      :border-radius="12"
      mode="center"
      width="400rpx"
      height="200rpx"
    >
      <view class="mask_tips"> 请使用黑银APP扫码 </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #fff;

  .topBox {
    background: #50939c;
    padding: 40rpx;

    .tit {
      font-size: 36rpx;
      color: #fff;
    }

    .wrap {
      background: rgba(255, 255, 255, 0.4);
      border-radius: 20rpx;
      color: #fff;
      padding: 10rpx 20rpx;
      line-height: 44rpx;
      margin-top: 20rpx;
      font-size: 26rpx;
    }

    .action {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      align-items: center;
    }
  }

  .section {
    padding: 30rpx;
    line-height: 50rpx;
  }

  .img_box {
    .img {
      width: 100%;
      margin-top: 100rpx;
    }
  }
}

.btn_wrap {
  margin: 30rpx 30rpx 0 30rpx;
  padding-bottom: 80rpx;
  .btn {
    // position: absolute;
    bottom: 0;
    left: 0;
    // width: 100%;
    height: 100rpx;
    border-radius: 20rpx;
  }

  :deep(.u-btn--default--disabled) {
    opacity: 0.5;
  }

  .order_tips {
    margin-bottom: 30rpx;
  }
}
.check {
  text-align: center;
  margin-top: 30rpx;
  font-size: 24rpx;
}
.mask_tips {
  text-align: center;
  font-size: 30rpx;
  font-weight: bold;
  margin-top: 60rpx;
}
.tips {
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30rpx;
}
</style>
