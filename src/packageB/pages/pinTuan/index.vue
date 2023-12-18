<!-- eslint-disable no-unused-expressions -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-11-19 17:53:57
 * @LastEditTime: 2023-12-18 18:24:54
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
  onReachBottom,
  onShareAppMessage,
  onLoad,
  onPullDownRefresh,
  onShareTimeline
} from '@dcloudio/uni-app'
import { orderApi } from '@/api'
import { getImgFullPath } from '@/utils'
import { useConfigStore } from '@/store'
import { sharePathFormat } from '@/common/wechat-share'

const configStore = useConfigStore()
const status = ref('loadmore')

// 分享
const shareData = ref({})
const shareComp = ref()
function setShareData(params) {
  const data = params
  shareData.value = {
    title: `拼团-${data?.orderProductSkus[0]?.name || ''}`,
    desc: data.remark ?? '',
    imageUrl: getImgFullPath(data?.orderProductSkus[0]?.skuImage),
    path: sharePathFormat({
      redirect_url: '/packageB/pages/pinTuan/checkout',
      orderId: data?.id
    }),
    orderId: data?.id,
    msgType: 11
  }
}
function showShare(data) {
  setShareData(data)
  shareComp.value.showPop()
}
// 拼团列表
const dataList = reactive({
  pageIndex: 1,
  pageSize: 18,
  list: []
})
const getDataList = async () => {
  if (status.value === 'nomore') return
  status.value = 'loading'
  const { data } = await orderApi.orderList({
    pageIndex: dataList.pageIndex,
    pageSize: dataList.pageSize,
    detail: 'true',
    orderType: 2, // 拼团
    statuses: 10, // 待支付
    otherColumns: 'completedPayInfos'
  })
  const { records, current, pages } = data
  records.forEach((e) => {
    e.orderPayInfoTotalCount = e.orderExternals.find((item) => {
      return item.fieldName === 'orderPayInfoTotalCount'
    })
    e.orderPayInfoMoney = e.orderExternals.find((item) => {
      return item.fieldName === 'orderPayInfoMoney'
    })
    e.orderPayInfoCount = e.orderExternals.find((item) => {
      return item.fieldName === 'orderPayInfoCount'
    })
  })
  dataList.list.push(...records)
  if (current < pages) {
    dataList.pageIndex += 1
  } else {
    status.value = 'nomore'
  }
}

// 点击去拼团
function handleCheck(data) {
  uni.setStorageSync('orderJson', JSON.stringify(data))
  uni.navigateTo({
    url: '/packageB/pages/pinTuan/checkout?'
  })
}
// 点击查看拼团详情
function toPinTuanDetail(order: { orderId: any }) {
  const { id } = order
  uni.navigateTo({
    url: `/packageB/pages/pinTuan/detail?orderId=${id}`
  })
}
onReachBottom(() => {
  getDataList()
})
onLoad(async () => {
  getDataList()
})
onShareAppMessage(() => {
  return shareData.value
})
onShareTimeline(() => {
  return shareData.value
})
onPullDownRefresh(() => {
  setTimeout(async () => {
    dataList.pageIndex = 1
    dataList.pageSize = 18
    dataList.list = []
    status.value = 'loading'
    await getDataList().finally(() => {
      uni.stopPullDownRefresh()
    })
  }, 1000)
})
</script>
<template>
  <view class="c_container">
    <hy-share ref="shareComp" :shareData="shareData" />
    <view class="shop" v-for="data in dataList.list" :key="data.id">
      <view class="topBox">
        <view>
          <view class="avatars" v-if="data?.completedPayInfos">
            <image
              v-for="(item, index) in data?.completedPayInfos"
              :src="getImgFullPath(item?.user?.avatar)"
              mode="scaleToFill"
              :key="index"
              :style="{ left: index * 40 + 'rpx', zIndex: index }"
            />
          </view>
          <view class="count">
            {{ data.orderPayInfoTotalCount.fieldValue }}人团
          </view>
        </view>
        <view class="share" @click="showShare(data)">
          <u-icon name="share-fill" :custom-style="{ fontWeight: 'bold' }" />
          分享
        </view>
      </view>
      <view class="contentBox" @click="toPinTuanDetail(data)">
        <view class="imgCover">
          <u-image
            class="img"
            border-radius="10rpx"
            :src="getImgFullPath(data?.orderProductSkus[0]?.skuImage)"
            height="160rpx"
            :lazy-load="true"
            mode="scaleToFill"
          />
        </view>
        <view class="content">
          <text class="name">{{ data?.orderProductSkus[0]?.name }}</text>
          <text class="remark">{{ data.remark }}</text>
          <view class="actionBox">
            <view class="rule">
              <view>{{ data.orderPayInfoMoney.fieldValue }}积分</view>
              <view class="label">拼团价</view>
            </view>
            <view class="actions">
              <u-button
                type="primary"
                ripple-bg-color="#909399"
                size="mini"
                shape="squre"
                :custom-style="{
                  width: '200rpx',
                  fontSize: '28rpx'
                }"
                @click="handleCheck(data)"
                >还差 {{ data.orderPayInfoCount?.fieldValue }}人</u-button
              >
            </view>
          </view>
        </view>
      </view>
    </view>
    <u-loadmore :status="status" />
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.c_container {
  padding: 0 30rpx calc(30rpx + env(safe-area-inset-bottom)) 30rpx;

  .shop {
    border-radius: $section-raduis;
    background: $uni-bg-color-white;
    margin-bottom: $uni-spacing-col-lg;
    padding: 20rpx;

    .topBox {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .avatars {
        padding-left: 50rpx;
        position: relative;
        height: 70rpx;

        image {
          width: 70rpx;
          height: 70rpx;
          border-radius: 50%;
          background-color: #f6f6f6;
          flex-shrink: 0;
          position: absolute;
          left: 0;
          z-index: 0;
        }
      }

      .count {
        font-size: 20rpx;
        border-radius: 20rpx;
        background-color: $bg-primary;
        color: #fff;
        padding: 6rpx 18rpx;
        margin-bottom: -6rpx;
        margin-top: 5rpx;
        position: relative;
        z-index: 2;
      }

      .share {
        font-weight: bold;
        font-size: 26rpx;
        color: $text-color-primary;
      }
    }

    .contentBox {
      display: flex;

      .imgCover {
        position: relative;
        width: 160rpx;
        flex-shrink: 0;
        margin-right: 20rpx;

        .img {
          width: 100%;
          // height: 200rpx;
          border-radius: $section-raduis;
        }
      }

      .content {
        position: relative;
        flex: 1;
        text-align: left;

        .name {
          font-size: 32rpx;
          width: 75%;
          display: inline-block;
        }

        .remark {
          @include ellipsis;
          color: $uni-text-color-light;
          font-size: 20rpx;
          margin-top: 10rpx;
        }

        .vip {
          position: absolute;
          right: 0;
          top: 0;
          border: 1px solid $uni-text-color-red;
          color: $uni-text-color-red;
          font-size: 18rpx;
          padding: 5rpx;
          border-radius: 10rpx;
        }
      }
    }

    .actionBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20rpx;

      .rule {
        color: $text-color-primary;
        font-size: 28rpx;
        .label {
          font-size: 24rpx;
        }
      }

      .actions {
        display: flex;
        justify-content: center;
        gap: 18rpx;

        :deep(.u-btn--primary) {
          background: $bg-primary;
        }

        .hy-icon-dianhua {
          margin-right: 5rpx;
          font-size: 26rpx;
        }
      }
    }
  }
}
</style>
