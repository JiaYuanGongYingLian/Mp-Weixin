<template>
  <view>
    <u-navbar
      :is-back="false"
      title="通讯录"
      :background="head_background"
      :border-bottom="false"
    >
      <view slot="right">
        <u-icon
          class="u-m-r-30"
          name="man-add"
          size="40"
          @click="addfriends"
        ></u-icon>
      </view>
    </u-navbar>
    <view
      style="width: 100%; background-color: rgba(237, 237, 237); padding: 15rpx"
    >
      <u-search
        shape="square"
        height="70"
        bg-color="#ffffff"
        color="#909399"
        :disabled="true"
        :show-action="false"
        placeholder="搜索"
      ></u-search>
    </view>
    <view class="group">
      <view class="item u-flex u-border-bottom" @click="addlist">
        <view class="block" style="background-color: #ff9900">
          <u-icon
            class="icon1"
            name="plus-people-fill"
            color="#ffffff"
            size="45"
          ></u-icon>
          <u-badge
            :count="friendsUnreadCount"
            size="mini"
            :is-center="true"
          ></u-badge>
        </view>
        <view class="text">新的朋友</view>
      </view>
      <view class="item u-flex u-border-bottom">
        <view class="block" style="background-color: #19be6b">
          <u-icon
            class="icon2"
            name="account-fill"
            color="#ffffff"
            size="45"
          ></u-icon>
        </view>
        <view class="text">群聊</view>
      </view>
    </view>
    <u-index-list
      :scrollTop="scrollTop"
      :sticky="false"
      :indexList="vuex_indexList.letterArr"
    >
      <view v-for="(item, index) in vuex_indexList.list" :key="index">
        <u-index-anchor :use-slot="true" :index="item.letter">
          <view class="u-m-l-10">{{ item.letter }}</view>
        </u-index-anchor>
        <view
          class="list-wrap u-border-bottom"
          v-for="(item1, index) in item.data"
          :key="index"
        >
          <view class="body-item" data-id="item1.id">
            <u-lazy-load
              class="images"
              border-radius="8"
              height="100"
              :image="item1.avatar"
              threshold="300"
              img-mode="widthFix"
            ></u-lazy-load>
            <view class="content">
              <view class="title">
                <view>{{ item1.nickname }}</view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-index-list>
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
      scrollTop: 0,
      offset_top: 0,
      indexList: [
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z',
        '#'
      ]
    }
  },
  onLoad() {
    const systemInfo = uni.getSystemInfoSync()
    this.offset_top = `${systemInfo.statusBarHeight}px`
    // this.$u.api.getfriendlist().then((res) => {
    //   console.log('更新好友数据')
    //   if (res.code === 1) {
    //     const { friends } = res.data
    //     const letterArr = friends.map((val) => {
    //       return val.letter
    //     })
    //     const list = { letterArr, list: friends }
    //     this.$u.vuex('vuex_nlist', res.data.nlist)
    //     this.$u.vuex('vuex_indexList', list)
    //     this.$u.vuex('vuex_addfriendslist', res.data.addfriends)
    //   }
    // })
  },
  onPageScroll(e) {
    this.scrollTop = e.scrollTop
  },
  methods: {
    addlist() {
      route({
        url: 'pages/public/user/addfriendslist'
      })
    },
    addfriends() {
      route({
        url: 'pages/public/user/addfriends'
      })
    }
  }
}
</script>

<style lang="scss">
.group {
  background-color: #ffffff;
  .item {
    padding: 18rpx 30rpx;
    .block {
      width: 73rpx;
      height: 73rpx;
      border-radius: 8rpx;
      position: relative;
      .icon1 {
        position: absolute;
        left: 15rpx;
        top: 15rpx;
      }
      .icon2 {
        position: absolute;
        left: 15rpx;
        top: 15rpx;
      }
    }
    .text {
      margin-left: 30rpx;
      font-size: 33rpx;
    }
  }
}
.list-wrap {
  padding: 18rpx 30rpx;
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
    }
  }
}

.body-item .images {
  width: 73rpx;
  // flex: 0 0 100rpx;
  height: 73rpx;
}
</style>
