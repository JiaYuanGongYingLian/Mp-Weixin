import { defineStore } from 'pinia'
import { getQueryVariable } from '@/utils/common'

const userStore = defineStore('storeId', {
  state: () => ({
    isAuthorize: false, // 是否授权
    isBindPhone: false, // 是否绑定手机
    userInfo: {},
    accessToken: null,
    wxUserInfo: {}
  }),
  getters: {
    hasLogin: (state) => Boolean(state.accessToken)
  },
  actions: {
    syncClearToken() {
      this.accessToken = null
      uni.removeStorageSync('accessToken')
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
      const APPID = 'wx1fddd052cbd8fec2'
      const SCOPE = 'snsapi_userinfo'
      const CODE = getQueryVariable('code')
      const REDIRECT_URL = encodeURIComponent(window.location.href)
      console.log('store-36 ', window.location.href)
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
          const { data } = res
          if (data) {
            this.wxUserInfo = data
            this.loginByOpenId(data.openid)
          }
        }
      })
    }
  }
})

export default userStore
