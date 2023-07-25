/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-25 15:30:59
 * @LastEditTime: 2023-07-25 16:26:57
 * @LastEditors:  Please set LastEditors
 */
import { defineStore } from 'pinia'
import jpushIM from '@/common/jim/jim.js'
import config from '@/common/jim/config.js'
import jimMsg from '@/common/jim/imMsgApi.js'
import { isWeChat, isAlipayClient } from '@/utils/common'

let number = 0
const useStore = defineStore('config', {
  state: () => ({
    jimLoginInfo: null,
    hasLogin: null,
    jimUserInfo: {},
    isJimInit: false,
    syncConversation: [],
    conversation: [],
    chatList: [],
    singleInfo: {}
  }),
  getters: {
    enterByStoreQrcode: (state) => state.enterType === 'storeQrcode' // 是否通过商家二维码链接进入页面
  },
  actions: {
    async jimInit() {
      const data = jpushIM.init()
      const inter = setInterval(() => {
        if (jpushIM.isInit() || number > 20) {
          clearInterval(inter)
          this.jimInit()
        } else {
          number++
        }
      }, 200)
    },
    jimGetSingleMsg(user: {}) {
      const chatList = jimMsg.getSingleMsg(
        this.conversation,
        this.syncConversation,
        user
      )
      if (chatList.isfind) {
        this.chatList = chatList._chatInfoList
      } else {
        this.conversation.unshift(chatList._chatList)
        this.chatList = []
      }
      this.singleInfo = user
      this.jimResetUnreadCount(user)
    },
    async jimGetSingleInfo(data: any) {
      this.chatList = []
      if (data) {
        const params = {
          username: data
        }
        const { code, user_info } = jpushIM.getUserInfo(params)
        if (code === 0) {
          const user = user_info || {
            username: data
          }
          this.jimGetSingleMsg(user)
        }
      }
    },
    jimResetUnreadCount(data: { username: any; appkey: any }) {
      const params = {
        username: data.username,
        appkey: data.appkey
      }
      jpushIM.resetUnreadCount(params)
      this.jimUpdateConversation(data)
    },
    jimUpdateConversation(data: { username: any; appkey: any }) {
      const params = {
        username: data.username,
        appkey: data.appkey
      }
      jpushIM.updateConversation(params)
    }
  }
})

export default useStore
