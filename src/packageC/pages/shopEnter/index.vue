<!-- eslint-disable no-console -->
<!-- eslint-disable no-shadow -->
<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-16 09:49:21
 * @LastEditTime: 2023-11-16 17:31:21
 * @LastEditors:  Please set LastEditors
-->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, productApi, moneyApi } from '@/api'
import { getImgFullPath } from '@/utils/index'
import { isMobile } from '@/utils/common'

const shopId = ref('')
const form = ref()
let formData = reactive({
  shopType: 3,
  categoryName: '',
  categoryId: '',
  name: '',
  remark: '',
  status: 0,
  shopMoneyRules: [],
  userId: '',
  addressName: '',
  address: {
    provinceName: '',
    street: '',
    phone: '',
    other: '',
    districtId: '',
    provinceId: '',
    cityName: '',
    longitude: '',
    latitude: '',
    name: '',
    districtName: '',
    cityId: ''
  },
  invitePhone: '',
  avatar: '',
  license: '',
  bannerResources: []
})
const rules = reactive({
  categoryName: [
    {
      required: true,
      message: '请选择行业',
      // 可以单个或者同时写两个触发验证方式
      trigger: ['change', 'blur']
    }
  ],
  name: [
    {
      required: true,
      message: '请填写商家名称',
      trigger: ['change', 'blur']
    }
  ],
  addressName: [
    {
      required: true,
      message: '请选择地址',
      trigger: ['change', 'blur']
    }
  ],
  'address.other': [
    {
      required: true,
      message: '请填写详细地址',
      trigger: ['change', 'blur']
    }
  ],
  'address.name': [
    {
      required: true,
      message: '请填写联系人',
      trigger: ['change', 'blur']
    }
  ],
  'address.phone': [
    {
      required: true,
      message: '请填写联系电话',
      trigger: ['change', 'blur']
    },
    {
      // 自定义验证函数，见上说明
      validator: (rule, value, callback) => {
        return isMobile(value)
      },
      message: '手机号码不正确',
      trigger: ['change', 'blur']
    }
  ],
  avatar: {
    required: false,
    message: '请上传店铺图标',
    trigger: ['change', 'blur']
  },
  license: {
    required: false,
    message: '请上传营业执照',
    trigger: ['change', 'blur']
  },
  bannerResources: {
    required: false,
    message: '请上传店铺展示图',
    trigger: ['change', 'blur']
  },
  remark: [
    {
      required: true,
      message: '请填写商家简介',
      trigger: ['change', 'blur']
    },
    {
      min: 5,
      message: '简介不能少于5个字',
      trigger: 'change'
    }
  ]
})
const agree = ref(false)
function toProtocol() {
  const url =
    'https://www.blacksilverscore.com/download/shop_agreement_license.html'
  uni.navigateTo({
    url: `/pages/webview/index?url=${url}`
  })
}
const upload1 = ref()
const upload2 = ref()
const upload3 = ref()
const uploadUrl = ref('https://eduapi.songzi-it.com/base/api/v1/ali/sendFile')
const tempImageData = reactive({
  avatar: '',
  license: '',
  bannerResources: []
})
function uploadSuccess(data: any, index: any, lists: any, name: string) {
  if (['avatar', 'license'].includes(name)) {
    tempImageData[name] = data.data
    return
  }
  tempImageData[name].push({
    resourceUrl: data.data
  })
}
const token = uni.getStorageSync('accessToken') || ''
const header = {
  Authorization: `Bearer ${token}`,
  'Content-Type': 'multipart/form-data'
}
async function shopAdd() {
  try {
    const { code } = await productApi.shopAdd(formData)
    if (code === 200) {
      uni.showToast({
        icon: 'none',
        title: '店铺添加成功！'
      })
    }
  } catch {}
}
async function shopUpdate() {
  try {
    const { code } = await productApi.shopUpdate(formData)
    if (code === 200) {
      uni.showToast({
        icon: 'none',
        title: '店铺信息更新成功！'
      })
    }
  } catch {}
}
const submit = () => {
  // if (!agree.value) {
  //   uni.showModal({
  //     content: '入驻前需阅读并同意开心《商家入驻协议》',
  //     success: ({ confirm, cancel }) => {
  //       if (confirm) {
  //         agree.value = true
  //         submit()
  //       }
  //     }
  //   })
  //   return
  // }
  form.value.validate((valid: any) => {
    console.log(205, formData)
    if (valid) {
      formData = reactive({ ...formData, ...tempImageData })
      if (!formData.avatar) {
        uni.showToast({
          icon: 'none',
          title: '请上传店铺商标'
        })
        return
      }
      if (!formData.license) {
        uni.showToast({
          icon: 'none',
          title: '请上传营业执照'
        })
        return
      }
      if (formData.bannerResources.length < 1) {
        uni.showToast({
          icon: 'none',
          title: '请上传店铺展示图'
        })
        return
      }
      if (shopId.value) {
        shopUpdate()
      } else {
        shopAdd()
      }
    } else {
      console.log('验证失败')
    }
  })
}

