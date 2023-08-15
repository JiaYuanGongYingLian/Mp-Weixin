/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-plusplus */
/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-07-25 15:30:59
 * @LastEditTime: 2023-08-15 17:36:55
 * @LastEditors:  Please set LastEditors
 */
import { defineStore } from 'pinia'
import jpushIM from '@/common/jim/jim.js'
import $config from '@/common/jim/config.js'
import jimMsg from '@/common/jim/imMsgApi.js'
import { $toast } from '@/utils/common'

let number = 0
const useStore = defineStore('chat', {
  state: () => ({
    jimLoginInfo: null,
    hasLogin: false,
    jimUserInfo: {},
    isJimInit: false,
    syncConversation: [],
    conversation: [],
    chatList: [],
    singleInfo: {},
    groupInfo: {}
  }),
  getters: {
    singleInfoAvatar: (state) => {
      return state.singleInfo.avatar
        ? $config.jimLocalhost + state.singleInfo.avatar
        : $config.$defaultAvatar
    },
    jimUserInfoAvatar: (state) => {
      return state.jimUserInfo.avatar
        ? $config.jimLocalhost + state.jimUserInfo.avatar
        : $config.$defaultAvatar
    }
  },
  actions: {
    async jimInit() {
      await jpushIM.init()
      const inter = setInterval(() => {
        if (jpushIM.isInit() || number > 20) {
          clearInterval(inter)
          this.isJimInit = true
        } else {
          number++
          this.jimInit()
        }
      }, 200)
    },
    async jimRegister(data: { username: any; password?: any }) {
      const { username, password } = data
      const res = await jpushIM.register(data)
      console.log(res)
      // $toast('注册成功')
      this.jimLogin({
        username,
        password
      })
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
    async jimLogin(data: { username: any; password?: any; nickname?: any }) {
      const { username, password } = data
      try {
        console.log(data, 1234156)
        const { res } = await jpushIM.login({
          username,
          password
        })
        uni.setStorageSync('jimLoginInfo', data)
        console.log(72, res)
        this.hasLogin = true
        this.jimGetUserInfo(username)
        this.jimOnSyncConversation()
        this.jimOnMsgReceive()
        this.jimGetConversation()
        // $toast('登录成功')
      } catch (err) {
        if (err && err.code !== 0) {
          this.jimRegister({
            username,
            password
          })
        }
      }
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
            ? $config.jimLocalhost + e.avatar
            : $config.$defaultAvatar
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
      console.log('state.chatlist', this.chatList)
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
    async jimGetGroupInfo(data: any) {
      this.chatList = []
      if (data) {
        const params = {
          gid: data
        }
        const { code, group_info } = await jpushIM.getGroupInfo(params)
        if (code === 0) {
          const group = group_info || {
            gid: data
          }
          this.jimGetGroupMembers(group)
          this.jimGetGroupMsg(group)
        }
      }
    },
    async jimGetGroupMembers(group: any) {
      const res = await jpushIM.getGroupMembers(group)
      console.log(res)
    },
    jimGetGroupMsg(group: {}) {
      const chatList = jimMsg.getGroupMsg(
        this.conversation,
        this.syncConversation,
        group
      )
      if (chatList.isfind) {
        this.chatList = chatList._chatInfoList
      } else {
        this.conversation.unshift(chatList._chatList)
        this.chatList = []
      }
      this.groupInfo = group
      this.jimResetUnreadCount(group)
    },
    jimResetUnreadCount(data: { username?: any; appkey?: any; gid?: any }) {
      const params = {
        username: data.username,
        appkey: data.appkey,
        gid: data.gid
      }
      jpushIM.resetUnreadCount(params)
      this.jimUpdateConversation(data)
    },
    jimUpdateConversation(data: { username?: any; appkey?: any; gid?: any }) {
      const params = {
        username: data.username,
        appkey: data.appkey,
        gid: data.gid
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
    },
    // 群聊
    async jimSendGroupMsg(data: { target_gid: any }) {
      const params = data
      const res = await jpushIM.sendGroupMsg(params)
      if (res.code === 0) {
        const msgInfo = jimMsg.formatMsgInfo(this.jimUserInfo, params, res)
        this.jimSendMsgAdd(msgInfo)
        // if (!this.chatList.length) {
        //   setTimeout(() => {
        //     this.jimGetSingleInfo(data.target_username)
        //   }, 500)
        // }
      }
    }
  }
})

export default useStore
