<template>
  <view>
    <u-navbar
      title=" "
      :background="backgrounds"
      back-icon-color="#ffffff"
    ></u-navbar>
    <view v-if="loading">
      <view class="head">
        <view class="title"
          >{{
            hongbaoinfo.senduser ? '你' : hongbaoinfo.nickname
          }}发出的红包</view
        >
        <view class="info">{{ hongbaoinfo.ps }}</view>
        <view v-if="hongbaoinfo.type == 1">
          <view class="money" v-if="!hongbaoinfo.senduser"
            >¥{{ hongbaoinfo.moneys }}</view
          >
        </view>
        <view v-if="hongbaoinfo.type == 2">
          <view
            class="money"
            v-if="hongbaoinfo.senduser && hongbaoinfo.moneys != 0"
            >¥{{ hongbaoinfo.moneys }}</view
          >
          <view
            class="money"
            v-if="!hongbaoinfo.senduser && hongbaoinfo.moneys != 0"
            >¥{{ hongbaoinfo.moneys }}</view
          >
        </view>
        <view class="tip" v-if="hongbaoinfo.moneys != 0"
          >已存入钱包，可用于发红包 ></view
        >
      </view>
      <view class="item" v-if="hongbaoinfo.senduser || hongbaoinfo.type == 2">
        <view class="tips" v-if="hongbaoinfo.senduser">
          <view v-if="hongbaoinfo.balancesize == 0">
            {{ hongbaoinfo.size }}个红包共{{ hongbaoinfo.money }}元，已被抢完
          </view>
          <view v-else>
            已领取{{ hongbaoinfo.size - hongbaoinfo.balancesize }}/{{
              hongbaoinfo.size
            }}个
          </view>
        </view>
        <view
          class="tips"
          v-if="!hongbaoinfo.senduser && hongbaoinfo.type == 2"
        >
          <view v-if="hongbaoinfo.size - hongbaoinfo.balancesize != 0">
            领取{{ hongbaoinfo.size - hongbaoinfo.balancesize }}/{{
              hongbaoinfo.size
            }}个
          </view>
          <view v-else> 共{{ hongbaoinfo.size }}个，已被抢完 </view>
        </view>
        <view class="u-border-top u-m-t-20 u-m-b-20"></view>
        <view class="body-item" v-for="(item, index) in hongbaoinfo.log">
          <view class="u-m-t-20" style="position: relative">
            <u-lazy-load
              class="images"
              border-radius="12"
              height="100"
              :image="item.avatar"
              threshold="300"
              img-mode="aspectFill"
            ></u-lazy-load>
          </view>
          <view class="content u-m-t-20">
            <view class="title">
              {{ item.nickname }}
            </view>
            <view class="head_right"> ¥{{ item.money }} </view>
            <view class="item_content text-line-1 u-m-b-5">
              {{ item.time | date('hh:MM') }}
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { route } from '@/utils/common'

export default {
  data() {
    return {
      id: '',
      backgrounds: {
        backgroundColor: '#e1604d'
      },
      loading: false,
      hongbaoinfo: null
    }
  },
  onLoad(opt) {
    const that = this
    this.id = opt.id
    if (!opt.id) {
      uni.navigateBack()
      return false
    }
    uni.showLoading()
    this.$u.api.infoHB({ id: this.id }).then((res) => {
      console.log(res)
      if (res.code == 1) {
        this.hongbaoinfo = res.data
        this.loading = true
        uni.hideLoading()
        console.log(this.hongbaoinfo)
      } else {
        this.$u.toast('红包信息获取失败')
      }
    })
  },
  methods: {}
}
</script>

<style lang="scss">
.head {
  margin-top: 100rpx;
  .title {
    display: flex;
    justify-content: center;
    font-size: 45rpx;
    font-weight: bold;
  }
  .info {
    display: flex;
    justify-content: center;
    color: #c0c4cc;
  }
  .money {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    color: #bea375;
    font-size: 100rpx;
  }
  .tip {
    display: flex;
    justify-content: center;
    color: #bea375;
  }
}

.item {
  margin-top: 100rpx;
  padding: 18rpx;
  .tips {
    color: #909399;
  }
  .body-item {
    display: flex;
    height: auto;
    width: 100%;
    color: #333;
    .content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;
      .title {
        display: flex;
        padding-top: 10rpx;
        font-size: 35rpx;
        line-height: 40rpx;
        font-weight: bold;
      }
      .head_right {
        position: absolute;
        right: 30rpx;
        font-size: 40rpx;
        color: #000000;
      }
      .item_content {
        color: #82848a;
        font-size: 28rpx;
      }
    }
  }
}

.body-item .images {
  width: 100rpx;
  height: 100rpx;
}
</style>
