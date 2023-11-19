/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
/*
 * @Description: 融云
 * @Author: Kerwin
 * @Date: 2023-11-14 17:49:27
 * @LastEditTime: 2023-11-18 16:16:23
 * @LastEditors:  Please set LastEditors
 */
import { defineStore } from 'pinia'

let lifeData = {}
try {
  // 尝试获取本地是否存在lifeData变量，第一次启动应用时是不存在的
  lifeData = uni.getStorageSync('lifeData')
} catch (e) {}
// 需要永久存储，且下次应用启动需要取出的，在state中的变量名
const saveStateKeys = [
  'userinfo',
  'vuex_latestConversationList',
  'vuex_messagelist'
] // vuex_nlist vuex_grouplist
// 保存变量到本地存储中
const saveLifeData = (key: string, value: any) => {
  // 判断变量名是否在需要存储的数组中
  if (saveStateKeys.indexOf(key) !== -1) {
    // 获取本地存储的lifeData对象，将变量添加到对象中
    let tmp = uni.getStorageSync('lifeData')
    // 第一次打开APP，不存在lifeData变量，故放一个{}空对象
    tmp = tmp || {}
    tmp[key] = value
    // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
    uni.setStorageSync('lifeData', tmp)
  }
}
const useStore = defineStore('ry', {
  state: () => ({
    userinfo: lifeData.userinfo ? lifeData.userinfo : null,
    totalUnreadCount: { home: 0, list: 0 },
    friendsUnreadCount: 0,

    vuex_latestConversationList: lifeData.vuex_latestConversationList
      ? lifeData.vuex_latestConversationList
      : {},
    vuex_messagelist: lifeData.vuex_messagelist
      ? lifeData.vuex_messagelist
      : {},
    vuex_nlist: {}, // lifeData.vuex_nlist ? lifeData.vuex_nlist :
    vuex_indexList: [],
    vuex_friendslist: [],
    vuex_grouplist: [],
    vuex_addfriendslist: [],
    vuex_user: null,
    vuex_home_loading: false,

    head_background: { backgroundColor: 'rgba(237,237,237)' },
    api_url: 'http://127.0.0.1/',
    vuex_current: 1,
    vuex_activeColor: '#5098FF',
    vuex_tabbar: [
      {
        iconPath: 'chat',
        selectedIconPath: 'chat-fill',
        text: '首页',
        count: 0,
        pagePath: '/pages/index/home'
      },
      {
        iconPath: 'grid',
        selectedIconPath: 'grid-fill',
        text: '通讯录',
        count: 0,
        pagePath: '/pages/index/mail_list'
      },
      {
        iconPath: 'account',
        selectedIconPath: 'account-fill',
        text: '我',
        pagePath: '/pages/index/user'
      }
    ]
  }),
  actions: {
    $uStore(
      state: { [x: string]: any },
      payload: { name: string; value: any }
    ) {
      // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
      const nameArr = payload.name.split('.')
      let saveKey = ''
      const len = nameArr.length
      if (len >= 2) {
        let obj = state[nameArr[0]]
        for (let i = 1; i < len - 1; i++) {
          obj = obj[nameArr[i]]
        }
        obj[nameArr[len - 1]] = payload.value
        saveKey = nameArr[0]
      } else {
        // 单层级变量，在state就是一个普通变量的情况
        state[payload.name] = payload.value
        saveKey = payload.name
      }
      // 保存变量到本地，见顶部函数定义
      saveLifeData(saveKey, state[saveKey])
    }
  }
})

export default useStore
