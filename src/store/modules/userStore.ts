import { defineStore } from 'pinia';

const userStore = defineStore('storeId', {
  state: () => ({
    isAuthorize: false, // 是否授权
    isBindPhone: false, // 是否绑定手机
    userInfo: null,
    accessToken: null
  }),
  getters: {
    hasLogin: (state) => Boolean(state.accessToken)
  },
  actions: {
    syncClearToken() {
      this.accessToken = null
      uni.removeStorageSync('accessToken');
    }
  }
});

export default userStore;
