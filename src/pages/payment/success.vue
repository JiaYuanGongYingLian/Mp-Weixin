<template>
  <view class="content">
    <text class="iconfont hy-icon-paySuccess"></text>
    <text class="tit">支付成功</text>

    <view class="btn-group">
      <!-- <navigator
        url="/pages/order/index?state=0"
        open-type="redirect"
        class="mix-btn"
        >查看订单</navigator
      > -->
      <u-button @click="handleClick" type="success">返回首页</u-button>
    </view>
  </view>
</template>

<script setup lang="ts">
function handleClick() {
  uni.redirectTo({
    url: '/pages/launch/index'
  })
}
</script>

<style lang="scss">
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.hy-icon-paySuccess {
  color: #19be6b;
  font-size: 160rpx;
  margin-top: 100rpx;
}
.tit {
  font-size: 38upx;
  color: #303133;
  margin-top: 20rpx;
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
  border-radius: 10upx;
  &.hollow {
    background: #fff;
    color: #303133;
    border: 1px solid #ccc;
  }
}

</style>
