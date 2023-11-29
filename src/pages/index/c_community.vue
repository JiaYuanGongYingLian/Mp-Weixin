<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-11-19 15:06:58
 * @LastEditTime: 2023-11-29 10:17:35
 * @LastEditors:  Please set LastEditors
-->
<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getMockData } from '@/api'

const myCommunities = ref([
  {
    name: '我的主群',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/5d621db8-da29-429e-80fc-a61276ef5072.svg',
    msg: '群友们，趁有空赶紧看……',
    roleId: 401
  },
  {
    name: '我的副群',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/b21c2e15-d5d3-4225-8b4a-cf41ea64286e.svg',
    msg: '群友们，趁有空赶紧看……',
    roleId: 0
  }
])
const mainModules = ref([
  {
    name: '超值拼团',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/53c11fb1-a1e7-4848-9f4e-f3e66b7bcbbb.png',
    msg: '趣味拼团,约好友一起来…',
    bg: 'linear-gradient(90deg, #F1F4FE 0%, #DEE5FC 100%)'
  },
  {
    name: '限时秒杀',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/f6b8bcdf-e754-4e4d-aeea-941393a062dc.png',
    msg: '超值好货 等你来秒…',
    bg: 'linear-gradient(90deg, #FDF7E7 0%, #FAEDCA 100%)'
  },
  {
    name: '积分专区',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/c0d66b9c-dcb2-445d-a85e-e8a0f6d471ae.png',
    msg: '累计积分，总换好物…',
    bg: 'linear-gradient(90deg, #FDEFE7 0%, #FADBCA 100%)'
  },
  {
    name: '福利专区',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/8b03983b-9d5d-4fd8-bbdb-3bfabe211060.png',
    msg: '源头厂家，红包天天见…',
    bg: 'linear-gradient(90deg, #F1FAFE 0%, #DEF3FC 100%)'
  },
  {
    name: '学生专区',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/926019bc-8b73-4268-80f4-1a537bcee6de.png',
    msg: '让每个孩子都能绽放自己…',
    bg: 'linear-gradient(90deg, #F1F4FE 0%, #DEE5FC 100%)'
  },
  {
    name: '生活专区',
    icon: 'https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/e2437040-69f0-4f3b-82c1-19e943982538.png',
    msg: '生活缴费,生活服务…',
    bg: 'linear-gradient(90deg, #FDF7E7 0%, #FAEDCA 100%)'
  }
])
function handleClick(data) {
  uni.navigateTo({
    url: '/pages/physicalShop/index?shopId=9'
  })
}
function toGroup(item: { roleId: any }) {
  const { roleId } = item
  uni.navigateTo({
    url: `/packageA/pages/chatGroup/index?roleId=${roleId}`
  })
}
onMounted(async () => {
  // cates.value = await getMockData('cates')
})
</script>
<template>
  <view class="c_container">
    <view class="tit flex">
      <view class="left">
        <u-image
          height="44rpx"
          width="295rpx"
          src="https://family-service-platform.oss-cn-chengdu.aliyuncs.com/uploads/27ce6881-1979-4ce5-9480-e806d48d1b93.png"
        />
      </view>
      <view class="right flex">
        <text style="color: rgba(0, 0, 0, 0.45)">查看详情</text>
        <u-icon name="arrow-right" size="26" color="rgba(0,0,0,0.45)"></u-icon>
      </view>
    </view>
    <view class="cBox flex">
      <view class="item" v-for="(item, index) in myCommunities" :key="index">
        <view class="top" @click="toGroup(item)">
          <u-image width="88rpx" height="88rpx" :src="item.icon"></u-image>
          <view class="right">
            <view class="name">{{ item.name }}</view>
            <u-button
              shape="circle"
              color="#fff"
              size="mini"
              type="primary"
              ripple
              :custom-style="{
                background: '#fff',
                color: '#000',
                width: '104rpx',
                height: '32rpx',
                fontSize: '20rpx',
                borderColor: '#fff'
              }"
              :hair-line="false"
              @click="toGroup(item)"
              >立即进入</u-button
            >
          </view>
        </view>
        <view class="msg">{{ item.msg }}</view>
      </view>
    </view>
    <view class="aBox">
      <view
        class="item"
        v-for="(item, index) in mainModules"
        :key="index"
        :style="{ background: item.bg }"
        @click="handleClick(item)"
      >
        <view class="con">
          <view class="name">
            <text>{{ item.name }}</text>
            <u-icon name="play-right-fill" size="16"></u-icon>
          </view>
          <view class="msg">{{ item.msg }}</view>
        </view>
        <u-image width="102rpx" height="102rpx" :src="item.icon"></u-image>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/styles/helper.scss';
.c_container {
  background: rgba(255, 255, 255, 1);
  border-radius: 24rpx;
  padding: 16rpx;
  width: 702rpx;
  margin: 0 auto;
  box-sizing: border-box;
  .tit {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .right {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .cBox {
    justify-content: space-between;
    margin-top: 25rpx;
    .item {
      width: 323rpx;
      background: linear-gradient(90deg, #edf1f9 0%, #fcf2f3 100%);
      border-radius: 24rpx;
      padding: 32rpx 16rpx;
      box-sizing: border-box;
      .top {
        display: flex;
        justify-content: flex-start;
        .right {
          margin-left: 16rpx;
          .name {
            font-size: 32rpx;
            font-weight: 800;
            line-height: 32rpx;
            color: '#000';
            margin-bottom: 23rpx;
          }
        }
      }
      .msg {
        font-size: 22rpx;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22rpx;
        margin-top: 32rpx;
        @include ellipsis;
      }
    }
  }
  .aBox {
    display: flex;
    justify-content: space-between;
    margin-top: 25rpx;
    flex-wrap: wrap;
    .item {
      width: 323rpx;
      background: linear-gradient(90deg, #edf1f9 0%, #fcf2f3 100%);
      border-radius: 24rpx;
      padding: 32rpx 16rpx;
      box-sizing: border-box;
      margin-bottom: 16rpx;
      display: flex;
      align-items: center;
      .con {
        margin-right: 4rpx;
        text-align: left;
        .name {
          font-size: 32rpx;
          font-weight: 800;
          line-height: 32rpx;
          color: '#000';
          margin-bottom: 16rpx;
          display: flex;
          justify-content: flex-start;
        }
        .msg {
          font-size: 20rpx;
          color: rgba(0, 0, 0, 0.45);
          line-height: 22rpx;
        }
      }
    }
  }
}
</style>