// 地图选择地址
function chooseLocation() {
  uni.chooseLocation({
    success: async (res) => {
      const { latitude, longitude } = res
      if (!latitude || !longitude) return
      formData.address.latitude = latitude
      formData.address.longitude = longitude
      const { code, data } = await baseApi.reverseGeocoding({
        latitude,
        longitude
      })
      if (code !== 200) return
      const {
        provinceName,
        cityName,
        districtName,
        street,
        districtId,
        provinceId,
        cityId
      } = data
      formData.address.provinceName = provinceName
      formData.address.cityName = cityName
      formData.address.districtName = districtName
      formData.address.provinceId = provinceId
      formData.address.cityId = cityId
      formData.address.districtId = districtId
      formData.address.street = street
      formData.addressName = provinceName + cityName + districtName + street
    },
    fail: (error) => {
      console.log('error', error)
    }
  })
}
// 行业分类列表
const categoryList = ref([])
const actionSheetCallback = (e) => {
  const cate = categoryList.value[e]
  formData.categoryName = cate.name
  formData.categoryId = cate.id
}
const showPicker1 = ref(false)

async function getCategoryList() {
  try {
    const { data } = await baseApi.getCategoryList({
      pageSize: 1000,
      type: 1,
      parentId: 0
    })
    categoryList.value = data.records
    // if (formData.categoryId && categoryList.value.length > 0) {
    //   const cate = categoryList.value.find(
    //     (item) => item.id === formData.categoryId
    //   )
    //   if (cate) {
    //     formData.categoryName = cate.name
    //   }
    // }
  } catch {}
}
// 分润规则列表
const moneyRuleList = ref([])
const actionSheetCallback2 = () => {}
const showPicker2 = ref(false)

async function getMoneyRuleList() {
  try {
    const { data } = await moneyApi.moneyRuleList({
      noPaging: true,
      groupName: '红豆'
    })
    moneyRuleList.value = data
  } catch {}
}

