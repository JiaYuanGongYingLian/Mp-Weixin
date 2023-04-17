<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { userApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'

const list = ref([])
const loaded = ref(false)
const type = ref()
async function loadData() {
  const { data } = await userApi.getAddressList({
    noPaging: true,
    detail: true
  })
  list.value = data
  loaded.value = true
}
// 选择地址
function chooseAddress(item: any) {
  if (type.value === 'setAddress') {
    const pages = getCurrentPages() // 当前页面栈
    if (pages.length > 1) {
      const beforePage = pages[pages.length - 2] // 获取上一个页面实例对象
      beforePage.$vm.setAddress(item)
    }
  }
  uni.navigateBack()
}

// 删除地址
async function delAddress(index: number) {
  const { addressId, id, userId } = list.value[index]
  await userApi.deleteAddressInfo({ addressId, id, userId })
  uni.showToast({
    title: '删除成功',
    icon: 'none',
    duration: 2000
  })
  list.value.splice(index, 1)
  const pages = getCurrentPages() // 当前页面栈
  if (pages.length > 1) {
    const beforePage = pages[pages.length - 2] // 获取上一个页面实例对象
    if (beforePage.$vm.addressData.id === addressId) {
      beforePage.$vm.setAddress({})
    }
  }
}
function delAddressConfirm(index: any) {
  uni.showModal({
    content: '确定要删除该地址吗？',
    success: (e) => {
      if (e.confirm) {
        delAddress(index)
      }
    }
  })
}
// 添加地址
function addAddress(_type = 'add', data: any) {
  loaded.value = true
  if (_type === 'edit') {
    uni.setStorageSync('routerParam', data)
  }
  let url = `/pages/addressEdit/index?type=${_type}`
  if (list.value.length === 0) {
    url = `${url}&isFirst=true`
  }
  uni.navigateTo({
    url
  })
}
// 获取微信自己的地址
function getWXAddressFn() {
  loaded.value = false
  uni.chooseAddress({
    async success(res) {
      const item = {
        cityName: res.cityName,
        street: res.detailInfo,
        districtName: res.countyName,
        phone: res.telNumber,
        provinceName: res.provinceName,
        name: res.userName
      }
      await userApi.addressAdd({
        address: item,
        defaultAddress: list.value.length === 0
      })
      loadData()
    },
    fail(_res) {
      uni.showToast({
        title: '您已禁止使用微信地址，请前往设置同意微信地址授权!',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        loaded.value = true
      }, 2000)
    }
  })
}
onLoad((option) => {
  type.value = option?.type
  loadData()
})
</script>
<template>
  <div class="container">
    <view class="empty" v-if="loaded && list.length === 0">
      <image
        class="empty-img"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/noAddress.png"
        mode="widthFix"
      ></image>
    </view>
    <view class="item" v-for="(item, index) in list" :key="index">
      <view @click="chooseAddress(item)">
        <view class="row-name">
          <text class="f-m">{{ item.address.name }}</text>
          <text class="tel">{{ item.address.phone }}</text>
        </view>
        <view class="row-adddress">
          <text
            >{{ item.address.provinceName }} {{ item.address.cityName }}
            {{ item.address.districtName }} {{ item.address.street }}</text
          >
        </view>
      </view>
      <view class="row-edit b-t">
        <view class="default">
          <text v-if="item.defaultAddress">默认地址</text>
        </view>

        <view class="op-item" @tap="delAddressConfirm(index)" v-if="!orderId">
          <image
            class="osx"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/del.png"
          ></image>
          <text>删除</text>
        </view>
        <view class="op-item" @tap="addAddress('edit', item)">
          <image
            class="osx"
            src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/newMall/edit.png"
          ></image>
          <text>编辑</text>
        </view>
      </view>
    </view>

    <view class="common-btn red add" @tap="addAddress('add')">添加新地址</view>
    <view class="common-btn red wx" @tap="getWXAddressFn">使用微信地址</view>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: 0 16rpx 110rpx;
  min-height: 100vh;
  background-color: #f5f5f5;
  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 150rpx;

    .empty-img {
      display: block;
      width: 414rpx;
      height: 336rpx;
    }
  }

  .item {
    padding: 30rpx;
    padding-bottom: 0;
    margin-top: 16rpx;
    border-radius: 8rpx;
    background-color: #fff;

    .row-name {
      display: flex;
      align-items: baseline;
      font-size: 30rpx;
      color: #333;

      .tel {
        font-size: 28rpx;
        margin-left: 20rpx;
      }
    }

    .row-adddress {
      padding: 26rpx 0;
      font-size: 28rpx;
      color: $uni-text-color-light;
      line-height: 1.4;
      word-break: break-all;
    }

    .row-edit {
      display: flex;
      align-items: center;
      font-size: 26rpx;
      color: #333;
      display: flex;
      height: 80rpx;
      position: relative;
      border-top: 1px solid #efefef;

      .op-item {
        font-size: 26rpx;
        color: $uni-text-color-light;
        margin-left: 20rpx;

        .osx {
          display: inline-block;
          vertical-align: -4rpx;
          width: 28rpx;
          height: 28rpx;
          margin-right: 8rpx;
        }
      }

      .default {
        flex: 1;
        font-size: 26rpx;
        color: #f92c1d;
      }
    }
  }

  .common-btn {
    position: fixed;
    bottom: calc(16rpx + env(safe-area-inset-bottom));
    z-index: 95;
    margin: 0;
    width: 300rpx;
    height: 80rpx;
    line-height: 80rpx;
    text-align: center;
    color: #fff;
    font-size: 32rpx;
    background: linear-gradient(to right, #f74f43, #f74f43);
    box-shadow: 4rpx 4rpx 8rpx rgba(255, 86, 177, 0.4);
  }
  .common-btn.add {
    left: 30rpx;
  }
  .common-btn.wx {
    right: 30rpx;
  }
}
</style>
