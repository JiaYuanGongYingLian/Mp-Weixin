<template>
  <view>
    <u-navbar :is-back="false" title="　" :border-bottom="false"></u-navbar>
    <view class="u-flex user-box u-p-l-30 u-p-r-20 u-p-b-30">
      <view class="u-m-r-10">
        <u-avatar :src="userinfo.avatar" size="140"></u-avatar>
      </view>
      <view class="u-flex-1">
        <view class="u-font-18 u-p-b-15">{{ userinfo.nickname }}</view>
        <view class="u-font-14 u-tips-color">ID:{{ userinfo.username }}</view>
      </view>
      <view class="u-m-l-10 u-p-10">
        <u-icon name="scan" color="#969799" size="28"></u-icon>
      </view>
      <view class="u-m-l-10 u-p-10">
        <u-icon name="arrow-right" color="#969799" size="28"></u-icon>
      </view>
    </view>

    <view class="u-m-t-20">
      <u-cell-group>
        <u-cell-item icon="rmb-circle" title="支付"></u-cell-item>
      </u-cell-group>
    </view>

    <!-- <view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item icon="star" title="收藏"></u-cell-item>
				<u-cell-item icon="photo" title="相册"></u-cell-item>
				<u-cell-item icon="coupon" title="卡券"></u-cell-item>
				<u-cell-item icon="heart" title="关注"></u-cell-item>
			</u-cell-group>
		</view> -->

    <view class="u-m-t-20">
      <u-cell-group>
        <u-cell-item icon="setting" title="设置"></u-cell-item>
      </u-cell-group>
    </view>
    <u-tabbar
      v-model="vuex_current"
      :activeColor="vuex_activeColor"
      :list="vuex_tabbar"
      bg-color="rgba(249,249,249)"
    ></u-tabbar>
  </view>
</template>

<script>
import { route } from '@/utils/common'

export default {
  data() {
    return {
      pic: 'http://q1.qlogo.cn/g?b=qq&nk=23898589&s=100',
      show: true
    }
  },
  // onLoad() {
  // 	// console.log(this.vuex_messagelist)
  // 	new
  // },
  onShow() {
    // var date = new Date();
    // this.$u.vuex('vuex_messagelist',date);
    // console.log(date)
  },
  methods: {}
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
