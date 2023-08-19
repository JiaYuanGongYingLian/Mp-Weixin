<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-25 09:26:40
 * @LastEditTime: 2023-08-19 14:20:09
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady, onPageScroll, onShareAppMessage } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore, useConfigStore } from '@/store'
import hyNavBarSimpler from '@/components/hy-nav-bar-simpler/index.vue'
import c_shop from './c_shop.vue'
import c_biography from './c_biography.vue'
import c_video from './c_video.vue'
import c_connection from './c_connection.vue'

const userStore = useUserStore()
const configStore = useConfigStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const cardId = ref(null)
const cardUserId = ref(null)
const userDetailInfo = ref({})
const hasDetailInfo = ref(true)
const isMySelf = ref(false)
const tabList = ref([
  {
    name: '传记'
  },
  {
    name: '视频'
  },
  {
    name: '橱窗'
  },
  {
    name: '排行榜'
  }
])
const statusBarHeight = ref()
uni.getSystemInfo({
  success: (res) => {
    statusBarHeight.value = res.statusBarHeight
  }
})
const currentTab = ref(0)
async function getUserDetailInfo() {
  const { data } = await socialApi.userDetailInfo({
    id: cardId.value,
    userId: cardUserId.value,
    detail: true
  })
  if (!data) {
    hasDetailInfo.value = false
    if (isMySelf.value) {
      userDetailInfo.value.avatar =
        userInfo.value.avatar || configStore.cardDefualtAvatar
      userDetailInfo.value.coverImage =
        userInfo.value.avatar || configStore.cardDefualtCoverImage
      userDetailInfo.value.name = userInfo.value.nickname
    } else {
      userDetailInfo.value.avatar = configStore.cardDefualtAvatar
      userDetailInfo.value.coverImage = configStore.cardDefualtCoverImage
      userDetailInfo.value.name = userInfo.value.nickname
    }
  } else {
    userDetailInfo.value = data
  }
}
function toEdit() {
  uni.navigateTo({
    url: '/packageA/pages/publish/index?tabIndex=1'
  })
}
function toView() {
  uni.navigateTo({
    url: '/packageA/pages/shortVideo/index'
  })
}
const focusDetail = reactive({
  id: null,
  status: false
})
async function focusAdd() {
  if (focusDetail.status) {
    uni.showModal({
      title: '提示',
      content: '取消此用户关注？',
      async success(res) {
        if (res.confirm) {
          focusCancel()
        } else {
          console.log('取消')
        }
      }
    })
    return
  }
  const { code } = await socialApi.userFocusAdd({
    targetUserId: cardUserId.value,
    userId: userInfo.value.id
  })
  if (code === 200) {
    focusDetailFn()
  }
}
async function focusCancel() {
  const { code } = await socialApi.userFocusDelete({
    targetUserId: cardUserId.value,
    userId: userInfo.value.id,
    id: focusDetail.id
  })
  if (code === 200) {
    focusDetailFn()
  }
}
async function focusDetailFn() {
  const { code, data } = await socialApi.userFocusList({
    targetUserId: cardUserId.value,
    userId: userInfo.value.id,
    noPaging: true
  })
  if (data?.length > 0) {
    focusDetail.status = true
    focusDetail.id = data[0]?.id
  } else {
    focusDetail.status = false
  }
}
const pop = ref()
function contact() {
  pop.value.openPop()
}
function tabChange() {}
onLoad((option) => {
  cardId.value = option?.cardId
  cardUserId.value = option?.userId
  isMySelf.value = Number(option?.userId) === userInfo.value.id
  getUserDetailInfo()
  if (!isMySelf.value) {
    focusDetailFn()
  }
})

