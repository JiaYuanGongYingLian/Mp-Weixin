<!-- eslint-disable no-console -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-09 11:39:30
 * @LastEditTime: 2023-07-12 11:31:01
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, userApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)
const bannerList = ref([])
const info = ref({})
const tabList = ref([
  {
    name: '传记'
  },
  {
    name: '主页'
  },
  {
    name: '橱窗'
  },
  {
    name: '排行榜'
  }
])
const currentTab = ref(0)
const showPop = ref(false)
function handleClick() {
  showPop.value = true
}
const form = reactive({
  name: '',
  phone: '',
  remark: ''
})
const rules = reactive({
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: ['blur', 'change']
    }
  ]
})
const form1 = ref()
async function getUserInfo() {
  try {
    const { data } = await userApi.userInfo()
    info.value = data
  } catch {}
}
function submit() {
  form1.value.validate((valid: any) => {
    if (valid) {
      console.log('验证通过')
    } else {
      console.log('验证失败')
    }
  })
}
function tabChange(index: number) {
  if (index === 1) {
    uni.navigateTo({
      url: '/pagesA/businessCard/index',
      success: () => {
        currentTab.value = 0
      }
    })
  }
}
onLoad((option) => {
  if (option) {
    getUserInfo()
  }
})
onReady(() => {
  try {
    form1.value.setRules(rules)
  } catch {}
})
</script>
<template>
  <view class="container">
    <hy-nav-bar
      title="名人详情"
      :background="{ background: '#fff' }"
    ></hy-nav-bar>
    <view class="head-view">
      <view class="h-item">
        <u-icon class="icon" name="eye" size="26" />
        <text>浏览量： 1205</text>
      </view>
      <view class="gap-line-v"></view>
      <view class="h-item">
        <u-icon class="icon" name="thumb-up" size="26" />
        <text>点赞： 1001</text>
      </view>
    </view>
    <view class="main-view">
      <u-subsection
        class="tab"
        :list="tabList"
        v-model="currentTab"
        @change="tabChange"
      ></u-subsection>
      <view class="resume">
        <view class="video"></view>
        <view class="avatar">
          <u-image
            :src="getImgFullPath(info.avatar)"
            width="100%"
            height="auto"
            mode="widthFix"
          ></u-image>
        </view>
        <view class="intro">
          <view class="tit">个人介绍</view>
          <view class="content">
            <view>
              <text class="label">姓名：</text>
              <text class="value">{{ info.nickname }}</text>
            </view>
            <view>
              <text class="label">常住地：</text>
              <text class="value">{{ info.nickname }}</text>
            </view>
            <view>
              <text class="label">现任：</text>
              <text class="value">{{ info.nickname }}</text>
            </view>
            <view>
              <text class="label">提供服务：</text>
              <text class="value">{{ info.nickname }}</text>
            </view>
          </view>
        </view>
        <view class="intro">
          <view class="tit">个人履历</view>
          <view class="content">
            工商管理博士，30年企业运营管理经验。九型人格性格密码实战工具(9分59秒读懂您工具)创始人，
            十年讲师经验。擅长运营，营销，会销，讲课……
          </view>
        </view>
      </view>
      <view class="protocol">
        <u-image
          src="https://image.blacksilverscore.com/uploads/a9ee3385-c389-436b-ae7a-d9e7c522fa36.png"
          mode="widthFix"
        ></u-image>
        <view>
          1.平台搭建自由，自主，自愿的良好商业生态，自由资源对接请教经验，学习。平台不参与任何对接人和被对接人的商业合作，
          至于您和自己对接的人是否合作，合作到什么程度均与平台无关，平台也无权干涉。
          <br />
          2.您的传记发布后，如有名人对接您，24小时内您未回复，系统将默认您同意对接！
        </view>
      </view>
      <view class="protocol">
        <u-image
          mode="widthFix"
          src="https://image.blacksilverscore.com/uploads/dc5179da-8505-4915-8f0c-7626ef9bc26a.png"
        ></u-image>
        <view>
          黑银平台本着开放自由自主自愿的原则，对接人付费向被对接人学习经验或请教问题等。用户自主选择对接自己需要的资源，
          被对接的人会在24小时内选择回复，
          请在［已对接］里面查看。如果同意对接，会看到联系方式，如果拒绝对接，支付的请教经验费用将会在24小时内自动退回。
          <br />
          在闲时多对接名人，多为自己储备资源，以备不时之需，多认识一个名人朋友，自己多一次成功的机会。
        </view>
      </view>
    </view>
    <view class="action-view">
      <u-button class="btn" shape="circle" ripple @click="handleClick"
        >立即对接</u-button
      >
    </view>
    <u-popup
      v-model="showPop"
      mode="center"
      width="298px"
      closeable
      border-radius="20"
      close-icon-color="#fff"
      close-icon="close-circle"
      close-icon-size="40"
    >
      <view class="pop-head">
        <u-image
          src="https://image.blacksilverscore.com/uploads/05a779ee-c342-49be-a9da-541f2d9a614d.png"
          width="100%"
          height="130px"
        ></u-image>
        <view class="head-con">
          <view class="pop-tit">对接提示</view>
          <view class="des">
            您支付咨询费用后，如果此名人自己点击同意后，您可以在“已对接”里面看到名人回复的电话号码信息，若名人拒绝您的对接，资金将在24小时内退回。
          </view>
        </view>
      </view>
      <view class="pop-body">
        <view class="label">被对接人</view>
        <view class="card">
          <u-image :src="getImgFullPath(info.avatar)"></u-image>
          <view>
            <view class="name">{{ info.nickName }}</view>
          </view>
        </view>
        <view class="label">对接人</view>
        <u-form :model="form" ref="form1">
          <u-form-item label="姓名" prop="name">
            <u-input v-model="form.name" />
          </u-form-item>
        </u-form>
        <u-button @click="submit" shape="circle" type="primary" ripple
          >提交</u-button
        >
      </view>
    </u-popup>
  </view>
