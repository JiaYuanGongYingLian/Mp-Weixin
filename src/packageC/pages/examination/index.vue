<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-shadow -->
<!--
 * @Description: 商学院量表
 * @Author: Kerwin
 * @Date: 2023-11-01 14:51:39
 * @LastEditTime: 2024-01-06 10:24:04
 * @LastEditors:  Please set LastEditors
-->

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { useUserStore } from '@/store'
import { baseApi } from '@/api'

const userStore = useUserStore()
const paperInfo = ref({})
const list = ref([])
const qIndex = ref(0)
function pick(item, ans) {
  if (item.type === 1) {
    item.questionOptions.forEach((e) => {
      e.checked = false
    })
    ans.checked = true
  } else if (item.type === 2) {
    ans.checked = true
  }
}
function switchFn(count) {
  if (qIndex.value === 0 && count < 0) return
  if (
    list.value[qIndex.value]?.questionOptions &&
    !list.value[qIndex.value].questionOptions.some((elm) => elm.checked) &&
    count > 0
  ) {
    uni.showToast({
      icon: 'none',
      title: '请选择答案！'
    })
    return
  }
  if (qIndex.value === list.value.length - 1 && count > 0) return
  qIndex.value += count
}
const answerScore = ref(0)
async function submit() {
  if (
    list.value[qIndex.value]?.questionOptions &&
    !list.value[qIndex.value]?.questionOptions.some(
      (elm: { checked: any }) => elm.checked
    )
  ) {
    uni.showToast({
      icon: 'none',
      title: '请选择答案！'
    })
    return
  }
  const questionAnswers = list.value.map((item) => {
    item.questionId = item.id
    const data = JSON.parse(JSON.stringify(removeProp(item)))
    switch (data.type) {
      case 20:
        data.answer = data.remark
        break
      default:
        const ans = data.questionOptions.filter(
          (e: { checked: any }) => e.checked
        )
        data.answer = ans.map((e: { id: any }) => e.id).join(',')
        data.answerScore = 0
        ans.forEach((e: { score: number }) => {
          data.answerScore += e.score
          answerScore.value += e.score
        })
    }
    if (data.questionOptions) {
      data.questionOptions = data.questionOptions.map(
        (e: { [x: string]: any }) => {
          e.questionId = data.questionId
          return removeProp(e)
        }
      )
    }
    return data
  })
  function removeProp(data: { [x: string]: any }) {
    const keys = ['id', 'createTime', 'updateTime', 'moduleStr']
    keys.forEach((key) => {
      if (data[key]) {
        delete data[key]
      }
    })
    return data
  }
  const { code } = await baseApi.questionAnsAdd({
    name: paperInfo.value.name,
    score: paperInfo.value.score,
    answerScore: answerScore.value,
    shopId: shopId.value,
    userId: userStore.userInfo.id,
    questionPaperId: paperInfo.value.id,
    questionAnswers
  })
  if (code === 200) {
    uni.showModal({
      title: '提示',
      content: '提交成功！',
      success: () => {}
    })
  }
}
async function getData(id: any) {
  if (!id) return
  const { data } = await baseApi.questionPaperInfo({
    id,
    detail: true
  })
  paperInfo.value = data
  list.value = data.questions
}
const shopId = ref('')
onLoad((option) => {
  getData(option?.questionPaperId)
  shopId.value = option?.shopId
})
</script>
<template>
  <view class="container">
    <!-- #ifdef MP-WEIXIN -->
    <hy-nav-bar title="群主考试中心" />
    <!-- #endif -->
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
    <view class="ptit">
      {{ paperInfo.name }}
    </view>
    <view class="remark">{{ paperInfo.remark }} </view>
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
        <view class="name">{{ item.name }}</view>
        <view class="alist" v-if="item.type === 20">
          <u-input
            v-model="item.remark"
            :height="280"
            type="textarea"
            placeholder="请输入内容，如无建议可直接点击提交"
            border
            mt3
          ></u-input>
        </view>
        <view class="alist" v-else>
          <view
            v-for="ans in item.questionOptions"
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

  .ptit {
    font-size: 46rpx;
    font-weight: bold;
    text-align: center;
    margin-top: 30rpx;
  }

  .remark {
    margin-top: 30rpx;
    color: #666;
  }

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
