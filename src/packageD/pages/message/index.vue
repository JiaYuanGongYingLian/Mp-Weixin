<!-- eslint-disable consistent-return -->
<template>
  <view>
    <u-navbar
      :title="ryStore.pinia_nlist[targetId]?.nickname"
      :background="ryStore.head_background"
      :title-bold="true"
    >
      <view slot="right">
        <u-icon class="u-m-r-30" name="more-dot-fill" size="40"></u-icon>
      </view>
    </u-navbar>
    <view class="cu-chat">
      <view
        class="cu-item"
        :class="item.messageDirection == 1 ? 'self' : ''"
        v-for="(item, index) in list"
        :key="index"
      >
        <u-avatar
          v-if="item.messageDirection == 2"
          :src="ryStore.pinia_nlist[targetId].avatar"
          mode="square"
        ></u-avatar>
        <view class="main">
          <view
            v-if="item.messageType == 'RC:TxtMsg'"
            class="content"
            :style="
              item.messageDirection == 1
                ? 'background-color:rgba(169,234,122)'
                : 'background-color:#FFFFFF;'
            "
          >
            <text>{{ item.content.content }}</text>
          </view>
          <view
            v-if="item.messageType == 'app:hongbao'"
            class="message-red-packet"
            style="background: #f09d47"
            @click="openhb(item.content.content.hongbaoid)"
          >
            <view class="contents">
              <image
                style="z-index: 100"
                src="../../static/img/hongbao.png"
              ></image>
              <view class="packet">{{ item.content.content.ps }}</view>
            </view>
            <view class="footer u-border-top">红包</view>
            <view
              :class="
                item.messageDirection == 1
                  ? 'arrow-org-right'
                  : 'arrow-org-left'
              "
              style="background: #f09d47"
            ></view>
          </view>
        </view>
        <u-avatar
          v-if="item.messageDirection == 1"
          :src="userinfo.avatar"
          mode="square"
        ></u-avatar>
      </view>
    </view>
    <view class="form u-border-top" :style="'bottom:' + bottom">
      <view
        class="u-flex u-m-b-20"
        :class="!show ? 'safe-area-inset-bottom' : ''"
      >
        <u-icon
          class="u-m-r-20"
          name="yuyin"
          custom-prefix="iconfont-sj"
          size="55"
        ></u-icon>
        <u-input
          type="text"
          v-model="value"
          border-color="#ffffff"
          :custom-style="input_style"
          placeholder=""
          confirm-type="send"
          @confirm="submit"
        />
        <u-icon
          class="u-m-l-20"
          name="plus-circle"
          size="50"
          @click="show = !show"
        ></u-icon>
      </view>
    </view>
    <u-popup
      v-model="show"
      mode="bottom"
      length="300"
      :mask="false"
      duration="0"
      @open="showpopup()"
      @close="hidepopup()"
    >
      <view
        class="u-border-top"
        style="
          width: 100%;
          height: 100%;
          background-color: rgba(246, 246, 246, 246);
        "
      >
        <u-grid :col="4" :border="false">
          <u-grid-item
            bg-color="rgba(246, 246, 246, 246)"
            @click="hongbaoshow = !hongbaoshow"
          >
            <u-icon name="red-packet-fill" :size="50"></u-icon>
            <view class="grid-text">红包</view>
          </u-grid-item>
        </u-grid>
      </view>
    </u-popup>
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
          :background="ryStore.head_background"
          :title-bold="true"
          :custom-back="sethongbaoshow"
        ></u-navbar>
        <view class="sendhongbao">
          <view class="item">
            <view class="label">金额</view>
            <view class="content-text">
              <u-input
                type="digit"
                :clearable="false"
                maxlength="10"
                v-model="value2"
                input-align="right"
                placeholder="0.00"
              />
            </view>
            <view class="foot">元</view>
          </view>
          <view class="item" style="height: 130rpx">
            <view class="content-textarea">
              <u-input
                v-model="ps"
                :custom-style="input_style2"
                :auto-height="true"
                type="textarea"
                maxlength="16"
                placeholder-style="font-size: 35rpx;"
                placeholder="恭喜发财,大吉大利"
              />
            </view>
          </view>
          <view class="money">¥ {{ value3.toFixed(2) }}</view>
          <view class="buttom">
            <button :style="[buttomStyle]" class="anniu" @tap="submithb">
              塞钱进红包
            </button>
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
          <view class="title">{{ hongbaoinfo.sendnickname }}发出的红包</view>
          <view class="info">{{ hongbaoinfo.hongbaops }}</view>
        </view>
        <view class="an">
          <view class="an1" @click="receive_hongbao(hongbaoinfo.hongbaoid)"
            >開</view
          >
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { route } from '@/utils/common'
import { useRyStore } from '@/store'
const ryStore = useRyStore()
const WEBIM = {}
const bottom = ref('0rpx')
const show = ref(false)
const hongbaoshow = ref(false)
const openhongbao = ref(false)
const avatar = ref(null)
const nickname = ref(null)
const targetId = ref(null)
const list = ref([])
const value = ref('')
const value2 = ref('')
const value3 = ref(0)
const ps = ref('')
const input_style = reactive({
  height: '80rpx',
  'padding-left': '10rpx',
  'border-radius': '12rpx',
  'background-color': '#ffffff'
})
const input_style2 = reactive({
  'font-size': '35rpx'
})
const hongbaoinfo = reactive({
  hongbaoid: null,
  sendnickname: '',
  hongbaops: ''
})
function amount(val) {
  return val > 0
}
const buttomStyle = computed(() => {
  const style = {}
  if (value2.value && amount(value2.value)) {
    style.backgroundColor = '#da6844'
  }
  return style
})
watch(ryStore, (store) => {
  if (store.pinia_messagelist) {
    console.log('数据更新')
    setTimeout(() => {
      uni.pageScrollTo({
        scrollTop: 99999,
        duration: 0
      })
    }, 50)
  }
})
// watch(value2, (new) => {
//   if(new.value !== '') {
//   const money = Math.floor(new * 100) / 100
//   value2.value = money
//   value3.value = money
// }
// })

