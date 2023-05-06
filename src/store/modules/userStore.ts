/* eslint-disable no-empty */
import { defineStore } from 'pinia'
import { getQueryVariable } from '@/utils/common'
import { userApi } from '@/api'

const userStore = defineStore('storeId', {
  state: () => ({
    isAuthorize: false, // 是否授权
    isBindPhone: false, // 是否绑定手机
    userInfo: {},
    accessToken: '',
    wxAccessToken: '',
    unionid: '',
    openid: '',
    wxUserInfo: {}
  }),
  getters: {
    hasLogin: (state) => Boolean(state.accessToken)
  },
  actions: {
    syncSetOpenid(openid: string) {
      this.openid = openid
      uni.setStorageSync('openid', openid)
    },
    syncSetUnionid(unionid: string) {
      this.unionid = unionid
      uni.setStorageSync('unionid', unionid)
    },
    syncSetToken(token: string) {
      this.accessToken = token
      uni.setStorageSync('accessToken', token)
    },
    syncSetWxToken(token: string) {
      this.wxAccessToken = token
      uni.setStorageSync('wxAccessToken', token)
    },
    syncSetUserInfo(data: object) {
      this.userInfo = data
      uni.setStorageSync('userInfo', data)
    },
    syncClearToken() {
      this.accessToken = ''
      uni.removeStorageSync('accessToken')
    },
    syncClearUserInfo() {
      this.userInfo = {}
      uni.removeStorageSync('userInfo')
    },
    loginByOpenId(openId: any) {
      const BASEURL = import.meta.env.VITE_APP_AXIOS_BASE_URL
      uni.request({
        url: `${BASEURL}/auth/api/v1/auth/login`,
        method: 'POST',
        data: {
          type: 32,
          code: openId
        },
        success: (res) => {
          const { data } = res
          if (data) {
            this.accessToken = data.accessToken
          }
        }
      })
    },
    wxAuth() {
      const APPID = 'wx0ffaafd066438895'
      const SCOPE = 'snsapi_userinfo'
      const CODE = getQueryVariable('code')
      const REDIRECT_URL = encodeURIComponent(window.location.href)
      if (this.hasLogin) return
      if (!CODE) {
        window.open(
          `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`
        )
        return
      }
      const BASEURL = import.meta.env.VITE_APP_AXIOS_BASE_URL
      uni.request({
        url: `${BASEURL}/auth/api/v1/auth/wxWebLogin`,
        method: 'POST',
        header: {
          code: CODE
        },
        success: (res) => {
          const { data } = res.data
          this.wxUserInfo = data
          console.log(64, data)
          this.loginByOpenId(data.openid)
          this.getuserphonenumber(data.openid, data.access_token)
        }
      })
    },
    getuserphonenumber(token: any, code: any) {
      return new Promise((resolve, _reject) => {
        uni.request({
          url: `https://api.weixin.qq.com/wxa/business/getuserphonenumber?access_token=${token}`,
          method: 'POST',
          data: {
            code
          },
          success: (res) => {
            const { data } = res
            const { phoneNumber } = data.phone_info
            resolve({
              phone: phoneNumber
            })
          }
        })
      })
    }
  }
})

export default userStore
