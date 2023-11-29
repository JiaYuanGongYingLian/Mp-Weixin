<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <view>
    <view class="container">
      <view
        class="circle"
        v-for="item in circleList.list"
        :key="item.id"
        @click="toGroupChat(item?.friendCircle)"
      >
        <view class="c-bot">
          <view class="avatar-wrap">
            <u-badge
              :is-dot="true"
              type="success"
              is-center
              v-if="item.unread_msg_count > 0"
            ></u-badge>
            <u-image
              class="avatar"
              width="120rpx"
              height="120rpx"
              border-radius="10rpx"
              :src="getImgFullPath(item.friendCircle?.avatar)"
            ></u-image>
          </view>
          <view class="con">
            <view class="top">
              <view class="name">{{ item.friendCircle?.name }}</view>
              <view class="date">{{
                dateFormat(
                  new Date(item.friendCircle?.createTime * 1000),
                  'MM-dd hh:mm'
                )
              }}</view>
            </view>
            <view class="desc"> {{ item?.friendCircle?.remark }}</view>
          </view>
        </view>
      </view>
      <u-empty
        text="暂无消息"
        mode="message"
        v-if="!circleList.list.length"
        margin-top="100"
      ></u-empty>
      <u-loadmore
        v-if="circleList.list.length > 3"
        :status="status"
        margin-top="30"
      />
    </view>
    <!-- <u-tabbar
      v-model="ryStore.pinia_current"
      :activeColor="ryStore.pinia_activeColor"
      :list="ryStore.pinia_tabbar"
      bg-color="rgba(249,249,249)"
    ></u-tabbar> -->
    <hy-tabbar :midButton="true" :border-top="false"></hy-tabbar>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { onLoad, onReachBottom } from '@dcloudio/uni-app'
import { route } from '@/utils/common'
import { getImgFullPath, dateFormat } from '@/utils/index'
import { useUserStore } from '@/store'
import { socialApi } from '@/api'

const userStore = useUserStore()
const circleList = reactive({
  list: [],
  loading: true,
  pageIndex: 1,
  pageSize: 20
})
const status = ref('loadmore')
async function getList() {
  if (status.value === 'nomore') return
  try {
    const { data } = await socialApi.circleUserList({
      pageIndex: circleList.pageIndex,
      pageSize: circleList.pageSize,
      detail: true,
      type: 0,
      userId: userStore.userInfo.id
    })
    const { records, current, pages } = data
    circleList.list.push(...records)
    if (current < pages && pages !== 0) {
      circleList.pageIndex += 1
    } else {
      status.value = 'nomore'
    }
  } catch {}
}
async function toGroupChat(item: {
  type?: any
  chatGroupId: any
  id: any
  name?: any
  joined?: boolean
}) {
  route({
    url: '/packageA/pages/chat/index',
    params: {
      targetId: item.chatGroupId,
      groupName: item.name,
      cid: item.id,
      type: 1
    }
  })
}
onLoad(async (opt) => {})
onMounted(() => {
  getList()
})
onReachBottom(() => {
  getList()
})
</script>

<style lang="scss">
@import '@/styles/helper.scss';
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
.container {
  padding: 20rpx;
}

.circle {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 10rpx;

  .c-bot {
    display: flex;
    align-items: flex-start;
    .avatar-wrap {
      position: relative;
    }
    .avatar {
      flex-shrink: 0;
    }

    .con {
      margin-left: 20rpx;
      flex: 1;

      .top {
        display: flex;
        justify-content: space-between;

        .name {
          font-weight: bold;
          font-size: 30rpx;
        }

        .date {
          font-size: 24rpx;
          color: #999;
        }
      }

      .desc {
        margin-top: 20rpx;
        @include ellipsis(2);
        color: #666;
      }
    }
  }
}
</style>