// eslint-disable-next-line consistent-return
onLoad(async (opt) => {
  if (!opt?.targetId || !opt?.type) {
    uni.navigateBack()
    return false
  }
  targetId.value = opt.targetId
  list.value =
    ryStore.pinia_messagelist[ryStore.userinfo.id][targetId.value] || []
  console.log(list.value)
  await ryStore.clearMessagesUnreadStatus({
    targetId: targetId.value,
    isGroup: false
  })
  setTimeout(() => {
    uni.pageScrollTo({
      scrollTop: 99999,
      duration: 0
    })
  }, 50)
})
function submit() {
  if (!value.value) {
    return
  }
  WEBIM.send_message(targetId.value, value.value, 'RC:TxtMsg')
  value.value = ''
}
function showpopup() {
  bottom.value = '300rpx'
}
function hidepopup() {
  bottom.value = '0rpx'
}
function sethongbaoshow() {
  value2.value = ''
  value3.value = 0
  ps.value = ''
  hongbaoshow.value = !this.hongbaoshow
}
const uTips = ref()
function submithb() {
  if (value2.value == '') {
    return false
  }
  if (!amount(this.value2)) {
    uTips.value.show({
      title: '金额最高支持两位小数',
      type: 'error',
      duration: '2300'
    })
  }
  // this.$u.api
  //   .sendHB({ to: this.targetId, size: 1, money: this.value2, ps: this.ps })
  //   .then((res) => {
  //     console.log(res)
  //     if (res.code == 1) {
  //       const param = {
  //         hongbaoid: res.data.id,
  //         ps: res.data.ps
  //       }
  //       WEBIM.send_message(this.targetId, param, 'app:hongbao')
  //       this.sethongbaoshow()
  //       this.$u.toast(res.msg)
  //     } else {
  //       this.$refs.uTips.show({
  //         title: res.msg,
  //         type: 'error',
  //         duration: '2300'
  //       })
  //     }
  //   })
  //   .catch((error) => {
  //     this.$refs.uTips.show({
  //       title: '发送失败',
  //       type: 'error',
  //       duration: '2300'
  //     })
  //   })
}
function openhb(e) {
  if (e == '') {
    return false
  }
  // this.$u.api.openisHB({ id: e }).then((res) => {
  //   console.log(res)
  //   if (res.code == 1) {
  //     if (res.data.open == 1) {
  //       route({
  //         url: 'pages/message/hongbao_record',
  //         params: {
  //           id: e
  //         }
  //       })
  //     } else {
  //       this.hongbaoinfo.hongbaoid = e
  //       this.hongbaoinfo.sendnickname = res.data.nickname
  //       this.hongbaoinfo.hongbaops = res.data.ps
  //       this.openhongbao = true
  //     }
  //   } else {
  //     this.$u.toast('红包信息获取失败')
  //   }
  // })
}
function receive_hongbao(e: string) {
  if (e == '') {
    return false
  }
  // this.$u.api.openHB({ id: e }).then((res) => {
  //   console.log(res)
  //   if (res.code == 1) {
  //     this.openhongbao = false
  //     route({
  //       url: 'pages/message/hongbao_record',
  //       params: {
  //         id: e
  //       }
  //     })
  //   } else {
  //     this.$u.toast(res.msg)
  //   }
  // })
}
</script>

<style scoped>
page {
  background-color: rgba(237, 237, 237);
}

.cu-chat {
  display: flex;
  flex-direction: column;
  padding-bottom: 200rpx;
}

.cu-chat .cu-item {
  display: flex;
  padding: 30upx 30upx 0upx;
  position: relative;
}

.cu-chat .cu-item > .cu-avatar {
  width: 80upx;
  height: 80upx;
}

