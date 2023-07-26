/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-25 15:30:59
 * @LastEditTime: 2023-07-26 10:30:18
 * @LastEditors:  Please set LastEditors
 */
import { defineStore } from 'pinia'
import jpushIM from '@/common/jim/jim.js'
import config from '@/common/jim/config.js'
import jimMsg from '@/common/jim/imMsgApi.js'
import { $toast } from '@/utils/common'

let number = 0
const useStore = defineStore('config', {
  state: () => ({
    jimLoginInfo: null,
    hasLogin: false,
    jimUserInfo: {},
    isJimInit: false,
    syncConversation: [],
    conversation: [],
    chatList: [],
    singleInfo: {}
  }),
  getters: {},
  actions: {
    async jimInit() {
      await jpushIM.init()
      const inter = setInterval(() => {
        if (jpushIM.isInit() || number > 20) {
          clearInterval(inter)
          this.jimInit()
        } else {
          number++
        }
      }, 200)
    },
    async jimRegister(data: any) {
      const res = await jpushIM.register(data)
      console.log(res)
      $toast('注册成功')
    },
    async jimLoginOut() {
      await jpushIM.loginOut()
      this.resetState()
      $toast('退出成功')
      setTimeout(() => {
        if (!jpushIM.isInit()) {
          jpushIM.init()
        }
      }, 500)
    },
    async jimLogin(data: { username: any }) {
      uni.setStorageSync('jimLoginInfo', data)
      await jpushIM.login(data)
      this.hasLogin = true
      this.jimGetUserInfo(data.username)
      this.jimOnSyncConversation()
      this.jimOnMsgReceive()
      this.jimGetConversation()
      $toast('登录成功')
    },
    async jimGetUserInfo(data: any) {
      const params = {
        username: data
      }
      const { code, user_info } = await jpushIM.getUserInfo(params)
      if (code === 0) {
        const user = user_info || {
          username: data
        }
        this.jimUserInfo = user
      }
    },
    async jimUpdateSelfInfo(data: any) {
      const params = data
      const { code } = await jpushIM.updateSelfInfo(params)
      if (code === 0) {
        this.jimGetUserInfo(this.jimUserInfo.username)
      }
    },
    async jimUpdateSelfPwd(data: any) {
      const object =
        typeof data === 'object' ? JSON.parse(JSON.stringify(data)) : data
      const params = data
      const { code } = await jpushIM.updateSelfPwd(params)
      if (code === 0) {
        const jimLoginInfo = uni.getStorageSync('jimLoginInfo')
        if (jimLoginInfo.username) {
          jimLoginInfo.password = object.new_pwd
          uni.setStorageSync('jimLoginInfo', jimLoginInfo)
        }
      }
    },
    resetState() {
      this.hasLogin = false
      this.jimUserInfo = {}
      this.isJimInit = false
      this.syncConversation = []
      this.conversation = []
      this.chatList = []
      this.singleInfo = {}
      uni.setStorageSync('jimLoginInfo', null)
    },
    async jimGetConversation() {
      const { code, conversations } = await jpushIM.getConversation()
      if (code === 0) {
        conversations.forEach((e: { avatar: any }) => {
          e.avatar = e.avatar
            ? config.jimLocalhost + e.avatar
            : config.$defaultAvatar
        })
        this.jimGetConversationFormat(conversations)
      }
    },
    jimGetConversationFormat(data: any) {
      const conversation = jimMsg.formatConversation(
        data,
        this.syncConversation
      )
      this.conversation = conversation
    },
    async jimOnSyncConversation() {
      const data = await jpushIM.onSyncConversation()
      if (Object.prototype.toString.call(data) === '[object Array]') {
        this.syncConversation = data
      } else {
        this.syncConversation = []
      }
    },
    async jimOnMsgReceive() {
      jpushIM.onMsgReceive((res: { messages: never[] }) => {
        const msgs = res.messages || []
        if (msgs && msgs[0]) {
          const msg = jimMsg.formatMsgInfoReceive(msgs[0])
          this.jimSendMsgAdd(msg)
          this.jimGetConversation()
        }
      })
    },
    jimSendMsgAdd(data: { from_appkey?: any; from_username?: any }) {
      const { from_username } = data
      const appkey = data.from_appkey
      const list = this.syncConversation.map(
        (e: { from_username: any }) => e.from_username
      )
      const index = list.indexOf(from_username)

      if (index !== -1) {
        this.syncConversation[index].msgs.push(data)
      } else {
        const syncConversation = {
          from_username,
          from_appkey: appkey,
          msg_type: 3,
          receipt_msgs: [],
          unread_msg_count: 0,
          msgs: [data]
        }
        this.syncConversation.push(syncConversation)
      }
      console.log('state.syncConversation', this.syncConversation)
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
        const { code, user_info } = await jpushIM.getUserInfo(params)
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
    },
    async jimSendSingleMsg(data: { target_username: any }) {
      const params = data
      const res = await jpushIM.sendSingleMsg(params)
      if (res.code === 0) {
        const msgInfo = jimMsg.formatMsgInfo(this.jimUserInfo, params, res)
        this.jimSendMsgAdd(msgInfo)
        if (!this.chatList.length) {
          setTimeout(() => {
            this.jimGetSingleInfo(data.target_username)
          }, 500)
        }
      }
    },
    async jimSendSinglePic(data: { target_username: any }) {
      const params = data
      const res = await jpushIM.sendSinglePic(params)
      if (res.code === 0) {
        const { jimUserInfo } = this
        const msgInfo = jimMsg.formatMsgInfo(jimUserInfo, params, res)
        this.jimSendMsgAdd(msgInfo)
        if (!this.chatList.length) {
          setTimeout(() => {
            this.jimGetSingleInfo(data.target_username)
          }, 500)
        }
      }
    },
    async jimSendSingleFile(data: { target_username: any }) {
      const params = data
      const res = await jpushIM.sendSingleFile(params)
      if (res.code === 0) {
        const { jimUserInfo } = this
        const msgInfo = jimMsg.formatMsgInfo(jimUserInfo, params, res)
        this.jimSendMsgAdd(msgInfo)
        if (!this.chatList.length) {
          setTimeout(() => {
            this.jimGetSingleInfo(data.target_username)
          }, 500)
        }
      }
    },
    async updateSelfAvatar(data: any) {
      const params = {
        avatar: data
      }
      const res = await jpushIM.updateSelfAvatar(params)
      if (res.code === 0) {
        this.jimGetUserInfo(this.jimUserInfo.username)
      }
    }
  }
})

export default useStore
