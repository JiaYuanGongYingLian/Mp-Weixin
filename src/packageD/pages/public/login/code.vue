<template>
  <view class="wrap">
    <view class="key-input">
      <view class="title">输入验证码</view>
      <view class="tips">验证码已发送至 {{ phone }}</view>
      <u-message-input
        :focus="true"
        :value="value"
        @change="change"
        @finish="finish"
        mode="bottomLine"
        :maxlength="maxlength"
      ></u-message-input>
      <text :class="{ error: error }">验证码错误，请重新输入</text>
      <view class="captcha">
        <text :class="{ noCaptcha: show }" @tap="noCaptcha"
          >收不到验证码点这里</text
        >
        <text :class="{ regain: !show }">{{ second }}秒后重新获取验证码</text>
      </view>
    </view>
  </view>
</template>

<script>
import { route } from '@/utils/common'
import { WEBIM } from '@/packageD/common/webim.js';

export default {
  data() {
    return {
      phone: '',
      maxlength: 4,
      value: '',
      second: 60,
      show: false,
      error: false
    }
  },
  computed: {},
  onLoad(opt) {
    if (opt.phone == '') {
      uni.navigateBack()
      return false
    }
    this.phone = opt.phone
    // this.getCaptcha()
    this.jishi()
  },
  methods: {
    // 收不到验证码选择时的选择
    noCaptcha() {
      const that = this
      uni.showActionSheet({
        itemList: ['重新获取验证码'],
        success(res) {
          that.$u.api
            .getLogincode({ mobile: that.phone, event: 'mobilelogin' })
            .then((res) => {
              if (res.code == 1) {
                that.jishi()
                that.$u.toast(res.msg)
              } else {
                that.$u.toast(res.msg)
              }
            })
        },
        fail(res) {}
      })
    },
    // change事件侦听
    change(value) {
      // console.log('change', value);
    },
    // 输入完验证码最后一位执行
    async finish(value) {
      const that = this
      if (!value) {
        this.$u.toast('请输入验证码')
      }
      const res = await this.$u.api.mobilelogin({
        mobile: this.phone,
        captcha: value
      })
      if (res.code == 1) {
        that.$u.vuex('userinfo', res.data.userinfo)
        const { id } = res.data.userinfo
        if (!this.pinia_messagelist.id) {
          that.$u.vuex(`pinia_messagelist.${id}`, {})
        }
        if (!this.pinia_latestConversationList.id) {
          that.$u.vuex(`pinia_latestConversationList.${id}`, [])
        }
        await this.$u.api.getfriendlist().then((res) => {
          console.log('更新好友数据')
          if (res.code == 1) {
            const { friends } = res.data
            const letterArr = friends.map((val) => {
              return val.letter
            })
            const list = { letterArr, list: friends }
            this.$u.vuex('pinia_nlist', res.data.nlist)
            this.$u.vuex('pinia_indexList', list)
            this.$u.vuex('pinia_addfriendslist', res.data.addfriends)
          }
        })
        await this.$u.api.getGrouplist().then((res) => {
          console.log('更新群组数据')
          if (res.code == 1) {
            this.$u.vuex('pinia_grouplist', res.data)
          }
        })
        await WEBIM.rongInit(res.data.userinfo.imtoken)
        this.$u.vuex('pinia_home_loading', true)
        uni.switchTab({
          url: '/pages/index/home'
        })
      } else {
        that.$u.toast(res.msg)
      }
    },
    jishi() {
      this.show = false
      this.error = false
      this.second = 60
      const interval = setInterval(() => {
        this.second--
        if (this.second <= 0) {
          this.show = true
          if (this.value.lenth != 4) {
            this.error = true
          }
          clearInterval(interval)
        }
      }, 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  padding: 80rpx;
}

.box {
  margin: 30rpx 0;
  font-size: 30rpx;
  color: 555;
}

.key-input {
  padding: 30rpx 0;
  text {
    display: none;
  }
  .error {
    display: block;
    color: red;
    font-size: 30rpx;
    margin: 20rpx 0;
  }
}

.title {
  font-size: 50rpx;
  color: #333;
}

.key-input .tips {
  font-size: 30rpx;
  color: #333;
  margin-top: 20rpx;
  margin-bottom: 60rpx;
}
.captcha {
  color: $u-type-warning;
  font-size: 30rpx;
  margin-top: 40rpx;
  .noCaptcha {
    display: block;
  }
  .regain {
    display: block;
  }
}
</style>
