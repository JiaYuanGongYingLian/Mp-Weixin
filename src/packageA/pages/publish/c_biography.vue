<!-- eslint-disable no-param-reassign -->
<!-- eslint-disable no-console -->
<!-- eslint-disable no-use-before-define -->
<!-- eslint-disable no-unused-expressions -->
<!-- eslint-disable no-plusplus -->
<!-- eslint-disable no-empty -->
<!--
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-30 11:32:40
 * @LastEditTime: 2023-08-31 15:59:23
 * @LastEditors:  Please set LastEditors
-->

<!-- eslint-disable @typescript-eslint/no-empty-function -->
<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
import { reactive, ref, computed, onMounted } from 'vue'
import { onLoad, onShow, onReady } from '@dcloudio/uni-app'
import { storeToRefs } from 'pinia'
import { baseApi, socialApi } from '@/api'
import { getImgFullPath, getDistance } from '@/utils/index'
import { useUserStore } from '@/store'
import { isMobile } from '@/utils/common'
import c_recorder from './c_recorder.vue'
import rules from './rules.ts'

const userStore = useUserStore()
const { hasLogin, userInfo } = storeToRefs(userStore)
const form = ref()
const isEdit = ref(false)
let formData = reactive({
  avatar: '',
  coverImage: '',
  companyRemark: '',
  companyResources: [],
  honorRemark: '',
  honorResources: [],
  name: '',
  remark: '',
  resume: '',
  resumeResources: [],
  status: 0,
  userId: userInfo.value.id,
  addressName: '',
  provinceName: '',
  districtId: '',
  provinceId: '',
  cityName: '',
  districtName: '',
  cityId: '',
  jobTagId: 0,
  jobTagName: '',
  motto: '',
  phone: null,
  postRemark: '',
  serviceRemark: '',
  serviceTags: '',
  shopProductSkuMoney: null
})

