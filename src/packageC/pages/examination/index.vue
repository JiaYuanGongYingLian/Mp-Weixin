<!--
 * @Description: 售后量表
 * @Author: Kerwin
 * @Date: 2023-11-01 14:51:39
 * @LastEditTime: 2023-11-01 17:33:28
 * @LastEditors:  Please set LastEditors
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const list = ref([
  {
    name: 'haha',
    list: [
      {
        name: '1111'
      },
      {
        name: '22222'
      },
      {
        name: '11333311'
      },
      {
        name: '1144411'
      }
    ]
  },
  {
    name: 'xixi',
    list: [
      {
        name: '1111'
      },
      {
        name: '22222'
      },
      {
        name: '11333311'
      },
      {
        name: '1144411'
      }
    ]
  }
])
const qIndex = ref(0)
function pick(item, ans) {
  if (!item.isMultiple) {
    item.list.forEach((e) => {
      e.checked = false
    })
    ans.checked = true
  }
}
function switchFn(count) {
  if (qIndex.value === 0 && count < 0) return
  if (!list.value[qIndex.value].list.some((elm) => elm.checked) && count > 0) {
    uni.showToast({
      icon: 'none',
      title: '请选择答案！'
    })
    return
  }
  if (qIndex.value === list.value.length - 1 && count > 0) return
  qIndex.value += count
}
function submit() {
  if (!list.value[qIndex.value].list.some((elm) => elm.checked)) {
    uni.showToast({
      icon: 'none',
      title: '请选择答案！'
    })
    return
  }
  console.log(list.value)
}
onLoad((option) => {})
</script>
<template>
  <view class="container">
    <!-- <u-navbar
      back-text=""
      title=""
      :title-bold="true"
      v-if="!userStore.isWeChatBrowser"
      color="#fff"
      title-color="#fff"
      :border-bottom="false"
      back-icon-color="#fff"
    ></u-navbar> -->
    <view class="content">
      <view class="cir">
        <u-circle-progress
          :percent="((qIndex + 1) / list.length) * 100"
          width="100"
          border-width="6"
          active-color="#FF8640"
        >
          <view class="u-progress-content">
            <view class="active">{{ qIndex + 1 }}</view>
            <text class="count">/{{ list.length }}</text>
          </view>
        </u-circle-progress>
      </view>
      <view
        class="qitem"
        v-for="(item, index) in list"
        :key="item.id"
        v-show="qIndex === index"
      >
        <view class="name">{{ item.name }}：</view>
        <view class="alist">
          <view
            v-for="ans in item.list"
            :key="ans.id"
            class="aitem"
            :class="{ active: ans.checked }"
            @click="pick(item, ans)"
            >{{ ans.name }}
          </view>
        </view>
      </view>
    </view>
    <view class="action">
      <u-button
        class="btn"
        ripple
        type="primary"
        plain
        shape="circle"
        @click="switchFn(-1)"
        >上一题</u-button
      >
      <u-button
        v-if="qIndex === list.length - 1"
        class="btn"
        ripple
        type="primary"
        shape="circle"
        @click="submit"
        >提交</u-button
      >
      <u-button
        v-else
        class="btn"
        ripple
        type="primary"
        shape="circle"
        @click="switchFn(1)"
        >下一题</u-button
      >
    </view>
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 30rpx;
  background: #fff;
  line-height: 40rpx;
  min-height: 100vh;
  background: linear-gradient(180deg, #caedfe, #f4fbff);

  .section {
    margin-top: 40rpx;
  }

  .content {
    background: #fff;
    border-radius: 12rpx;
    padding: 0 30rpx 60rpx 30rpx;
    margin-top: 60rpx;
    box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, 0.05);

    .cir {
      background: #fff;
      display: flex;
      padding: 20rpx 20rpx 0 20rpx;
      margin: 0 auto;
      width: 144rpx;
      height: 124rpx;
      border-radius: 50%;
      position: relative;
      top: -30rpx;
    }

    .name {
      font-size: 36rpx;
      font-weight: bold;
    }

    .aitem {
      background: #f7f7f7;
      height: 90rpx;
      margin-top: 30rpx;
      display: flex;
      align-items: center;
      padding: 0 30rpx;
      box-sizing: border-box;
      border-radius: 12rpx;
      border: 1px solid transparent;

      &.active {
        border-color: #1a8dff;
        background: #e6f7ff;
      }
    }
  }

  .action {
    display: flex;
    justify-content: space-between;
    margin-top: 40rpx;

    .btn {
      width: 30%;
    }
  }

  .u-progress-content {
    display: flex;
    align-items: center;

    .active {
      color: #ff8640;
      font-size: 30rpx;
    }
  }
}
</style>
