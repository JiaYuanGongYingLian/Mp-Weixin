<template>
  <view>
    <u-navbar title=" " :border-bottom="false"></u-navbar>
    <view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30 u-p-t-30">
      <view class="u-m-r-10">
        <u-avatar :src="user.avatar" size="140"></u-avatar>
      </view>
      <view class="u-flex-1 u-m-l-20">
        <view class="u-font-18 u-p-b-15">{{ user.nickname }}</view>
        <view class="u-font-14 u-tips-color">ID:{{ user.username }}</view>
      </view>
    </view>
    <view class="u-m-t-20">
      <view
        style="
          background-color: #ffffff;
          height: 80rpx;
          width: 100%;
          text-align: center;
          font-weight: bold;
          padding-top: 20rpx;
        "
        v-if="user.friends"
      >
        <text>发送消息</text>
      </view>
      <view v-else>
        <view
          v-if="type == 1"
          style="
            background-color: #ffffff;
            height: 80rpx;
            width: 100%;
            text-align: center;
            font-weight: bold;
            padding-top: 20rpx;
          "
          @click="add"
        >
          <text>添加好友</text>
        </view>
        <view
          v-if="type == 2"
          style="
            background-color: #ffffff;
            height: 80rpx;
            width: 100%;
            text-align: center;
            font-weight: bold;
            padding-top: 20rpx;
          "
          @click="agree_add"
        >
          <text>同意添加</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: null,
      type: 1
    }
  },
  onLoad(opt) {
    console.log(opt)
    if (!this.pinia_user || !opt.type) {
      uni.navigateBack()
      return false
    }
    this.user = this.pinia_user
    this.type = opt.type
  },
  methods: {
    add() {
      // console.log(this.pinia_user.id)
      this.$u.api.addfriends({ adduser: this.pinia_user.id }).then((res) => {
        console.log(res)
        // if(res.code == 1){
        // 	this.$u.vuex('pinia_user', res.msg);
        // 	route({
        // 		url: 'pages/public/user/usercard'
        // 	})
        // }else{
        // 	this.$u.toast("用户不存在");
        // }
      })
    },
    agree_add() {
      // console.log(this.user)
      this.$u.api.acceptfriend({ userid: this.user.id }).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="scss">
page {
  background-color: #ededed;
}

.camera {
  width: 54px;
  height: 44px;

  &:active {
    background-color: #ededed;
  }
}
.user-box {
  background-color: #fff;
}
</style>