const agree = ref(false)
function toProtocol() {
  const url =
    'https://www.blacksilverscore.com/download/shop_agreement_license.html'
  uni.navigateTo({
    url: `/packageA/pages/webview/index?url=${url}`
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
  resumeResources: [],
  honorResources: [],
  companyResources: []
})
function uploadSuccess(data: any, index: any, lists: any, name: string) {
  if (['avatar', 'coverImage'].includes(name)) {
    tempImageData[name] = data.data
    return
  }
  uni.getImageInfo({
    src: getImgFullPath(data.data),
    success(image) {
      tempImageData[name].push({
        resourceUrl: data.data,
        width: image.width,
        height: image.height
      })
    }
  })
}
const header = {
  Authorization: `Bearer ${uni.getStorageSync('accessToken') || ''}`,
  // #ifdef MP-WEIXIN
  'Content-Type': 'multipart/form-data'
  // #endif
}
// PICKER
const jobList = ref([])
const serviceList = ref([])

const showPicker1 = ref(false)
const showPicker2 = ref(false)

const TYPEMAP = {
  JOB: 1,
  SERVICE: 2,
  PROVIDESERVICE: 3,
  FINDSERVICE: 4
}
async function getTagList(type: number, parentId?: any) {
  try {
    const { data } = await socialApi.userDetailTagList({
      type,
      parentId,
      noPaging: true
    })
    if (type === TYPEMAP.JOB) {
      jobList.value = treeTrans(data)
    }
    if (type === TYPEMAP.SERVICE) {
      serviceList.value = treeTrans(data)
    }
  } catch {}
}
function treeTrans(data: { parentId: number; id: number }[]) {
  const p = data.filter((item: { parentId: number }) => {
    return item.parentId === 0
  })
  for (let i = 0; i < p.length; i++) {
    for (let j = 0; j < data.length; j++) {
      if (p[i].id === data[j].parentId) {
        p[i].children !== undefined
          ? p[i].children.push(data[j])
          : (p[i].children = [data[j]])
      }
    }
  }
  return p
}
const selectConfirm = (e: { value: number; label: any }[], type: number) => {
  if (type === TYPEMAP.JOB) {
    formData.jobTagName = e.map((item: { label: any }) => item.label).join('-')
    formData.jobTagId = e[e.length - 1].value
  }
  if (type === TYPEMAP.SERVICE) {
    const name = e.map((item: { label: any }) => item.label).join('-')
    const obj = {
      id: e[e.length - 1].value,
      name
    }
    selectServiceTag(obj, false)
  }
}
const serviceTags = ref<{ name: string }[]>([])
function selectServiceTag(tag: { name: string }, splice = true) {
  const idx = serviceTags.value.findIndex((item) => item.name === tag.name)
  if (idx > -1) {
    splice && serviceTags.value.splice(idx, 1)
  } else {
    serviceTags.value.push(tag)
  }
  formData.serviceTags = serviceTags.value.map((item) => item.name).join(',')
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

async function handleUpdate() {
  uni.showLoading({
    mask: true
  })
  try {
    const res = await socialApi.userDetailUpdate(formData)
    uni.showToast({
      title: '提交成功',
      icon: 'none',
      duration: 2000,
      success() {
        uni.hideLoading()
        uni.navigateBack()
        // uni.redirectTo({
        //   url: `/packageA/pages/businessCard/index?userId=${userInfo.value.id}`
        // })
      }
    })
  } catch (err) {
    console.log(err)
    uni.hideLoading()
  }
}
async function handleAdd() {
  uni.showLoading({
    mask: true
  })
  try {
    const res = await socialApi.userDetailAdd(formData)
    uni.showToast({
      title: '提交成功',
      icon: 'none',
      success() {
        uni.hideLoading()
        uni.navigateBack()
      }
    })
  } catch (err) {
    console.log(err)
    uni.hideLoading()
  }
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
      const data = JSON.parse(JSON.stringify(tempImageData))
      Object.keys(data).forEach((key) => {
        if (!data[key] || !data[key]?.length) {
          delete data[key]
        }
      })
      formData = reactive({ ...formData, ...data })
      // if (!formData.coverImage) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: '请上传名片主图'
      //   })
      //   return
      // }
      // if (!formData.serviceRemark) {
      //   uni.showToast({
      //     icon: 'none',
      //     title: '请填写提供的服务'
      //   })
      //   return
      // }
      if (isEdit.value) {
        handleUpdate()
      } else {
        handleAdd()
      }
    } else {
      console.log('验证失败')
    }
  })
}
async function getUserDetailInfo() {
  const { data } = await socialApi.userDetailInfo({
    userId: userInfo.value.id,
    detail: true
  })
  if (data) {
    isEdit.value = true
    data.phone = Number(data.phone)
    data.addressName = data.provinceName + data.cityName + data.districtName
    data?.companyResources?.forEach(
      (item: { url: string | undefined; resourceUrl: string }) => {
        item.url = getImgFullPath(item.resourceUrl)
      }
    )
    data?.resumeResources?.forEach(
      (item: { url: string | undefined; resourceUrl: string }) => {
        item.url = getImgFullPath(item.resourceUrl)
      }
    )
    data?.honorResources?.forEach(
      (item: { url: string | undefined; resourceUrl: string }) => {
        item.url = getImgFullPath(item.resourceUrl)
      }
    )
    const tagsTemp = data?.serviceTags?.split(',')?.map((item: any) => {
      return { name: item }
    })
    serviceTags.value = tagsTemp || []
    Object.keys(formData).forEach((key) => {
      formData[key] = data[key]
    })
    formData.id = data.id
    console.log(formData)
  }
}

