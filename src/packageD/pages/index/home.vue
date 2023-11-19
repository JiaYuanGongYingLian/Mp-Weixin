<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <view>
    <u-navbar
      :is-back="false"
      title="消息"
      :background="ryStore.head_background"
      :border-bottom="false"
      :title-bold="true"
    >
      <view slot="right">
        <u-icon
          class="u-m-r-30"
          name="plus-circle"
          size="40"
          @click="ShowHidden = !ShowHidden"
        ></u-icon>
        <view class="arrivalNavigation" v-if="ShowHidden">
          <view class="d4"></view>
          <view class="sideNavigation">
            <view class="item" @click="addgroup()"
              ><u-icon class="u-m-r-30" name="chat-fill" size="35"></u-icon
              >发起群聊</view
            >
            <view class="liBottomBorder"></view>
            <view class="item" @click="tabaddfriend()"
              ><u-icon class="u-m-r-30" name="man-add-fill" size="35"></u-icon
              >添加朋友</view
            >
          </view>
        </view>
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
    <view
      v-if="ryStore.vuex_home_loading"
      class="u-border-bottom"
      v-for="(item, index) in ryStore.vuex_latestConversationList[
        ryStore.userinfo.id
      ]"
      :key="index"
    >
      <!-- u-border-bottom -->
      <u-swipe-action
        :options="options"
        @click="click"
        :show="item.show"
        :index="index"
        @open="item.show = true"
        @close="item.show = false"
      >
        <view
          class="list-wrap"
          @click="ingroup(item.targetId) ? tabgroup(item) : tabmsg(item)"
        >
          <view class="body-item">
            <view style="position: relative">
              <u-lazy-load
                class="images"
                border-radius="12"
                height="100"
                v-if="!ingroup(item.targetId)"
                :image="ryStore.vuex_nlist[item.targetId].avatar"
                threshold="300"
                img-mode="aspectFill"
              ></u-lazy-load>
              <u-lazy-load
                class="images"
                border-radius="12"
                height="100"
                v-if="ingroup(item.targetId)"
                :image="ryStore.vuex_grouplist[item.targetId].avatar"
                threshold="300"
                img-mode="aspectFill"
              ></u-lazy-load>
              <u-badge
                :count="item.unreadMessageCount"
                size="mini"
                :is-center="true"
              ></u-badge>
            </view>
            <view class="content">
              <view class="title">
                <view v-if="!ingroup(item.targetId)">
                  {{ ryStore.vuex_nlist[item.targetId].nickname }}
                </view>
                <view v-if="ingroup(item.targetId)">
                  {{ ryStore.vuex_grouplist[item.targetId].name }}
                </view>
              </view>
              <view class="head_right">
                {{ item.lastUnreadTime | date('hh:MM') }}
              </view>
              <view class="item_content text-line-1 u-m-b-5">
                {{
                  item.latestMessage.messageType == 'app:hongbao'
                    ? '[红包]  ' + item.latestMessage.content.content.ps
                    : item.latestMessage.content.content
                }}
              </view>
            </view>
          </view>
        </view>
        <!-- <u-line color="info" length="80%" /> -->
      </u-swipe-action>
    </view>
    <u-tabbar
      v-model="ryStore.vuex_current"
      :activeColor="ryStore.vuex_activeColor"
      :list="ryStore.vuex_tabbar"
      bg-color="rgba(249,249,249)"
    ></u-tabbar>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { route } from '@/utils/common'
import { WEBIM } from '@/common/webim.js'
import { useRyStore, useUserStore } from '@/store'

const ryStore = useRyStore()
const userStore = useUserStore()
const ShowHidden = ref(false)
const options = reactive([
  {
    text: '置顶',
    style: {
      'white-space': 'nowrap',
      backgroundColor: '#909399'
    }
  },
  {
    text: '删除',
    style: {
      backgroundColor: '#dd524d'
    }
  }
])
function click(index, index1) {
  const that = this
  if (index1 === 0) {
    // 点击了置顶
  } else if (index1 === 1) {
    // 点击了删除
    this.vuex_latestConversationList[this.userinfo.id][index].show = false
    setTimeout(() => {
      WEBIM.delMessageList(
        this.vuex_latestConversationList[this.userinfo.id][index].targetId,
        this.vuex_latestConversationList[this.userinfo.id][index].type,
        index
      )
    }, 500)
  }
}
function tabmsg(res) {
  route({
    url: '/packageD/pages/message/index',
    params: {
      uuid: res.targetId,
      type: res.type
    }
  })
}
function tabaddfriend() {
  route({
    url: '/packageD/pages/public/user/addfriends'
  })
}
function addgroup() {
  route({
    url: '/packageD/pages/message/addgroup'
  })
}
function ingroup(e) {
  const arr = e.split('_')
  if (arr[1] === 'group') {
    return true
  }
  return false
}
function tabgroup(e) {
  route({
    url: '/packageD/pages/message/message_group',
    params: {
      uuid: e.targetId,
      type: e.type
    }
  })
}
onLoad(async (opt) => {
  console.log(userStore.userInfo?.rongToken)
  await WEBIM.rongInit(userStore.userInfo?.rongToken)
})
</script>

<style lang="scss">
.list-wrap {
  padding: 18rpx;
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
        right: 400rpx;
        font-size: 25rpx;
        color: $u-tips-color;
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
  // flex: 0 0 100rpx;
  height: 100rpx;
}

.arrivalNavigation {
  width: 250rpx;
  position: absolute;
  right: 10rpx;
  z-index: 99;
  .sideNavigation {
    width: 248rpx;
    background-color: rgba(76, 76, 76, 76);
    color: #eee;
    border-radius: 6rpx;
    .item {
      height: 85rpx;
      text-align: center;
      line-height: 85rpx;
      font-size: 25rpx;
    }
    .liBottomBorder {
      border: 0.1rpx solid rgba(81, 81, 81, 81);
    }
  }
  .d4 {
    width: 0;
    height: 0;
    margin-left: 200rpx;
    // margin-top: -10rpx;
    border-width: 10rpx;
    border-style: solid;
    border-color: transparent rgba(76, 76, 76, 76) transparent transparent;
    transform: rotate(90deg); /*顺时针旋转90°*/
  }
}
</style>
