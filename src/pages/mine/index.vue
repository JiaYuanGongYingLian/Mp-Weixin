<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-param-reassign -->
<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { onLoad, onShow, onReady, onPullDownRefresh } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { useUserStore, useConfigStore } from '@/store'
import { moneyApi, productApi, userApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import hyTabBar from '@/components/hy-tabbar/index.vue'
import { isEmptyObject } from '@/utils/common'

const userStore = useUserStore()
const configStore = useConfigStore()
const { userInfo, wxUserInfo, hasLogin, walletList, currentShop } =
  storeToRefs(userStore)
const { isStoreUiModel } = storeToRefs(configStore)
const { enterByStoreQrcode } = storeToRefs(configStore)
const moneyInfo = ref([
  {
    money: 0,
    walletRuleId: 1,
    name: '余额钱包'
  },
  {
    money: 0,
    walletRuleId: 7,
    name: '积分'
  }
])
moneyInfo.value.forEach((e) => {
  e.money = computed(() => {
    const money = walletList.value.find(
      (item) => item.walletRuleId === e.walletRuleId
    )?.money
    return money || 0
  })
})
const tabList = ref([
  {
    iconPath: '/static/icon/ic_bar_main_pg.png',
    selectedIconPath: '/static/icon/ic_bar_main_page_checked.png',
    hy_path: '/pages/physicalShop/index',
    text: '首页'
  },
  {
    iconPath: '/static/icon/ic_bar_mine.png',
    selectedIconPath: '/static/icon/ic_bar_mine_checked.png',
    hy_pagePath: '/pages/mine/index',
    text: '我的'
  }
])
const currentTabbar = ref(1)
function goUrlFn(e: { currentTarget: { dataset: { url: any } } }) {
  const { url } = e.currentTarget.dataset
  if (userStore.checkLoginState()) {
    if (url) {
      uni.navigateTo({
        url
      })
    }
  }
}
// 切换tab
function handleTabBarChange(index: any) {
  const toPage = tabList.value[index]
  if (toPage.hy_pagePath) {
    uni.switchTab({
      url: toPage.hy_pagePath
    })
  } else if (uni.getStorageSync('shopFullPath')) {
    uni.redirectTo({ url: uni.getStorageSync('shopFullPath') })
  } else {
    uni.redirectTo({
      url: toPage.hy_path
    })
  }
}

async function getMoney() {
  if (hasLogin.value && !walletList.value.length) {
    const { data } = await moneyApi.walletList({ noPaging: true })
    userStore.syncSetWalletList(data)
  }
}

const myShopList = ref([])
const showPicker = ref(false)
const shopStatisticsInfo = ref({})
async function getShopList() {
  const { data } = await productApi.getShopList({
    nopaging: true,
    shopType: 3,
    userId: userInfo.value?.id,
    status: 20,
    otherColumns: 'vipReserve'
  })
  if (data && data.records.length > 0) {
    myShopList.value = data.records
    userStore.syncSetMyShopList(myShopList.value)
    if (myShopList.value.length > 0 && isEmptyObject(currentShop.value)) {
      userStore.syncSetCurrentShop(myShopList.value[0])
    }
    getShopStatisticsInfo()
  }
}
function changeShop(e: any[]) {
  const i = e[0]
  const shop = myShopList.value[i]
  userStore.syncSetCurrentShop(shop)
}
watch(currentShop, (newValue, oldValue) => {
  if (newValue) {
    getShopStatisticsInfo()
  }
})
// 切换界面模式
function changeModel() {
  if (isStoreUiModel.value) {
    configStore.setUiModel('user')
  } else {
    configStore.setUiModel('store')
    getShopStatisticsInfo()
  }
  uni.pageScrollTo({
    scrollTop: 0,
    duration: 300
  })
}
// 获取商户红包券信息
async function getShopStatisticsInfo() {
  if (currentShop.value && currentShop.value.id) {
    const { data } = await productApi.shopStatisticsInfo({
      shopId: currentShop.value.id
    })
    shopStatisticsInfo.value = data
  }
}
onShow(() => {
  if (hasLogin.value) {
    getMoney()
    getShopList()
  }
})
onPullDownRefresh(() => {
  setTimeout(async () => {
    getMoney()
    uni.stopPullDownRefresh()
  }, 1000)
})
</script>
<template>
  <div class="mine">
    <view class="headerBox">
      <image
        class="bg"
        mode="widthFix"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/extension_bg_01.png"
      ></image>
      <view class="city"></view>
    </view>
    <view class="contentBox">
      <view class="user">
        <!--已登录-->
        <view class="top">
          <!-- #ifdef H5 -->
          <view class="imgBox" @tap="goUrlFn">
            <image
              mode="aspectFill"
              :src="
                getImgFullPath(
                  userInfo?.avatar ||
                    wxUserInfo?.headimgurl ||
                    wxUserInfo?.avatarUrl ||
                    'https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/img_user.png'
                )
              "
            ></image>
          </view>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <u-avatar
            :src="getImgFullPath(userInfo?.avatar)"
            v-if="userInfo?.avatar"
          ></u-avatar>
          <view v-else class="avatar">
            <open-data type="userAvatarUrl"></open-data>
          </view>
          <!-- #endif -->
          <view class="right">
            <view class="name" v-if="hasLogin">
              <view class="leftName"
                >{{ userInfo?.username || wxUserInfo.nickname }}
              </view>
            </view>
            <view v-else class="name" @tap="goUrlFn" :data-url="false">{{
              '点击登录'
            }}</view>
            <u-picker
              mode="selector"
              v-model="showPicker"
              :default-selector="[0]"
              :range="myShopList"
              @confirm="changeShop"
              range-key="name"
            ></u-picker>
          </view>
        </view>
        <view class="labelBox" v-if="!isStoreUiModel">
          <view class="item" data-url="/pages/mine/myBalance" @tap="goUrlFn">
            <view class="con">{{ hasLogin ? moneyInfo[0].money : '--' }}</view>
            <view class="name">余额</view>
          </view>
          <view class="border"></view>

          <view class="item" data-url="/packageB/myCoupon" @tap="goUrlFn">
            <view class="con">{{ hasLogin ? moneyInfo[1].money : '--' }}</view>
            <view class="name">积分</view>
          </view>
        </view>
      </view>
      <!-- 商家红包券 -->
      <view class="myBox" v-if="isStoreUiModel">
        <view class="dataBox">
          <view class="item">
            <view class="num">{{
              shopStatisticsInfo.couponTodayCountCompleted
            }}</view>
            <view class="name">核券次数(日)</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponMonthCountCompleted }}
            </view>
            <view class="name">核券次数(月)</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponTotalCountCompleted }}
            </view>
            <view class="name">核券次数(历史)</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponTodayMoneyCompleted }}
            </view>
            <view class="name">核券金额(日)</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponMonthMoneyCompleted }}
            </view>
            <view class="name">核券金额(月)</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponTotalMoneyCompleted }}
            </view>
            <view class="name">核券金额(历史)</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponUserCountCompleted }}
            </view>
            <view class="name">核券人数</view>
          </view>
          <view class="item">
            <view class="num">
              {{ shopStatisticsInfo.couponUserRepurchaseRateCompleted }}
            </view>
            <view class="name">复购率</view>
          </view>
        </view>
        <view class="box">
          <!-- <view class="bar" data-url="/pages/storeVip/index" @tap="goUrlFn">
            <u-icon
              custom-prefix="custom-icon"
              name="goumai"
              size="36"
            ></u-icon>
            <text>购买VIP</text>
          </view>
          <view class="bar" data-url="/pages/storeVip/share" @tap="goUrlFn">
            <u-icon custom-prefix="custom-icon" name="VIP" size="40"></u-icon>
            <text>赠送VIP</text>
          </view>
          <view class="bar" data-url="/pages/vip/index" @tap="goUrlFn">
            <u-icon
              custom-prefix="custom-icon"
              name="youhuiquan"
              size="40"
            ></u-icon>
            <text>门店发券</text>
          </view>
          <view class="bar">
            <u-icon
              custom-prefix="custom-icon"
              name="waihuimaimai"
              size="40"
            ></u-icon>
            <text>门店买券</text>
          </view> -->
        </view>
      </view>

      <view class="myBox myOrder">
        <view class="box">
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageB/pages/order/index?status=10"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_01.png"
            ></image>
            待付款
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageB/pages/order/index?status=20"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_03.png"
            ></image>
            待收货
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageB/pages/order/index?status=60"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/mine/icon_order_02.png"
            ></image>
            已完成
          </view>
          <view
            class="bar commentBox"
            @tap="goUrlFn"
            data-url="/packageB/pages/order/index?status=0"
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
          <!-- <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageA/pages/famousOrder/index"
            v-if="configStore.videoPageOpen"
          >
            <image
              src="https://image.blacksilverscore.com/uploads/516fd61d-c1d3-4878-815e-26ed4d216502.png"
            ></image
            >我对接的
          </view>
          <view
            class="bar reverse"
            @tap="goUrlFn"
            data-url="/packageA/pages/famousOrder/index?passive=true"
            v-if="configStore.videoPageOpen"
          >
            <image
              src="https://image.blacksilverscore.com/uploads/516fd61d-c1d3-4878-815e-26ed4d216502.png"
            ></image
            >对接我的
          </view> -->
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageA/pages/message/index"
            v-if="configStore.videoPageOpen"
          >
            <image
              src="https://image.blacksilverscore.com/uploads/9a62ef97-4a3c-4107-8f4b-abf65f6d1f85.png"
            ></image
            >消息
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageB/pages/setting/index"
          >
            <image
              src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/mine_icon_08.png"
            ></image
            >设置
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageC/pages/myShop/index"
            v-if="myShopList.length > 0"
          >
            <u-icon
              custom-prefix="custom-icon"
              name="wodedianpu"
              size="52"
              color="#FEA917"
              class="icon"
            ></u-icon>
            我的店铺
          </view>
          <view
            class="bar"
            @tap="goUrlFn"
            data-url="/packageC/pages/shopEnter/index"
          >
            <u-icon
              custom-prefix="custom-icon"
              name="shangjiaruzhu"
              size="52"
              color="#FEA917"
              class="icon"
            ></u-icon>
            店铺入驻
          </view>
        </view>
      </view>
      <view class="btnBox" v-if="myShopList.length > 0">
        <u-button type="primary" ripple @click="changeModel">{{
          isStoreUiModel ? '切换为用户模式' : '切换为商家模式'
        }}</u-button>
      </view>
    </view>
    <hy-tabbar></hy-tabbar>
    <!-- #ifdef H5 -->
    <!-- 线下店扫码/店铺分享进入的显示此tabbar -->
    <hyTabBar
      v-if="enterByStoreQrcode"
      v-model="currentTabbar"
      :list="tabList"
      :mid-button="false"
      :icon-size="34"
      active-color="#5098ff"
      @change="handleTabBarChange"
    ></hyTabBar>
    <!-- #endif -->
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
    top: -368rpx;
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
      justify-content: flex-start;
      align-items: center;
      position: relative;
      z-index: 3;

      .imgBox {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        flex-shrink: 0;
        .avatar-wrapper {
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background-color: inherit;
          &:after {
            border: none;
          }
        }
        image {
          display: block;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }

      .right {
        width: calc(100% - 100rpx);
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
        width: 45%;
        max-width: 45%;
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
  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 50%;
    display: inline-block;
    overflow: hidden;
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
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        > image {
          display: block;
          width: 48rpx;
          height: 48rpx;
          margin: 0 auto;
          margin-bottom: 17rpx;
        }
        &.reverse {
          > image {
            transform: rotate(90deg);
          }
        }
        .icon {
          margin-bottom: 10rpx;
        }
        > text {
          margin-top: 10rpx;
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
.btnBox {
  width: 690rpx;
  margin: 0 auto;
  margin-top: 32rpx;
}
</style>