.cu-chat .cu-item > .main {
  max-width: calc(100% - 260upx);
  margin: 0 30upx;
  display: flex;
  align-items: center;
}

.cu-chat .cu-item > image {
  height: 320upx;
}

.cu-chat .cu-item > .main .content {
  padding: 20upx;
  border-radius: 6upx;
  display: inline-flex;
  max-width: 100%;
  align-items: center;
  font-size: 30upx;
  position: relative;
  min-height: 80upx;
  line-height: 40upx;
  text-align: left;
}

.cu-chat .cu-item > .main .content:not([class*='bg-']) {
  background-color: #ffffff;
  color: #333333;
}

.cu-chat .cu-item .date {
  position: absolute;
  font-size: 24upx;
  color: #8799a3;
  width: calc(100% - 320upx);
  bottom: 20upx;
  left: 160upx;
}

.cu-chat .cu-item .action {
  padding: 0 30upx;
  display: flex;
  align-items: center;
}

.cu-chat .cu-item > .main .content::after {
  content: '';
  top: 27upx;
  transform: rotate(45deg);
  position: absolute;
  z-index: 100;
  display: inline-block;
  overflow: hidden;
  width: 24upx;
  height: 24upx;
  left: -12upx;
  right: initial;
  background-color: inherit;
}

.cu-chat .cu-item.self > .main .content::after {
  left: auto;
  right: -12upx;
}

.cu-chat .cu-item > .main .content::before {
  content: '';
  top: 30upx;
  transform: rotate(45deg);
  position: absolute;
  z-index: -1;
  display: inline-block;
  overflow: hidden;
  width: 24upx;
  height: 24upx;
  left: -12upx;
  right: initial;
  background-color: inherit;
  filter: blur(5upx);
  opacity: 0.3;
}

.cu-chat .cu-item > .main .content:not([class*='bg-'])::before {
  background-color: #333333;
  opacity: 0.1;
}

.cu-chat .cu-item.self > .main .content::before {
  left: auto;
  right: -12upx;
}

.cu-chat .cu-item.self {
  justify-content: flex-end;
  text-align: right;
}

.cu-chat .cu-info {
  display: inline-block;
  margin: 20upx auto;
  font-size: 24upx;
  padding: 8upx 12upx;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 6upx;
  color: #ffffff;
  max-width: 400upx;
  line-height: 1.4;
}
</style>
<style lang="scss" scoped>
.form {
  z-index: 999;
  width: 100%;
  height: auto;
  position: fixed;
  padding: 30rpx 30rpx 0 30rpx;
  background-color: rgba(246, 246, 246, 246);
}

.sendhongbao {
  width: 100%;
  height: 100%;
  padding: 30rpx 40rpx;

  .item {
    width: 100%;
    height: 100rpx;
    margin-bottom: 40rpx;
    display: inline-flex;
    background-color: #ffffff;
    border-radius: 12rpx;

    .label {
      padding-left: 20rpx;
      display: inline-flex;
      align-items: center;
      font-size: 35rpx;
    }

    .content-text {
      padding-left: 20rpx;
      display: inline-flex;
      align-items: center;
      position: relative;
      right: -170rpx;
    }

    .content-textarea {
      padding: 10rpx;
      width: 100%;
      font-size: 35rpx;
    }

    .foot {
      padding-left: 20rpx;
      display: inline-flex;
      align-items: center;
      font-size: 35rpx;
      position: relative;
      right: -180rpx;
    }
  }

  .money {
    display: flex;
    margin-top: 50rpx;
    justify-content: center;
    font-size: 80rpx;
    font-weight: bold;
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

.message-red-packet {
  position: relative;
  border-radius: 5rpx;
  background: orange;
  color: #fff;
  text-align: left;
  display: inline-table;
  max-width: 300px;
  min-width: 200px;
  height: 70px;
  box-shadow: 1px 1px 1px 1px #efefef;

  .contents {
    padding: 20rpx;
    display: inline-flex;
    max-width: 100%;
    align-items: center;
    position: relative;
    min-height: 80rpx;
    line-height: 40rpx;
    text-align: left;

    height: 50px;
    color: #fff;

    image {
      width: 70rpx;
      height: 70rpx;
    }
  }

  .packet {
    padding-left: 15rpx;
    font-size: 30rpx;
    font-weight: bold;
  }

  .footer {
    font-size: 23rpx;
    margin-top: 5px;
    height: 20px;
    padding-left: 16px;
    color: #ffffff;
  }
}

.arrow-org-left {
  width: 20px;
  height: 20px;
  background: orange;
  position: absolute;
  left: -5px;
  top: 10px;
  transform: rotate(45deg);
}

.arrow-org-right {
  width: 20px;
  height: 20px;
  background: orange;
  position: absolute;
  right: -5px;
  top: 10px;
  transform: rotate(45deg);
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
@/common/rongYun/webim.js
