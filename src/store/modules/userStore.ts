/* eslint-disable no-empty */
import { defineStore } from 'pinia'
import { getQueryVariable,isEmptyObject } from '@/utils/common'
import useChatStore from './chatStore'
import useConfigStore from './configStore'
const BASEURL = 'https://api.blacksilverscore.com'
const userStore = defineStore('user', {
  state: () => ({
    isAuthorize: false, // 是否授权
    isBindPhone: false, // 是否绑定手机
    userInfo: {},
    accessToken: '',
    wxAccessToken: '',
    unionid: '',
    openid: '',
    wxUserInfo: {},
    walletList: [],
    hasNewDynamic: false,
    useShareCode: true,
    myShopList: [], // 用户拥有的店铺
    currentShop: {} // 用户当前切换的店铺
  }),
  getters: {
    hasLogin: (state) => Boolean(state.accessToken)
  },
  actions: {
    syncSetMyShopList(list: any) {
      this.myShopList = list
      uni.setStorageSync('myShopList', list)
    },
    syncSetCurrentShop(shop: {}) {
      if(isEmptyObject(shop)) return
      this.currentShop = shop
      uni.setStorageSync('currentShop', shop)
    },
    syncSetUseShareCode(flag: boolean) {
      this.useShareCode = flag
    },
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
    async syncSetUserInfo(data: object) {
      this.userInfo = data
      uni.setStorageSync('userInfo', data)
      // 登陆极光IM
      const chatStore = useChatStore()
      await chatStore.jimLoginFn()
    },
    syncClearToken() {
      this.accessToken = ''
      uni.removeStorageSync('accessToken')
    },
    syncClearUserInfo() {
      this.userInfo = {}
      uni.removeStorageSync('userInfo')
    },
    syncSetWalletList(data: never[]) {
      if (data && data.length) {
        this.walletList = data
      }
    },
    getImgFullPath(suffix: string){
      if (!suffix) return
      if (suffix.includes('http' || 'https')) {
        return suffix
      }
      const configStore = useConfigStore()
      return configStore.staticUrl + suffix
    },
    getUserInfo() {
      return new Promise((resolve, _reject) => {
        uni.request({
          url: `${BASEURL}/ups/api/v1/user/info`,
          method: 'GET',
          header: {
            Authorization: `Bearer ${this.accessToken}`
          },
          success: async (res) => {
            const { data } = res.data
            this.syncSetUserInfo(data)
            resolve(data)
          }
        })
      })
    },
    loginByOpenId(openid?: any) {
      let type = 32
      // #ifdef H5
      type = 32
      // #endif
      // #ifdef MP-WEIXIN
      type = 33
      // #endif
      return new Promise((resolve, reject) => {
        uni.request({
          url: `${BASEURL}/auth/api/v1/auth/login`,
          method: 'POST',
          header: {
             // #ifdef H5
             platform: 50
             // #endif
             // #ifdef MP-WEIXIN
             platform: 40
             // #endif
          },
          data: {
            type,
            code: openid || this.wxUserInfo.openid,
            unionId: this.wxUserInfo.unionid
          },
          success: (res) => {
            console.log(res,this.wxUserInfo,'loginByOpenId')
            const { code, data } = res.data
            if (code === 200) {
              this.syncSetToken(data.accessToken)
              this.getUserInfo()
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      })
    },
    wxWebLogin(code: any) {
      return new Promise((resolve, _reject) => {
        uni.request({
          url: `${BASEURL}/auth/api/v1/auth/wxWebLogin`,
          method: 'POST',
          header: {
            code
          },
          success: (res) => {
            const { data } = res.data
            if (data && data.access_token) {
              this.wxUserInfo = data
              this.syncSetWxToken(data.access_token)
              this.syncSetOpenid(data.openid)
              this.syncSetUnionid(data.unionid)
            }
            resolve(true)
          }
        })
      })
    },
    wxMiniLogin(code: any) {
      return new Promise((resolve, _reject) => {
        uni.request({
          url: `${BASEURL}/auth/api/v1/auth/wxMiniLogin`,
          method: 'POST',
          header: {
            code
          },
          success: (res) => {
            console.log(res,code,'wxMiniLogin')
            const { data } = res.data
            this.wxUserInfo = data
            this.syncSetWxToken(data.access_token)
            this.syncSetOpenid(data.openid)
            this.syncSetUnionid(data.unionid)
            resolve(true)
          }
        })
      })
    },
    wxAuth() {
      return new Promise((resolve, _reject) => {
        const APPID = 'wx0ffaafd066438895'
        const SCOPE = 'snsapi_userinfo'
        const CODE = getQueryVariable('code')
        const REDIRECT_URL = encodeURIComponent(window.location.href)
        if (!CODE) {
          console.log('跳转微信auth')
          window.open(
            `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=${SCOPE}&state=STATE#wechat_redirect`
          )
          return
        }
        console.log(CODE,888999)
        resolve({ code: CODE })
      })
    }
  }
})

export default userStore
