<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { userApi } from '@/api'

const routerParam = ref({})
let addressData = reactive({
  cityName: '',
  street: '',
  districtName: '',
  phone: '',
  provinceName: '',
  name: ''
})
const regionArr = ref([])
const defaultAddress = ref(false)
const type = ref()
// 默认地址选择
function switchChange(e: { detail: { value: boolean } }) {
  defaultAddress.value = e.detail.value
}
// 地址选择
function changeRegionFn(e: { detail: { value: any } }) {
  regionArr.value = e.detail.value
}

// 提交
async function confirm() {
  const [p, c, d] = regionArr.value
  addressData.provinceName = p
  addressData.cityName = c
  addressData.districtName = d
  if (!addressData.name) {
    uni.showToast({
      title: '请填联系人人姓名',
      icon: 'none',
      duration: 2000
    })
    return
  }
  if (addressData.phone === '') {
    uni.showToast({
      title: '请填写手机号码',
      icon: 'none',
      duration: 2000
    })
    return
  }
  if (!/(^1[3|4|5|6|7|8|9][0-9]{9}$)/.test(addressData.phone)) {
    uni.showToast({
      title: '请填写正确的手机号码',
      icon: 'none',
      duration: 2000
    })
    return
  }
  if (
    !addressData.provinceName ||
    !addressData.cityName ||
    !addressData.districtName
  ) {
    uni.showToast({
      title: '请选择所在地',
      icon: 'none',
      duration: 2000
    })
    return
  }
  if (!addressData.street) {
    uni.showToast({
      title: '请填写您的详细地址',
      icon: 'none',
      duration: 2000
    })
    return
  }
  uni.showLoading({ title: '', mask: true })
  const { provinceName, cityName, districtName, street, phone, name } =
    addressData
  const { id, addressId, userId } = routerParam.value
  const executor =
    type.value === 'edit' ? userApi.updateAddressInfo : userApi.addressAdd
  await executor({
    address: {
      provinceName,
      cityName,
      districtName,
      street,
      phone,
      name
    },
    id,
    userId,
    addressId,
    defaultAddress: defaultAddress.value
  })
  uni.showToast({
    title: `地址${type.value === 'edit' ? '修改' : '添加'}成功`,
    icon: 'none',
    duration: 2000
  })
  setTimeout(() => {
    const pages = getCurrentPages() // 当前页面栈
    if (pages.length > 1) {
      const beforePage = pages[pages.length - 2] // 获取上一个页面实例对象
      beforePage.$vm.loadData()
    }
    uni.navigateBack()
  }, 1000)
}

onLoad((option) => {
  type.value = option?.type
  if (type.value === 'edit') {
    routerParam.value = uni.getStorageSync('routerParam')
    addressData = reactive(routerParam.value.address)
    const { provinceName, cityName, districtName } = addressData
    regionArr.value = [provinceName, cityName, districtName]
  }
})
</script>
<template>
  <view class="content">
    <view class="row b-b">
      <view class="tit">联系人</view>
      <input
        class="input"
        type="text"
        v-model="addressData.name"
        maxlength="20"
        placeholder="收货人姓名"
        placeholder-class="placeholder"
      />
    </view>
    <view class="row b-b">
      <view class="tit">手机号</view>
      <input
        class="input"
        type="number"
        maxlength="11"
        v-model="addressData.phone"
        placeholder="收货人手机号码"
        placeholder-class="placeholder"
      />
    </view>
    <view class="row icon-row b-b">
      <view class="tit">选择地区</view>
      <view class="input">
        <picker @change="changeRegionFn" mode="region" :value="regionArr">
          <view class="uni-input"
            >{{ regionArr[0] }}{{ regionArr[1] }}{{ regionArr[2]
            }}<view class="place" v-if="!regionArr[0]">请选择地址</view>
          </view>
        </picker>
      </view>
      <image
        class="rightImg"
        src="https://naoyuekang-weixindev.oss-cn-chengdu.aliyuncs.com/mine/right-g.png"
      ></image>
    </view>
    <view class="row icon-row b-b">
      <view class="tit">详细地址</view>
      <input
        class="input"
        type="text"
        v-model="addressData.street"
        maxlength="50"
        placeholder="楼号、门牌等"
        placeholder-class="placeholder"
      />
    </view>

    <view class="row default-row">
      <view class="tit">设为默认</view>
      <switch
        :checked="defaultAddress"
        color="#f92c1d"
        @change="switchChange"
      />
    </view>

    <view @tap="confirm" class="add-btn">提交</view>
  </view>
</template>

<style lang="scss" scoped>
.content {
  padding-top: 16rpx;
  min-height: 100vh;
  background-color: #f5f5f5;

  .row {
    display: flex;
    align-items: center;
    position: relative;
    padding: 0 30rpx;
    height: 110rpx;
    background: #fff;
    border-bottom: 1px solid #efefef;

    &.icon-row {
      padding-right: 10rpx;
    }

    .tit {
      flex-shrink: 0;
      width: 152rpx;
      font-size: 30rpx;
      color: $text-color-dark;
    }

    .input {
      flex: 1;
      font-size: 30rpx;
      color: $text-color-dark;
    }

    .osx {
      font-size: 36rpx;
      color: $text-color-light;
      padding: 20rpx;
    }

    .place {
      font-size: 30rpx;
      color: #808080;
    }

    .rightImg {
      width: 12rpx;
      height: 21rpx;
      margin-right: 20rpx;
      margin-left: 20rpx;
      vertical-align: -1rpx;
    }

    .osx-you {
      font-size: 32rpx;
    }
  }

  .default-row {
    margin-top: 16rpx;

    .tit {
      flex: 1;
    }

    switch {
      transform: translateX(16rpx) scale(0.9);
    }
  }

  .add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 690rpx;
    height: 80rpx;
    margin: 60rpx auto;
    font-size: 30rpx;
    color: #fff;
    background-color: $base-color-mall;
    border-radius: 10rpx;
    box-shadow: 1px 2px 5px rgba(219, 63, 96, 0.4);
  }
}
</style>