</template>

<style lang="scss" scoped>
.head-view {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24rpx;
  background: #fff;
  padding: 16rpx 0;
  margin-bottom: 10rpx;
  .h-item {
    .icon {
      margin-right: 10rpx;
    }
  }
}
.gap-line-v {
  height: 20rpx;
  width: 1rpx;
  background: #505050;
  margin: 0 20rpx;
}
.main-view {
  background: #fff;
  padding: 20rpx;
  padding-bottom: 130rpx;
  .tab {
    margin-top: 10rpx;
    position: sticky;
    top: 0;
    z-index: 2;
  }
  .resume {
    .intro {
      .tit {
        color: #d00000;
        position: relative;
        padding-left: 30rpx;
        font-weight: bold;
        font-size: 30rpx;
        margin-bottom: 10rpx;
        &::before {
          content: '';
          display: inline-block;
          width: 16rpx;
          height: 16rpx;
          background: #d00000;
          border-radius: 50%;
          position: absolute;
          left: 0;
          top: 14rpx;
        }
      }
      .content {
        padding: 10rpx 30rpx;
        line-height: 40rpx;
        font-size: 26rpx;
        > view {
          margin-bottom: 10rpx;
        }
        .label {
          font-size: 26rpx;
          color: #101010;
          font-weight: 700;
        }
      }
    }
  }
}
.protocol {
  & > view {
    padding: 10rpx 20rpx;
    font-size: 24rpx;
  }
}
.action-view {
  position: fixed;
  bottom: calc(40rpx + env(safe-area-inset-bottom));
  width: 100%;
  padding: 0 30rpx;
  .btn {
    background: #e32622;
    cursor: pointer;
    width: 80%;
    color: #fff;
    font-size: 32rpx;
    padding-bottom: 8rpx;
    font-weight: 700;
    border: none;
    background-image: -webkit-gradient(
      linear,
      50% 0%,
      50% 100%,
      color-stop(0%, transparent),
      color-stop(100%, rgba(0, 0, 0, 0.3))
    );
    -webkit-animation-name: orangellowPulse;
    -webkit-animation-duration: 1s;
    -webkit-animation-iteration-count: infinite;
    &::after {
      border: 0;
    }
  }
}
@keyframes orangellowPulse {
  0% {
    background-color: #e32622;
    box-shadow: inset 0 0.3rem 0.2rem rgba(255, 255, 255, 0.2),
      inset 0 -0.3rem 0.2rem rgba(0, 0, 0, 0.2),
      0 0.2rem 0.4rem rgba(0, 0, 0, 0.2);
  }
  50% {
    background-color: #e32622;
    box-shadow: inset 0 0.4rem 0.3rem rgba(255, 255, 255, 0.2),
      inset 0 -0.2rem 0.2rem rgba(0, 0, 0, 0.2),
      0 0.2rem 0.6rem rgba(0, 0, 0, 0.2);
  }
  100% {
    background-color: #e32622;
    box-shadow: inset 0 0.5rem 0.4rem rgba(255, 255, 255, 0.2),
      inset 0 -0.1rem 0.2rem rgba(0, 0, 0, 0.2),
      0 0.2rem 0.8rem rgba(0, 0, 0, 0.2);
  }
}
.pop-head {
  position: relative;
  color: #fff;
  .head-con {
    position: absolute;
    width: 100%;
    left: 0;
    top: 20px;
    .pop-tit {
      text-align: center;
      font-size: 32rpx;
      font-weight: bold;
    }
    .des {
      padding: 20rpx;
      font-size: 24rpx;
    }
  }
}
.pop-body {
  padding: 30rpx;
}
</style>
