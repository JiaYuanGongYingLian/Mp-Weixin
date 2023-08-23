<!--
 * @Description: 传记
 * @Author: Kerwin
 * @Date: 2023-07-22 03:31:09
 * @LastEditTime: 2023-08-23 16:24:42
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, checkLoginState, previewImage } from '@/utils/index'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const props = withDefaults(
  defineProps<{
    info?: object
  }>(),
  {
    info() {
      return {}
    }
  }
)
const tabList = ref([
  {
    name: '个人履历'
  },
  {
    name: '公司介绍'
  },
  {
    name: '辉煌战绩'
  }
])

const currentTab = ref(0)
function tabChange() {}
function previewImageFn(arr: { resourceUrl: string }[], i: number) {
  const pics = arr?.map((item: { resourceUrl: string }) =>
    getImgFullPath(item.resourceUrl)
  )
  previewImage(pics, i)
}
onMounted((option) => {})
</script>
<template>
  <view class="wrapper">
    <u-subsection
      class="tab"
      active-color="#fc2b55"
      :font-size="26"
      :list="tabList"
      v-model="currentTab"
      @change="tabChange"
    ></u-subsection>
    <view class="infoBox">
      <view
        v-if="currentTab === 0"
        class="u-transition u-fade-enter-to u-fade-enter-active"
      >
        <view class="item">
          <text class="label">姓名：</text>
          <text class="value">{{ info.name }}</text>
        </view>
        <view class="item">
          <text class="label">所在城市：</text>
          <text class="value" v-if="info?.provinceName">{{
            `${info?.provinceName}-${info?.cityName}`
          }}</text>
        </view>
        <view class="item">
          <text class="label">职业分类：</text>
          <text class="value">{{ info?.jobTagName }}</text>
        </view>
        <view class="item">
          <text class="label">职位头衔：</text>
          <text class="value"> {{ info.postRemark }}</text>
        </view>
        <view class="item">
          <text class="label">提供服务：</text>
          <text class="value" v-if="info?.serviceTags">
            {{ `${info?.serviceRemark}(${info?.serviceTags})` }}</text
          >
        </view>
        <view class="item">
          <text class="label">人物导语：</text>
          <text class="value"> {{ info.motto }}</text>
        </view>
        <u-divider
          class="divider"
          fontSize="30"
          margin-top="30"
          margin-botom="20"
          >个人履历</u-divider
        >
        <view class="textCon">{{ info.resume }}</view>
        <u-image
          mode="widthFix"
          v-for="(item, index) in info.resumeResources"
          :key="item.id"
          :src="getImgFullPath(item.resourceUrl)"
          @click="previewImageFn(info.resumeResources, index)"
        ></u-image>
      </view>
      <view
        v-if="currentTab === 1 || currentTab === 0"
        class="u-transition u-fade-enter-to u-fade-enter-active"
      >
        <u-divider class="divider" fontSize="30" margin-top="30"
          >公司介绍</u-divider
        >
        <view class="textCon">{{ info.companyRemark }}</view>
        <u-image
          mode="widthFix"
          v-for="(item, index) in info.companyResources"
          :key="item.id"
          :src="getImgFullPath(item.resourceUrl)"
          @click="previewImageFn(info.companyResources, index)"
        ></u-image>
      </view>
      <view
        v-if="currentTab === 2 || currentTab === 0"
        class="u-transition u-fade-enter-to u-fade-enter-active"
      >
        <u-divider class="divider" fontSize="30" margin-top="30"
          >辉煌战绩</u-divider
        >
        <view class="textCon">{{ info.honorRemark }}</view>
        <u-image
          mode="widthFix"
          v-for="(item, index) in info.honorResources"
          :key="item.id"
          :src="getImgFullPath(item.resourceUrl)"
          @click="previewImageFn(info.honorResources, index)"
        ></u-image>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';

.wrapper {
  .infoBox {
    .item {
      display: flex;
      align-items: top;
      margin: 20rpx 0;
      line-height: 52rpx;

      .label {
        color: #666;
        flex-shrink: 0;
      }
    }
  }
  :deep(.divider) {
    margin-top: 30rpx;
    margin-bottom: 20rpx !important;
  }
  .textCon {
    line-height: 56rpx;
    margin-bottom: 20rpx;
  }
}
</style>
