<template>
  <view class="content">
    <text class="iconfont"></text>
    <text class="tit">支付成功</text>

    <view class="btn-group">
      <navigator
        url="/pages/order/index?state=0"
        open-type="redirect"
        class="mix-btn"
        >查看订单</navigator
      >
      <u-button>返回首页</u-button>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.success-icon {
  font-size: 160upx;
  color: #fa436a;
  margin-top: 100upx;
}
.tit {
  font-size: 38upx;
  color: #303133;
}
.btn-group {
  padding-top: 100upx;
}
.mix-btn {
  margin-top: 30upx;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 600upx;
  height: 80upx;
  font-size: 36rpx;
  color: #fff;
  background-color: $base-color;
  border-radius: 10upx;
  &.hollow {
    background: #fff;
    color: #303133;
    border: 1px solid #ccc;
  }
}
</style>