// 店铺详情
async function getShopInfo(shopId: any) {
  try {
    const { data } = await productApi.getShopInfo({
      id: shopId,
      detail: true
    })
    const { provinceName, cityName, districtName, street } = data.address
    data.addressName = provinceName + cityName + districtName + street
    if (data.bannerResources) {
      data.bannerResources.forEach(
        (item: { url: string | undefined; resourceUrl: string }) => {
          item.url = getImgFullPath(item.resourceUrl)
        }
      )
    }
    data.categoryName = data.category.name
    formData = reactive(data)
  } catch {}
}
onLoad(async (option) => {
  if (option?.shopId) {
    shopId.value = option.shopId
    await getShopInfo(option.shopId)
  }
  await getCategoryList()
})
onReady(() => {
  getMoneyRuleList()
  form.value.setRules(rules)
})
</script>
<template>
  <view class="container">
    <u-form :model="formData" ref="form">
      <view class="section">
        <view class="title">基本信息</view>
        <u-form-item
          required
          label="行业"
          label-width="auto"
          prop="categoryName"
        >
          <u-input
            v-model="formData.categoryName"
            type="select"
            input-align="right"
            placeholder="请选择行业"
            @click="showPicker1 = true" />
          <u-action-sheet
            :list="categoryList"
            v-model="showPicker1"
            label-name="name"
            @click="actionSheetCallback"
          ></u-action-sheet
        ></u-form-item>
        <u-form-item required label="商家名称" label-width="auto" prop="name"
          ><u-input
            v-model="formData.name"
            input-align="right"
            placeholder="请填写名称"
        /></u-form-item>
        <u-form-item
          required
          label="地址"
          label-width="auto"
          prop="addressName"
          right-icon="map-fill"
          :right-icon-style="{ color: 'red' }"
          ><u-input
            v-model="formData.addressName"
            input-align="right"
            placeholder="请选择地址"
            @click="chooseLocation"
          />
        </u-form-item>
        <u-form-item
          required
          label="详细地址"
          label-width="auto"
          prop="address.other"
          ><u-input
            v-model="formData.address.other"
            input-align="right"
            placeholder="请填写详细地址"
        /></u-form-item>
        <u-form-item required label="经纬度" label-width="auto">
          <view flex
            ><u-input
              v-model="formData.address.longitude"
              input-align="center"
              placeholder="请填写经度"
            />
            <text style="color: #ccc; flex-shrink: 0">--</text>
            <u-input
              v-model="formData.address.latitude"
              input-align="right"
              placeholder="请填写纬度"
            />
          </view>
        </u-form-item>
        <u-form-item
          required
          label="商家简介"
          label-width="auto"
          prop="remark"
          label-position="top"
        >
          <u-input v-model="formData.remark" type="textarea" />
        </u-form-item>
      </view>
      <!-- <view class="section">
        <view class="title">让利规则</view>
        <u-form-item required label="红豆" label-width="auto" prop="name">
          <u-input
            v-model="formData.name"
            type="select"
            input-align="right"
            placeholder="请选择让利规则"
            @click="showPicker2 = true" />
          <u-action-sheet
            :list="moneyRuleList"
            v-model="showPicker2"
            @click="actionSheetCallback2"
          ></u-action-sheet
        ></u-form-item>
      </view> -->
      <view class="section">
        <view class="title">联系方式</view>
        <u-form-item
          required
          label="联系人"
          label-width="auto"
          prop="address.name"
          ><u-input
            v-model="formData.address.name"
            input-align="right"
            placeholder="请填写联系人"
        /></u-form-item>
        <u-form-item
          required
          label="联系电话"
          label-width="auto"
          prop="address.phone"
          ><u-input
            v-model="formData.address.phone"
            input-align="right"
            placeholder="请填写联系电话"
        /></u-form-item>
        <u-form-item label="客服专员电话" label-width="auto"
          ><u-input
            v-model="formData.invitePhone"
            input-align="right"
            placeholder="请填写开心客服专员电话"
        /></u-form-item>
      </view>
      <view class="section">
        <view class="title"
          >店铺图标/营业执照
          <text class="tips"> *请确保图片清晰，文字可辨 </text>
        </view>
        <view class="uploadBox" flex>
          <u-form-item
            label=""
            label-width="auto"
            prop="avatar"
            :border-bottom="false"
          >
            <u-upload
              ref="upload1"
              :action="uploadUrl"
              :header="header"
              name="object"
              max-count="1"
              :custom-btn="true"
              @on-success="uploadSuccess"
              index="avatar"
              :file-list="
                formData.avatar
                  ? [{ url: getImgFullPath(formData.avatar) }]
                  : []
              "
            >
              <template v-slot:addBtn>
                <view
                  class="slot-btn"
                  hover-class="slot-btn__hover"
                  hover-stay-time="150"
                >
                  <u-icon name="plus" size="80" color="#fff"></u-icon>
                  <view class="des">店铺图标</view>
                </view>
              </template>
            </u-upload>
          </u-form-item>
          <u-form-item
            label=""
            label-width="auto"
            prop="license"
            :border-bottom="false"
          >
            <u-upload
              ref="upload2"
              :action="uploadUrl"
              max-count="1"
              :custom-btn="true"
              :header="header"
              name="object"
              @on-success="uploadSuccess"
              index="license"
              :file-list="
                formData.license
                  ? [{ url: getImgFullPath(formData.license) }]
                  : []
              "
            >
              <template v-slot:addBtn>
                <view
                  class="slot-btn"
                  hover-class="slot-btn__hover"
                  hover-stay-time="150"
                >
                  <u-icon name="plus" size="80" color="#fff"></u-icon>
                  <view class="des">营业执照</view>
                </view>
              </template>
            </u-upload>
          </u-form-item>
        </view>
      </view>
      <view class="section">
        <view class="title">店铺展示图</view>
        <u-upload
          ref="upload3"
          :action="uploadUrl"
          max-count="10"
          :header="header"
          name="object"
          @on-success="uploadSuccess"
          index="bannerResources"
          :file-list="formData.bannerResources"
        ></u-upload>
      </view>
    </u-form>
    <!-- <view class="protocol">
      <u-checkbox-group>
        <u-checkbox v-model="agree"
          >我已阅读并同意
          <text class="link" @click="toProtocol">《商家入驻协议》</text>
        </u-checkbox>
      </u-checkbox-group>
    </view> -->
    <u-button class="submitBtn" @click="submit" type="primary" ripple
      >提交</u-button
    >
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 22rpx;

  .section {
    padding: 30rpx 24rpx;
    background: #fff;
    border-radius: 16rpx;
    margin-bottom: 30rpx;

    .title {
      font-size: 28rpx;
      margin-bottom: 10rpx;
    }

    .tips {
      font-size: 20rpx;
      color: red;
    }
  }
}

.protocol {
  text-align: center;
  display: flex;
  justify-content: center;
  margin: 50rpx 0 30rpx 0;

  .link {
    color: #6b9eff;
  }
}

.slot-btn {
  width: 200rpx;
  height: 200rpx;
  border-radius: 16rpx;
  background-color: rgb(244, 245, 246);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;

  .des {
    position: absolute;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    text-align: center;
    width: 100%;
    padding: 10rpx;
    font-size: 24rpx;
    color: #fff;
    height: 50rpx;
    line-height: 40rpx;
  }
}

.uploadBox {
  gap: 20rpx;
  margin-top: 20rpx;
}

.submitBtn {
  margin: 50rpx 0;
  display: block;
}
</style>