onReady(() => {
  form.value.setRules(rules)
})
onMounted(async () => {
  // 职业
  await getTagList(TYPEMAP.JOB)
  // 服务
  await getTagList(TYPEMAP.SERVICE)
  getUserDetailInfo()
})
</script>
<template>
  <view class="container">
    <u-form :model="formData" ref="form" :label-style="{ fontWeight: 'bold' }">
      <view class="section">
        <u-form-item label="头像" label-width="auto" prop="avatar" required>
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
        <u-form-item label="主图" label-width="auto" required>
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
              formData.coverImage
                ? [{ url: getImgFullPath(formData.coverImage) }]
                : []
            "
          ></u-upload>
        </u-form-item>
        <u-form-item required label="姓名" label-width="auto" prop="name"
          ><u-input
            v-model="formData.name"
            input-align="right"
            placeholder="请填写真实姓名"
        /></u-form-item>
        <u-form-item required label="电话" label-width="auto" prop="phone"
          ><u-input
            v-model="formData.phone"
            input-align="right"
            placeholder="请填写联系电话"
            maxlength="11"
            type="number"
        /></u-form-item>
        <u-form-item
          required
          label="职业分类"
          label-width="auto"
          prop="jobTagName"
        >
          <u-input
            v-model="formData.jobTagName"
            type="select"
            input-align="right"
            placeholder="请选择职业"
            @click="showPicker1 = true"
          />
          <u-select
            v-model="showPicker1"
            mode="mutil-column-auto"
            value-name="id"
            label-name="name"
            :list="jobList"
            @confirm="selectConfirm($event, TYPEMAP.JOB)"
          ></u-select>
        </u-form-item>
        <u-form-item required label="职务" label-width="auto" prop="name"
          ><u-input
            v-model="formData.postRemark"
            input-align="right"
            placeholder="请填写您的职务（或头衔）"
        /></u-form-item>
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
        <!-- <u-form-item required label="对接金额（元）" label-width="auto" prop="name"
          ><u-input
            v-model="formData.shopProductSkuMoney"
            input-align="right"
            placeholder="请填写对接金额（10~1w）"
            type="number"
        /></u-form-item> -->
        <u-form-item
          required
          label="提供服务"
          label-width="auto"
          :border-bottom="false"
        >
          <u-input
            type="select"
            input-align="right"
            placeholder="请选择服务"
            @click="showPicker2 = true"
          />
          <u-select
            v-model="showPicker2"
            mode="mutil-column-auto"
            value-name="id"
            label-name="name"
            :list="serviceList"
            @confirm="selectConfirm($event, TYPEMAP.SERVICE)"
          ></u-select>
        </u-form-item>
        <view class="tags">
          <view
            :class="{ tag: true, active: true }"
            v-for="tag in serviceTags"
            :key="tag.id"
            @click="selectServiceTag(tag)"
          >
            {{ tag.name }}
          </view>
        </view>
        <u-form-item label="服务详情" label-width="auto" label-position="top"
          ><u-input
            v-model="formData.serviceRemark"
            input-align="left"
            type="textarea"
            placeholder="请填写服务详情"
        /></u-form-item>
        <u-form-item label="人物导语" label-width="auto" label-position="top"
          ><u-input
            v-model="formData.motto"
            input-align="left"
            type="textarea"
            placeholder="请填写自己的座右铭"
        /></u-form-item>
        <!-- <u-form-item label="录制录音" label-width="auto" label-position="top">
          <view style="width: 100%">
            <u-input
              input-align="left"
              type="textarea"
              disabled
              placeholder="录一段语音说清楚我的需求是什么？我能提供什么服务？"
            />
            <c_recorder />
          </view>
        </u-form-item> -->
        <u-form-item label="个人履历" label-width="auto" label-position="top">
          <view style="width: 100%">
            <u-input
              v-model="formData.resume"
              input-align="left"
              type="textarea"
              placeholder="填写履历（用图片和文字形式表达内容）"
            />
            <u-upload
              ref="upload3"
              :action="uploadUrl"
              max-count="10"
              :header="header"
              name="object"
              @on-success="uploadSuccess"
              index="resumeResources"
              :file-list="formData.resumeResources"
            ></u-upload>
          </view>
        </u-form-item>
        <u-form-item label="所获荣誉" label-width="auto" label-position="top">
          <view style="width: 100%">
            <u-input
              v-model="formData.honorRemark"
              input-align="left"
              type="textarea"
              placeholder="请填写所获荣誉（用图片和文字形式表达内容）"
            />
            <u-upload
              ref="upload3"
              :action="uploadUrl"
              max-count="10"
              :header="header"
              name="object"
              @on-success="uploadSuccess"
              index="honorResources"
              :file-list="formData.honorResources"
            ></u-upload>
          </view>
        </u-form-item>
        <u-form-item label="公司介绍" label-width="auto" label-position="top">
          <view style="width: 100%">
            <u-input
              v-model="formData.companyRemark"
              input-align="left"
              type="textarea"
              placeholder="请填写公司介绍（用图片和文字形式表达内容）"
            />
            <u-upload
              ref="upload3"
              :action="uploadUrl"
              max-count="10"
              :header="header"
              name="object"
              @on-success="uploadSuccess"
              index="companyResources"
              :file-list="formData.companyResources"
            ></u-upload>
          </view>
        </u-form-item>
      </view>
    </u-form>
    <view class="protocol">
      <u-checkbox-group>
        <u-checkbox v-model="agree"
          >我已阅读并同意
          <text class="link" @click="toProtocol">《名人发布申请协议》</text>
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

.tags {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  padding-bottom: 20rpx;
  border-bottom: 2rpx solid #f6f6f6;
  .tag {
    background: #f6f6f6;
    border-radius: 50rpx;
    line-height: 40rpx;
    font-size: 26rpx;
    color: #666;
    padding: 5rpx 20rpx;
    border: 1rpx solid #f6f6f6;

    &.active {
      border-color: #fa3534;
      color: #fa3534;
    }
  }
}
</style>
