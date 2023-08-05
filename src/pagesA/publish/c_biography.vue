<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-30 11:32:40
 * @LastEditTime: 2023-08-05 17:43:27
 * @LastEditors:  Please set LastEditors
-->

<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import { isMObile } from '@/utils/common'

const userStore = useUserStore()
const { hasLogin } = storeToRefs(userStore)
const form = ref()
let formData = reactive({
  avatar: '',
  categoryName: '',
  categoryId: '',
  name: '',
  remark: '',
  status: 0,
  shopProductSkuMoney: '',
  userId: '',
  addressName: '',
  provinceName: '',
  districtId: '',
  provinceId: '',
  cityName: '',
  districtName: '',
  cityId: '',
  license: '',
  bannerResources: [],
  companyRemark: ''
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
  avatar: {
    required: false,
    message: '请上传头像',
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
const uploadUrl = ref(
  'https://api.blacksilverscore.com/base/api/v1/ali/sendFile'
)
const tempImageData = reactive({
  avatar: '',
  coverImage: '',
  license: '',
  bannerResources: []
})
function uploadSuccess(data: any, index: any, lists: any, name: string) {
  if (['avatar', 'coverImage', 'license'].includes(name)) {
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
  // #ifdef MP-WEIXIN
  'Content-Type': 'multipart/form-data'
  // #endif
}
// 名人分类列表
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
      parentId: 500000
    })
    categoryList.value = data.records
  } catch {}
}
// 地图选择地址
function chooseLocation() {
  uni.chooseLocation({
    success: async (res) => {
      const { latitude, longitude } = res
      if (!latitude || !longitude) return
      const { code, data } = await baseApi.reverseGeocoding({
        latitude,
        longitude
      })
      if (code !== 200) return
      const {
        provinceName,
        cityName,
        districtName,
        districtId,
        provinceId,
        cityId
      } = data
      formData.provinceName = provinceName
      formData.cityName = cityName
      formData.districtName = districtName
      formData.provinceId = provinceId
      formData.cityId = cityId
      formData.districtId = districtId
      formData.addressName = provinceName + cityName + districtName
    },
    fail: (error) => {
      console.log('error', error)
    }
  })
}
const submit = () => {
  if (!agree.value) {
    uni.showModal({
      content: '勾选《传记发布申请协议》',
      success: ({ confirm, cancel }) => {
        if (confirm) {
          agree.value = true
          submit()
        }
      }
    })
    return
  }
  form.value.validate((valid: any) => {
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
      //   if (shopId.value) {
      //     shopUpdate()
      //   } else {
      //     shopAdd()
      //   }
    } else {
      console.log('验证失败')
    }
  })
}

onReady(() => {
  form.value.setRules(rules)
})
onLoad(async (option) => {
  await getCategoryList()
})
</script>
<template>
  <view class="container">
    <u-form :model="formData" ref="form" :label-style="{ fontWeight: 'bold' }">
      <view class="section">
        <u-form-item label="头像" label-width="auto" required>
          <u-upload
            ref="upload1"
            :action="uploadUrl"
            max-count="1"
            :header="header"
            name="object"
            @on-success="uploadSuccess"
            index="avatar"
            :file="true"
            :file-list="
              formData.avatar ? [{ url: getImgFullPath(formData.avatar) }] : []
            "
          ></u-upload>
        </u-form-item>
        <u-form-item label="传记主图" label-width="auto" required>
          <u-upload
            ref="upload1"
            :action="uploadUrl"
            max-count="1"
            :header="header"
            name="object"
            @on-success="uploadSuccess"
            index="coverImage"
            :file="true"
            :file-list="
              formData.avatar ? [{ url: getImgFullPath(formData.avatar) }] : []
            "
          ></u-upload>
        </u-form-item>
        <u-form-item required label="姓名" label-width="auto" prop="name"
          ><u-input
            v-model="formData.name"
            input-align="right"
            placeholder="请填写真实姓名"
        /></u-form-item>
        <u-form-item
          required
          label="电话"
          label-width="auto"
          prop="address.phone"
          ><u-input
            v-model="formData.phone"
            input-align="right"
            placeholder="请填写联系电话"
            type="number"
        /></u-form-item>
        <u-form-item
          required
          label="职业分类"
          label-width="auto"
          prop="categoryName"
        >
          <u-input
            v-model="formData.categoryName"
            type="select"
            input-align="right"
            placeholder="请选择职业"
            @click="showPicker1 = true" />
          <u-action-sheet
            :list="categoryList"
            v-model="showPicker1"
            label-name="name"
            @click="actionSheetCallback"
          ></u-action-sheet
        ></u-form-item>
        <u-form-item required label="对接金额" label-width="auto" prop="name"
          ><u-input
            v-model="formData.shopProductSkuMoney"
            input-align="right"
            placeholder="请填写对接金额（10~1w）"
            type="number"
          />
          （元）</u-form-item
        >
        <u-form-item
          required
          label="所在城市"
          label-width="auto"
          prop="addressName"
          right-icon="map-fill"
          :right-icon-style="{ color: 'red' }"
          ><u-input
            v-model="formData.addressName"
            input-align="right"
            placeholder="请选择地区"
            @click="chooseLocation"
          />
        </u-form-item>
        <u-form-item
          required
          label="企业简介"
          label-width="auto"
          prop="remark"
          label-position="top"
        >
          <u-input v-model="formData.remark" type="textarea" />
        </u-form-item>
        <u-form-item label="企业电话" label-width="auto"
          ><u-input
            v-model="formData.invitePhone"
            input-align="right"
            placeholder="请填写电话"
        /></u-form-item>
        <u-form-item label="荣誉证书" label-width="auto">
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
        </u-form-item>
      </view>
    </u-form>
    <view class="protocol">
      <u-checkbox-group>
        <u-checkbox v-model="agree"
          >我已阅读并同意
          <text class="link" @click="toProtocol">《传记发布申请协议》</text>
        </u-checkbox>
      </u-checkbox-group>
    </view>
    <u-button class="submitBtn" @click="submit" type="primary" ripple
      >提交</u-button
    >
  </view>
</template>

<style lang="scss" scoped>
.container {
  padding: 22rpx;
  .section {
    padding: 30rpx 30rpx;
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
