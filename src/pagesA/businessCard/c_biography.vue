<!--
 * @Description: 传记
 * @Author: Kerwin
 * @Date: 2023-07-22 03:31:09
 * @LastEditTime: 2023-07-22 04:12:07
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi } from '@/api'
import { getImgFullPath, checkLoginState } from '@/utils/index'
import { useUserStore } from '@/store'
import { m_productList } from "@/common/mock.js"

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const tabList = ref([
  {
    name: '个人履历'
  },
  {
    name: '公司介绍'
  },
  {
    name: '辉煌战绩'
  },
  {
    name: '学习活动'
  }
])
const currentTab = ref(0)
function tabChange() { }
onMounted((option) => {
  
})
</script>
<template>
  <view class="wrapper">
    <u-subsection class="tab" active-color="#fc2b55" :font-size="26" :list="tabList" v-model="currentTab"
          @change="tabChange"></u-subsection>
        <view class="infoBox">
          <view class="item">
            <text class="label">姓名：</text>
            <text class="value">钱祥龙</text>
          </view>
          <view class="item">
            <text class="label">所在城市：</text>
            <text class="value">四川省.成都市</text>
          </view>
          <view class="item">
            <text class="label">职业分类：</text>
            <text class="value">医生大健康-健康管理</text>
          </view>
          <view class="item">
            <text class="label">提供服务：</text>
            <text class="value">人参植物干细胞原液饮品</text>
          </view>
          <view class="item">
            <text class="label">职位头衔：</text>
            <text class="value">经理</text>
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
      align-items: center;
      margin: 30rpx 0;

      .label {
        color: #666;
      }
    }
  }
}
</style>
