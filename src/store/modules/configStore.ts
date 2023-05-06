import { defineStore } from 'pinia'

const useStore = defineStore('config', {
  state: () => ({
    navBarHeight: 44,
    enterType: null
  }),
  getters: {
    enterByStoreQrcode: (state) => state.enterType === 'storeQrcode' // 是否通过商家二维码链接进入页面
  },
  actions: {
    setEnterType(type: any) {
      this.enterType = type
    }
  }
})

export default useStore
