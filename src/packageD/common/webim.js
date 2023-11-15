import Vue from 'vue'
import * as RongIMLib from '@rongcloud/imlib-next'
import { useRyStore } from '@/store'

const store = useRyStore()

const im = RongIMLib.init({ appkey: 'x18ywvqfxzu6c' })
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
im.registerMessageType('app:hongbao', true, true)
const WEBIM = {
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
    im.watch({
      conversation(event) {
        const conversationList =
          state.vuex_latestConversationList[state.userinfo.id]
        const { updatedConversationList } = event
        if (typeof updatedConversationList[0].latestMessage !== 'undefined') {
          if (
            updatedConversationList[0].latestMessage.messageType ==
            'RC:ContactNtf'
          ) {
            const conversationLists = state.vuex_friendslist
            const latestConversationLists = im.Conversation.merge({
              conversationLists,
              updatedConversationList
            })
            console.log(conversationLists, latestConversationLists)
            return false
          }
        }
        console.log('会话更新', updatedConversationList)
        const latestConversationList = im.Conversation.merge({
          conversationList,
          updatedConversationList
        })
        console.log('计算会话', latestConversationList)
        that.setvar(
          `vuex_latestConversationList.${state.userinfo.id}`,
          latestConversationList
        )
      },
      async message(event) {
        that.ScanAudio()
        const { message } = event
        const connect = message.content.content
        const { id } = state.userinfo
        const vuex_messagelist = state.vuex_messagelist[id]
        // if(!state.vuex_messagelist[message.targetId]){
        // 	vuex_messagelist[message.targetId] = [];
        // 	that.setvar('vuex_messagelist.',vuex_messagelist);
        // }
        vuex_messagelist[message.targetId].push(message)
        that.setvar(`vuex_messagelist.${state.userinfo.id}`, vuex_messagelist)
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
    im.connect({
      token
    })
      .then((user) => {
        this.rongWatch()
        this.getlist()
        // im.Conversation.getTotalUnreadCount().then(function(totalUnreadCount) {
        //   console.log('获取未读总数成功', totalUnreadCount);
        // });
        console.log(`链接成功, 链接用户 id 为: ${user.id}`)
      })
      .catch(function (error) {
        uni.showToast({ title: '连接服务器失败', icon: 'none' })
        console.log('链接失败: ', error)
      })
  },

  // 获取会话列表
  getlist() {
    const that = this
    im.Conversation.getList({
      count: 1000,
      startTime: 0,
      order: 0
    }).then((conversationList) => {
      console.log('获取会话列表成功', conversationList)
      const list = []
      const friendslist = []
      const homeUnreadCount = 0
      const friendsUnreadCount = 0
      const { id } = state.userinfo
      const messagelist = state.vuex_messagelist[id]
      console.log(messagelist)
      for (let i = 0; i < conversationList.length; i++) {
        const index = conversationList[i]
        const uuid = index.targetId
        if (index.latestMessage.messageType != 'RC:ContactNtf') {
          index.show = false
          list.push(index)
          if (!messagelist[uuid]) {
            messagelist[index.targetId] = []
            that.setvar(`vuex_messagelist.${id}`, messagelist)
          }
          // homeUnreadCount = homeUnreadCount+index.unreadMessageCount;
        } else if (
          index.latestMessage.messageType == 'RC:ContactNtf' &&
          index.type == 6
        ) {
          // index.read = false;
          // friendslist.push(index);
          // friendsUnreadCount = friendsUnreadCount+1;
        }
      }
      console.log('消息会话', list)
      // // console.log(friendslist)
      // state.vuex_tabbar[0].count = homeUnreadCount;
      // state.vuex_tabbar[1].count = friendsUnreadCount;
      this.setvar(`vuex_latestConversationList.${id}`, list)
      // // this.setvar('vuex_friendslist',friendslist);
      // this.setvar('friendsUnreadCount',friendsUnreadCount);
    })
  },

  delMessage(uuid, group = false) {
    const conversation = im.Conversation.get({
      targetId: uuid,
      type: group
        ? RongIMLib.CONVERSATION_TYPE.GROUP
        : RongIMLib.CONVERSATION_TYPE.PRIVATE
    })
    conversation.read().then(function () {
      console.log('清除未读数成功') // im.watch conversation 将被触发
    })
  },

  delMessageList(uuid, type, id) {
    const conversation = im.Conversation.get({
      targetId: uuid,
      type
    })
    conversation.destory().then(() => console.log('删除会话成功'))
    const uid = state.userinfo.id
    const list = state.vuex_latestConversationList[uid]
    list.splice(id, 1)
    this.setvar(`vuex_latestConversationList.${uid}`, list)
  },

  // 发送消息
  send_message(uuid, content, type, group = false) {
    const that = this
    const { id } = state.userinfo
    const conversation = im.Conversation.get({
      targetId: uuid,
      type: group
        ? RongIMLib.CONVERSATION_TYPE.GROUP
        : RongIMLib.CONVERSATION_TYPE.PRIVATE
    })
    conversation
      .send({
        messageType: type, // 填写开发者定义的 messageType
        content: {
          // 填写开发者定义的消息内容
          content,
          user: {
            id: state.userinfo.id,
            avatar: state.userinfo.avatar,
            nickname: state.userinfo.nickname
          }
        }
        // isCounted: true,
      })
      .then(function (message) {
        const messagelist = state.vuex_messagelist[id][uuid]
        messagelist.push(message)
        // console.log('vuex_messagelist.'+id+'.'+uuid)
        that.setvar(`vuex_messagelist.${id}.${uuid}`, messagelist)
        console.log('发送 RC:TxtMsg 消息成功', message)
      })
  }
}

Vue.prototype.$socket = WEBIM
Vue.prototype.$im = im
export { WEBIM, im }
