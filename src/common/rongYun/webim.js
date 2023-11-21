/* eslint-disable no-console */
/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-11-19 22:57:23
 * @LastEditTime: 2023-11-21 15:09:39
 * @LastEditors:  Please set LastEditors
 */
/* eslint-disable consistent-return */
// import Vue from 'vue'
import RongIMLib from './im_init'
import { useRyStore } from '@/store'

const store = useRyStore()
const { Events } = RongIMLib
RongIMLib.addEventListener(Events.CONNECTING, () => {
  console.log('正在链接服务器')
})
RongIMLib.addEventListener(Events.CONNECTED, () => {
  console.log('已经链接到服务器')
})
RongIMLib.addEventListener(Events.MESSAGES, (evt) => {
  console.log(evt.messages)
})
const { state } = store
// RongIMLib.registerMessageType('app:hongbao', true, true)
export default WEBIM = {
  ScanAudio() {
    const innerAudioContext = uni.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = '../static/raw/Message_prompt.mp3'
    innerAudioContext.play()
  },
  // 全局更新
  setvar(name, value) {
    store.$uStore(name, value)
  },
  // 初始化监听
  rongWatch() {
    const that = this
    RongIMLib.watch({
      conversation(event) {
        const conversationList =
          state.pinia_latestConversationList[state.userinfo.id]
        const { updatedConversationList } = event
        if (typeof updatedConversationList[0].latestMessage !== 'undefined') {
          if (
            updatedConversationList[0].latestMessage.messageType ==
            'RC:ContactNtf'
          ) {
            const conversationLists = state.pinia_friendslist
            const latestConversationLists = RongIMLib.Conversation.merge({
              conversationLists,
              updatedConversationList
            })
            console.log(conversationLists, latestConversationLists)
            return false
          }
        }
        console.log('会话更新', updatedConversationList)
        const latestConversationList = RongIMLib.Conversation.merge({
          conversationList,
          updatedConversationList
        })
        console.log('计算会话', latestConversationList)
        that.setvar(
          `pinia_latestConversationList.${state.userinfo.id}`,
          latestConversationList
        )
      },
      async message(event) {
        that.ScanAudio()
        const { message } = event
        const connect = message.content.content
        const { id } = state.userinfo
        const pinia_messagelist = state.pinia_messagelist[id]
        // if(!state.pinia_messagelist[message.targetId]){
        // 	pinia_messagelist[message.targetId] = [];
        // 	that.setvar('pinia_messagelist.',pinia_messagelist);
        // }
        pinia_messagelist[message.targetId].push(message)
        that.setvar(`pinia_messagelist.${state.userinfo.id}`, pinia_messagelist)
        console.log(message)
        console.log('接收消息成功，消息内容为:', message.content.content)
      },
      status(event) {
        const { status } = event
        console.log('正在连接；连接状态码:', status)
      }
    })
  },

  // 初始化
  rongInit(token) {
    RongIMLib.connect(token)
      .then((res) => {
        if (res.code === RongIMLib.ErrorCode.SUCCESS) {
          // this.rongWatch()
          // this.getlist()
          // RongIMLib.Conversation.getTotalUnreadCount().then(function(totalUnreadCount) {
          //   console.log('获取未读总数成功', totalUnreadCount);
          // })
          console.log('链接成功, 链接用户 id 为: ', res.data.userId)
        } else {
          console.warn('链接失败, code:', res.code)
        }
      })
      .catch((error) => {
        uni.showToast({ title: '连接服务器失败', icon: 'none' })
        console.log('链接失败: ', error)
      })
  },

  // 获取会话列表
  getlist() {
    const that = this
    RongIMLib.getConversationList()
      .then((res) => {
        console.log(res, 899)
        const { code, data: conversationList } = res
        if (code === 0) {
          console.log('获取会话列表成功', conversationList)
          const list = []
          const friendslist = []
          const homeUnreadCount = 0
          const friendsUnreadCount = 0
          const { id } = state.userinfo
          const messagelist = state.pinia_messagelist[id]
          console.log(messagelist)
          for (let i = 0; i < conversationList.length; i++) {
            const index = conversationList[i]
            const uuid = index.targetId
            if (index.latestMessage.messageType !== 'RC:ContactNtf') {
              index.show = false
              list.push(index)
              if (!messagelist[uuid]) {
                messagelist[index.targetId] = []
                that.setvar(`pinia_messagelist.${id}`, messagelist)
              }
              // homeUnreadCount = homeUnreadCount+index.unreadMessageCount;
            } else if (
              index.latestMessage.messageType === 'RC:ContactNtf' &&
              index.type === 6
            ) {
              // index.read = false;
              // friendslist.push(index);
              // friendsUnreadCount = friendsUnreadCount+1;
            }
          }
          console.log('消息会话', list)
          // // console.log(friendslist)
          // state.pinia_tabbar[0].count = homeUnreadCount;
          // state.pinia_tabbar[1].count = friendsUnreadCount;
          this.setvar(`pinia_latestConversationList.${id}`, list)
          // // this.setvar('pinia_friendslist',friendslist);
          // this.setvar('friendsUnreadCount',friendsUnreadCount);
        } else {
          console.log('获取会话列表失败: ', error.code, error.msg)
        }
      })
      .catch((error) => {
        console.log('获取会话列表失败: ', error)
      })
  },

  delMessage(uuid, group = false) {
    const conversation = RongIMLib.Conversation.get({
      targetId: uuid,
      type: group
        ? RongIMLib.CONVERSATION_TYPE.GROUP
        : RongIMLib.CONVERSATION_TYPE.PRIVATE
    })
    conversation.read().then(() => {
      console.log('清除未读数成功') // RongIMLib.watch conversation 将被触发
    })
  },

  delMessageList(uuid, type, id) {
    const conversation = RongIMLib.Conversation.get({
      targetId: uuid,
      type
    })
    conversation.destory().then(() => console.log('删除会话成功'))
    const uid = state.userinfo.id
    const list = state.pinia_latestConversationList[uid]
    list.splice(id, 1)
    this.setvar(`pinia_latestConversationList.${uid}`, list)
  },

  // 发送消息
  send_message(uuid, content, type, group = false) {
    const that = this
    const conversation = {
      targetId: uuid,
      // 会话类型：RongIMLib.ConversationType.PRIVATE | RongIMLib.ConversationType.GROUP
      conversationType: group
        ? RongIMLib.CONVERSATION_TYPE.GROUP
        : RongIMLib.CONVERSATION_TYPE.PRIVATE
    }
    // 构建文本消息
    const message = new RongIMLib.TextMessage({ content })
    // 发送消息
    RongIMLib.sendMessage(conversation, message).then(({ code, data }) => {
      if (code === 0) {
        console.log('消息发送成功：', data)
        const { id } = state.userinfo
        const messagelist = state.pinia_messagelist[id][uuid]
        messagelist.push(message)
        // console.log('pinia_messagelist.'+id+'.'+uuid)
        that.setvar(`pinia_messagelist.${id}.${uuid}`, messagelist)
      } else {
        console.log('消息发送失败：', code)
      }
    })
  }
}