const show = ref(true)
const scrollTop = ref(0)
onPageScroll((e) => {
  scrollTop.value = e.scrollTop
  if (e.scrollTop > 50) {
    show.value = false
  } else {
    show.value = true
  }
})
onShareAppMessage((_res) => {
  return {
    title: `黑银名片-${userDetailInfo.value?.name}` || '黑银名片',
    content: userDetailInfo.value?.jobTagName?.split('-')[0],
    desc: userDetailInfo.value?.jobTagName?.split('-')[0],
    imageUrl: getImgFullPath(userDetailInfo.value?.avatar) || '',
    path: `/pages/launch/index?redirect_url=/packageA/pages/businessCard/index&cardId=${cardId.value}&userId=${cardUserId.value}`
  }
})
</script>
<template>
  <view class="container">
    <hyNavBarSimpler v-show="show" />
    <view class="topView">
      <u-image
        :src="
          getImgFullPath(userDetailInfo?.coverImage || userDetailInfo?.avatar)
        "
        width="100%"
        height="400rpx"
      ></u-image>
      <view class="headBox">
        <view class="avatar">
          <u-image
            :src="getImgFullPath(userDetailInfo?.avatar)"
            width="180rpx"
            height="180rpx"
            shape="circle"
            @click="toEdit"
          ></u-image>
        </view>
        <view class="info">
          <view class="name">{{ userDetailInfo.name }}</view>
          <uni-view class="badge" v-if="userDetailInfo?.jobTagName">{{
            userDetailInfo?.jobTagName?.split('-')[0]
          }}</uni-view>
        </view>
      </view>
    </view>
    <view class="main">
      <view class="section">
        <view class="accountInfo">
          <!-- <view class="item">
            <text class="val">194.0万</text>
            <text class="label">获赞</text>
          </view> -->
          <view class="item">
            <text class="val"> {{ userDetailInfo?.focusCount || 0 }}</text>
            <text class="label">关注</text>
          </view>
          <view class="item">
            <text class="val">{{ userDetailInfo?.fansCount || 0 }}</text>
            <text class="label">粉丝</text>
          </view>
        </view>
        <view class="remark"> {{ userDetailInfo?.motto }} </view>
        <view class="action" v-if="isMySelf">
          <view class="btn def" @click="toEdit">
            <text class="text">编辑资料</text>
          </view>
          <view class="btn def" @click="toView">
            <text class="text">随便看看</text>
          </view>
        </view>
        <view class="action" v-else>
          <view
            class="btn focus"
            :class="{ isFocus: focusDetail.status }"
            @click="focusAdd"
          >
            <text class="text"
              >{{ focusDetail.status ? '✔ 已关注' : '+关注' }}
            </text>
          </view>
          <view class="btn link" @click="contact">
            <text class="text">立即对接</text>
          </view>
          <c_connection ref="pop" :info="userDetailInfo" />
        </view>
      </view>
      <u-tabs
        active-color="#333"
        :list="tabList"
        :is-scroll="false"
        v-model="currentTab"
        bar-width="200"
        item-width="50%"
        @change="tabChange"
        sticky
        :style="{ top: `${statusBarHeight}px`, zIndex: 2 }"
      ></u-tabs>
      <view v-if="hasDetailInfo">
        <!-- 传记 -->
        <view class="tabBox biography" v-show="currentTab === 0">
          <c_biography :info="userDetailInfo" />
        </view>
        <!-- 视频 -->
        <view class="video" v-show="currentTab === 1">
          <c_video :cardUserId="cardUserId" />
        </view>
        <!-- 橱窗 -->
        <view class="shop" v-show="currentTab === 2">
          <c_shop />
        </view>
        <!-- 排行榜 -->
        <view class="shop" v-show="currentTab === 3">
          <u-empty
            text="暂无数据"
            mode="list"
            style="margin-top: 30px"
          ></u-empty>
        </view>
      </view>
      <view v-else class="empty">
        <view class="text" v-if="isMySelf">完善传记链接名人</view>
        <view class="text" v-else>暂无数据</view>
        <u-button
          size="medium"
          class="btn"
          :hair-line="false"
          ripple
          @click="toEdit"
          v-if="isMySelf"
          >立即完善</u-button
        >
      </view>

      <u-back-top :scroll-top="scrollTop"></u-back-top>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.topView {
  position: relative;

  .headBox {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    padding: 60rpx 40rpx;
    display: flex;
    align-items: center;
    box-shadow: inset 0rpx -100rpx 20rpx -10rpx rgba(0, 0, 0, 0.1);

    .avatar {
      width: 180rpx;
      height: 180rpx;
      border: 2px solid #fff;
      border-radius: 50%;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 30rpx;
    }

    .info {
      display: flex;
      align-items: center;

      .name {
        color: #fff;
        font-size: 36rpx;
        font-weight: bold;
        max-width: 250rpx;
        @include ellipsis;
      }

      .badge {
        max-width: 77px;
        color: #fff;
        font-size: 20rpx;
        background: linear-gradient(128deg, #ff522d, #ff913e);
        border-radius: 17px;
        padding: 2px 8px;
        margin-left: 7px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 0rpx;
      }
    }
  }
}

.main {
  border-top-left-radius: 30rpx;
  border-top-right-radius: 30rpx;
  position: relative;
  top: -30rpx;
  background: #fff;
  flex: 1;
  box-shadow: 0rpx 30rpx 0rpx 0 rgb(255, 255, 255);

  .section {
    padding: 40rpx 30rpx;
  }

  .accountInfo {
    display: flex;
    align-items: center;
    gap: 30rpx;

    .val {
      font-size: 34rpx;
      font-weight: bold;
      margin-right: 10rpx;
    }

    .label {
      color: #666;
    }
  }

  .remark {
    padding: 30rpx 0 20rpx 0;
  }
}

.action {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 10rpx;
  .btn {
    background-color: #fc2b55;
    border-radius: 6rpx;
    color: #fff;
    text-align: center;
    line-height: 60rpx;
    font-weight: bold;
    box-shadow: 0 0 10rpx 0 rgba(0, 0, 0, 0.3);
    &.def {
      background-color: #eee;
      width: 50%;
      color: #333;
      font-weight: normal;
      box-shadow: none;
    }
    &.focus {
      width: 40%;
      &.isFocus {
        background-color: #f6f6f6;
        // box-shadow: none;
        color: #333;
        font-weight: normal;
      }
    }
    &.link {
      flex: 1;
    }
    &:active {
      box-shadow: 0 0 0 rgba(0, 0, 0, 0.5);
      transform: translateY(0em) scale(0.99);
      transition: background-color 150ms ease-out, box-shadow 150ms ease-out,
        transform 150ms ease-out;
    }
  }
}

.u-tabs {
  border-bottom: 1px solid #ccc;

  :deep(.u-tab-bar) {
    // transform: translateY(0) !important;
    bottom: -3px;
  }
}

.biography {
  padding: 26rpx;
}

.shop {
  padding: 30rpx;
}
.empty {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 150rpx;
  .text {
    font-size: 32rpx;
    color: #000;
  }
  .btn {
    margin-top: 40rpx;
    font-weight: bold;
    color: #000;
  }
}
</style>
