<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, getDistances, checkLoginState } from '@/utils/index'

const store = useUserStore()
const { userInfo, wxUserInfo, hasLogin } = storeToRefs(store)
const info = ref()
function goUrlFn(e: { currentTarget: { dataset: { url: any } } }) {
  const { url } = e.currentTarget.dataset
  if (checkLoginState()) {
    if (url) {
      uni.navigateTo({
        url
      })
    }
  }
}
onLoad((option) => {})
</script>
<template>
  <div class="mine">
    <view class="headerBox">
      <image
        class="bg"
        mode="widthFix"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/extension_bg_01.png"
      ></image>
      <view class="city">
        <view class="areaBox">
          <view class="left">
            <image
              class="extensionIcon"
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/extension_icon_01.png"
            ></image>
            <view class="extensionText">升级城市推广大使，享受最高权益…</view>
          </view>
          <view class="right">
            <view>去咨询</view>
            <image
              class="pic"
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/icon_43.png"
            ></image>
            <button class="service" open-type="contact">客服</button>
          </view>
        </view>
      </view>
    </view>
    <view class="contentBox">
      <view class="user">
        <!--已登录-->
        <view class="top">
          <view
            class="imgBox"
            @tap="goUrlFn"
            :data-url="
              '/pages/mine/patientInfo?id=' +
              userInfo.userId +
              '&type=' +
              userNowType
            "
          >
            <image
              mode="aspectFill"
              :src="
                userInfo.avatar ||
                wxUserInfo.avatarUrl ||
                'https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/img_user.png'
              "
            ></image>
          </view>
          <view class="right">
            <view class="name" v-if="hasLogin">
              <view class="leftName">{{ userInfo.nickName }} </view>
            </view>
            <view v-else class="name" @tap="goUrlFn" :data-url="false">{{
              '点击登录'
            }}</view>
          </view>
        </view>
        <view class="labelBox">
          <view class="item" data-url="/pages/mine/myBalance" @tap="goUrlFn">
            <view class="con">{{ 11 }}</view>
            <view class="name">余额</view>
          </view>
          <view class="border"></view>

          <view class="item" data-url="/packageB/myCoupon" @tap="goUrlFn">
            <view class="con">{{ 11 }}</view>
            <view class="name">黑银积分</view>
          </view>
        </view>
      </view>

      <view class="myBox myOrder">
        <view class="box">
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageA/order/order?id=1"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_01.png"
            ></image>
            待付款
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageA/order/order?id=2"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_02.png"
            ></image>
            待发货
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageA/order/order?id=3"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_03.png"
            ></image>
            待收货
          </view>
          <view
            class="bar commentBox"
            @tap="goUrlFn"
            data-url="/packageA/order/order?id=0"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_04.png"
            ></image>
            全部订单
          </view>
        </view>
      </view>
      <view class="myBox healthTool tool">
        <view class="box">
          <view class="bar" @tap="goUrlFn" data-url="/pages/setting/index">
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/mine_icon_08.png"
            ></image
            >设置
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<style lang="scss" scoped>
.mine {
  min-height: 100vh;
  background-color: #f7f7f7;
  position: relative;
  padding-bottom: 100rpx;

  .headerBox {
    position: relative;
    z-index: 1;

    .bg {
      display: block;
      width: 100%;
    }

    .city {
      width: 100%;
      left: 0;
      bottom: 284rpx;
      padding: 0 32rpx;
      box-sizing: border-box;
      position: absolute;

      .areaName {
        display: block;
        height: 40rpx;
        margin-bottom: 48rpx;
      }

      .areaBox {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .left {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          position: relative;
          z-index: 2;
          opacity: 0.7;

          .name {
            color: #fff;
            font-size: 28rpx;
          }

          .area {
            color: #fff;
            font-size: 28rpx;
            width: 330rpx;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .pic {
            width: 12rpx;
            height: 32rpx;
            margin: 0 8rpx;
          }

          .extensionIcon {
            width: 40rpx;
            height: 40rpx;
          }

          .extensionText {
            color: #fff;
            font-size: 28rpx;
            margin-left: 8rpx;
          }
        }

        .right {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          color: #ffd79a;
          font-size: 28rpx;
          position: relative;
          z-index: 2;

          .pic {
            width: 32rpx;
            height: 32rpx;
          }

          .service {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 2;
            opacity: 0;
          }
        }
      }

      .quick {
        display: flex;
        justify-content: flex-start;
        align-items: center;

        .pic {
          width: 68rpx;
          height: 32rpx;
        }

        .p {
          margin-left: 4rpx;
          width: 566rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #fff;
          font-size: 28rpx;
          opacity: 0.7;
        }
      }
    }
  }

  .contentBox {
    position: relative;
    z-index: 2;
    top: -248rpx;
  }

  .user {
    width: 686rpx;
    border-radius: 24rpx;
    margin: 0 auto;
    z-index: 3;
    padding: 48rpx 32rpx;
    position: relative;
    background-color: #fff;

    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 3;

      .imgBox {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;

        image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .right {
        width: calc(100% - 240rpx);
        margin-left: 30rpx;
        position: relative;

        .name {
          font-size: 40rpx;
          font-weight: bolder;
          color: #262626;
          padding-right: 200rpx;
          display: flex;
          flex-direction: row;
          align-items: flex-end;
          position: relative;

          .leftName {
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            position: relative;

            .iconBox {
              position: absolute;
              width: 112rpx;
              height: 36rpx;
              top: 0;
              right: 0;
              bottom: 0;
              margin: auto;

              .icon {
                display: block;
                width: 112rpx;
                height: 36rpx;
              }
            }
          }

          .vipTag {
            display: inline-block;
            width: 60rpx;
            text-align: center;
            font-size: 20rpx;
          }
        }

        .job {
          padding-top: 10rpx;
          position: relative;
          display: flex;
          justify-content: flex-start;
          align-items: center;

          .fileIcon {
            width: 40rpx;
            height: 40rpx;
          }

          .file {
            margin-left: 8rpx;
            color: #636366;
            font-size: 28rpx;
          }

          .vipIcon {
            display: block;
            width: 60rpx;
            height: 60rpx;
            position: relative;
            z-index: 4;
          }

          .tag {
            background: linear-gradient(
              90deg,
              #f2dcc3 0%,
              #e6c19c 75%,
              #e5c09a 100%
            );
            border-radius: 0 26rpx 26rpx 0;
            padding: 0 20rpx 0 20rpx;
            max-width: 320rpx;
            height: 40rpx;
            line-height: 40rpx;
            box-sizing: border-box;
            font-size: 24rpx;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-left: -18rpx;
            z-index: 3;
          }

          .edit {
            display: inline-block;
            margin-right: 20rpx;
            font-size: 26rpx;
            color: #a3a9ad;
            vertical-align: 12rpx;
            font-weight: normal;
          }
        }

        .setting {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          margin: auto;
          color: #222;
          font-size: 24rpx;
          width: 135rpx;
          height: 116rpx;
          display: flex;
          align-items: center;
          text-align: center;

          .coin {
            font-size: 48rpx;
            font-weight: bold;
            height: 58rpx;
            line-height: 58rpx;
          }

          .coinName {
            height: 58rpx;
            line-height: 58rpx;
          }

          image {
            display: inline-block;
            width: 12rpx;
            height: 20rpx;
            margin-left: 20rpx;
          }
        }

        .content {
          font-size: 24rpx;
          color: #b5b5b5;
          margin-top: 10rpx;

          image {
            display: inline-block;
            width: 32rpx;
            height: 32rpx;
            margin-right: 10rpx;
            vertical-align: -4rpx;
          }

          .copy {
            display: inline-block;
            border: 2rpx solid #b5b5b5;
            border-radius: 20rpx;
            padding: 4rpx 30rpx;
            color: #b5b5b5;
            font-size: 24rpx;
            margin-left: 20rpx;
          }
        }
      }
    }

    .labelBox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 34rpx;

      .item {
        max-width: 25%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
      }

      .border {
        width: 1rpx;
        height: 20rpx;
        background-color: #a3a3ad;
      }

      .con {
        font-size: 40rpx;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: bold;
        color: #262626;
        line-height: 56rpx;
      }

      .name {
        font-size: 26rpx;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #242426;
        line-height: 37rpx;
      }
    }
  }

  .myBox {
    width: 690rpx;
    margin: 0 auto;
    margin-top: 32rpx;
    border-radius: 24rpx;
    background-color: #fff;
    position: relative;
    z-index: 3;
    padding: 43rpx 0;

    .h2 {
      font-size: 36rpx;
      color: #222;
      font-weight: bold;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 30rpx;
    }

    .box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;

      .bar {
        width: 25%;
        text-align: center;
        font-size: 26rpx;
        color: #242426;
        position: relative;

        > image {
          display: block;
          width: 48rpx;
          height: 48rpx;
          margin: 0 auto;
          margin-bottom: 17rpx;
        }

        .feedback {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
          opacity: 0;
        }

        .num {
          width: 36rpx;
          height: 36rpx;
          text-align: center;
          line-height: 36rpx;
          border-radius: 50%;
          position: absolute;
          top: -20rpx;
          right: -36rpx;
          left: 0;
          margin: auto;
          background-color: #ff4233;
          color: #fff;
          font-size: 22rpx;
        }

        .numExceed {
          width: 61rpx;
          height: 36rpx;
          text-align: center;
          line-height: 36rpx;
          border-radius: 18rpx;
          position: absolute;
          top: -20rpx;
          right: -56rpx;
          left: 0;
          margin: auto;
          background-color: #ff4233;
          color: #fff;
          font-size: 22rpx;
        }
      }

      .couponBox {
        position: relative;

        .couponCount {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 60rpx;
          right: 0;
          margin: 0 auto;
          background-color: #ff4d4d;
          color: #ffffff;
          width: 30rpx;
          height: 30rpx;
          border-radius: 30rpx;
          font-size: 20rpx;
        }
      }

      .commentBox {
        position: relative;

        .commentCount {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 60rpx;
          right: 0;
          margin: 0 auto;
          background-color: #ff4d4d;
          color: #ffffff;
          width: 30rpx;
          height: 30rpx;
          border-radius: 30rpx;
          font-size: 20rpx;
        }
      }
    }

    .top {
      border-bottom: 2rpx solid #f5f5f5;
      margin-bottom: 20rpx;
      padding-bottom: 20rpx;
    }
  }
}
</style>