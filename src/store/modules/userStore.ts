import { defineStore } from 'pinia';

const userStore = defineStore('storeId', {
  state: () => ({
    isAuthorize: false, // 是否授权
    isBindPhone: false, // 是否绑定手机
    hasLogin: false, // 是否已经登录
    userInfo: null
  }),
  getters: {},
  actions: {}
});

export default userStore;
