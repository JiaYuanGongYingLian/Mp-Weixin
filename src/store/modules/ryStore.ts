/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-plusplus */
/* eslint-disable no-empty */
import { defineStore } from 'pinia'
import RongIMLib, {
  HongBaoMessage,
  ProductMessage,
  PinTuanMessage
} from '@/common/rongYun/im_init'

let lifeData = {}
let groupUserlist = {}
try {
  // 尝试获取本地是否存在lifeData变量，第一次启动应用时是不存在的
  lifeData = uni.getStorageSync('lifeData')
  groupUserlist = uni.getStorageSync('groupUserlist')
} catch (e) {}
// 需要永久存储，且下次应用启动需要取出的，在state中的变量名
const saveStateKeys = [
  'userinfo',
  'pinia_latestConversationList',
  'pinia_messagelist',
  'pinia_groupUserlist'
]
// 保存变量到本地存储中
const saveLifeData = (key: string, value: any, storageKey: string) => {
  // 判断变量名是否在需要存储的数组中
  if (saveStateKeys.indexOf(key) !== -1) {
    // 获取本地存储的lifeData对象，将变量添加到对象中
    let tmp = uni.getStorageSync(storageKey)
    // 第一次打开APP，不存在lifeData变量，故放一个{}空对象
    tmp = tmp || {}
    tmp[key] = value
    // 执行这一步后，所有需要存储的变量，都挂载在本地的lifeData对象中
    uni.setStorageSync(storageKey, tmp)
  }
}
const useStore = defineStore('ry', {
  state: () => ({
    userinfo: lifeData.userinfo ?? null,
    totalUnreadCount: { home: 0, list: 0 },
    friendsUnreadCount: 0,
    pinia_latestConversationList: lifeData.pinia_latestConversationList ?? {},
    pinia_messagelist: lifeData.pinia_messagelist ?? {},
    pinia_groupUserlist: groupUserlist.pinia_groupUserlist ?? {},
    pinia_indexList: [],
    pinia_friendslist: [],
    pinia_grouplist: [],
    pinia_addfriendslist: [],
    pinia_user: null,
    pinia_home_loading: false,
    head_background: { backgroundColor: 'rgba(237,237,237)' },
    api_url: 'http://127.0.0.1/',
    pinia_current: 1,
    pinia_activeColor: '#5098FF',
    pinia_tabbar: [
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
      name: string,
      value: RongIMLib.IAReceivedConversation[],
      storageKey: string
    ) {
      // debugger
      // 判断是否多层级调用，state中为对象存在的情况，诸如user.info.score = 1
      const nameArr = name.split('.')
      let saveKey = ''
      const len = nameArr.length
      if (len >= 2) {
        let obj = this[nameArr[0]]
        for (let i = 1; i < len - 1; i++) {
          obj = obj[nameArr[i]]
        }
        obj[nameArr[len - 1]] = value
        saveKey = nameArr[0]
      } else {
        // 单层级变量，在state就是一个普通变量的情况
        this[name] = value
        saveKey = name
      }
      // 保存变量到本地，见顶部函数定义
      saveLifeData(saveKey, this[saveKey], storageKey)
    },
    // 建立链接
    connect(token: string) {
      RongIMLib.connect(token)
        .then((res) => {
          if (res.code === RongIMLib.ErrorCode.SUCCESS) {
            // this.rongWatch()
            // this.getlist()
            // RongIMLib.Conversation.getTotalUnreadCount().then(function(totalUnreadCount) {
            //   console.log('获取未读总数成功', totalUnreadCount);
            // })
            res.data.id = res.data?.userId
            this.userinfo = res.data
            console.log('链接成功, 链接用户 id 为: ', res.data.userId)
          } else {
            console.warn('链接失败, code:', res)
          }
        })
        .catch((error) => {
          uni.showToast({ title: '连接服务器失败', icon: 'none' })
          console.log('链接失败: ', error)
        })
    },
    ScanAudio() {
      const innerAudioContext = uni.createInnerAudioContext()
      innerAudioContext.autoplay = true
      innerAudioContext.src =
        'https://image.blacksilverscore.com/App/77f3730f-9726-4946-8459-2a80df785ac5.mp3'
      innerAudioContext.play()
    },
    // 全局更新
    setvar(
      name: string,
      value: RongIMLib.IAReceivedConversation[],
      storageKey: string
    ) {
      this.$uStore(name, value, storageKey)
    },
    // 缓存消息
    setMessage(
      message: {
        targetId: string | number
        content: { content: any }
      },
      type: string,
      index?: number
    ) {
      const { id } = this.userinfo
      if (!this.pinia_messagelist[id]) {
        this.pinia_messagelist[id] = {}
      }
      const pinia_messagelist = this.pinia_messagelist[id]
      if (!pinia_messagelist[message.targetId]) {
        pinia_messagelist[message.targetId] = []
      }
      if (type === 'add') {
        this.ScanAudio()
        pinia_messagelist[message.targetId].push(message)
        console.log(
          '接收消息成功，消息内容为:',
          message,
          message.content.content
        )
      } else if (type === 'delete') {
        pinia_messagelist[message.targetId].splice(index, 1)
      } else if (type === 'update' && index !== undefined) {
        pinia_messagelist[message.targetId][index] = message
      }
      this.setvar(
        `pinia_messagelist.${this.userinfo.id}`,
        pinia_messagelist,
        'lifeData'
      )
    },
    // 缓存群成员
    setGroupUser(
      data: { targetId: string | number; userList?: any; user?: any },
      type: string,
      index?: number
    ) {
      const { id } = this.userinfo
      if (!this.pinia_groupUserlist[id]) {
        this.pinia_groupUserlist[id] = {}
      }
      const pinia_groupUserlist = this.pinia_groupUserlist[id]
      if (!pinia_groupUserlist[data.targetId]) {
        pinia_groupUserlist[data.targetId] = []
      }
      if (type === 'add') {
        pinia_groupUserlist[data.targetId] = data.userList
      } else if (type === 'delete') {
        pinia_groupUserlist[data.targetId].splice(index, 1)
      } else if (type === 'update' && index !== undefined) {
        pinia_groupUserlist[data.targetId][index] = data.user
      }
      this.setvar(
        `pinia_groupUserlist.${this.userinfo.id}`,
        pinia_groupUserlist,
        'groupUserlist'
      )
    },

    delMessage(uuid: any, group = false) {
      const conversation = RongIMLib.getConversation({
        targetId: uuid,
        conversationType: group
          ? RongIMLib.ConversationType.GROUP
          : RongIMLib.ConversationType.PRIVATE
      })
      conversation.read().then(() => {
        console.log('清除未读数成功') // RongIMLib.watch conversation 将被触发
      })
    },
    delMessageList(uuid: any, type: any, id: any) {
      const conversation = RongIMLib.Conversation.get({
        targetId: uuid,
        type
      })
      conversation.destory().then(() => console.log('删除会话成功'))
      const uid = this.userinfo.id
      const list = this.pinia_latestConversationList[uid]
      list.splice(id, 1)
      this.setvar(`pinia_latestConversationList.${uid}`, list, 'lifeData')
    },
    clearMessagesUnreadStatus(data: { targetId: any; isGroup: any }) {
      const { targetId, isGroup } = data
      // 清除未读数
      const conversationType = isGroup
        ? RongIMLib.ConversationType.GROUP
        : RongIMLib.ConversationType.PRIVATE
      RongIMLib.clearMessagesUnreadStatus({
        conversationType,
        targetId
      }).then((res) => {
        if (res.code === 0) {
          // 清理成功
          // 发送多端同步未读数消息
          RongIMLib.sendSyncReadStatusMessage(
            { conversationType, targetId },
            Date.now()
          )
        }
      })
    },
    buildMsg(data: {
      targetId?: any
      title?: string
      content?: any
      msgType: any
      imageUri?: string
      group?: any
      latitude?: any
      longitude?: any
      referMsg?: any
      totalCount?: number
      totalMoney?: number
      nickname?: string
      friendCircleRedPacketId?: number
      imageUrl?: string
      path?: string
      orderId?: any
      productId?: any
      shopId?: any
      sightUrl?: any
      size?: any
      duration?: any
    }) {
      const {
        msgType,
        title,
        content,
        imageUri,
        latitude,
        longitude,
        referMsg,
        totalCount,
        nickname,
        friendCircleRedPacketId,
        totalMoney,
        imageUrl,
        path,
        orderId,
        productId,
        shopId,
        sightUrl,
        size,
        duration
      } = data
      let message: RongIMLib.BaseMessage<any> | null = null
      switch (msgType) {
        case 1:
          message = new RongIMLib.TextMessage({ content })
          break
        case 2:
          message = new RongIMLib.ImageMessage({
            content, // 图片缩略图，应为 Base64 字符串，且不可超过 80KB
            imageUri // 图片的远程访问地址
          })
          break
        case 3:
          message = new RongIMLib.FileMessage({
            name: '',
            size: 1000,
            type: '',
            fileUrl: ''
          })
          break
        case 4:
          message = new RongIMLib.HQVoiceMessage({
            remoteUrl: '<aac 文件地址>',
            duration: 60
          })
          break
        case 5:
          message = new RongIMLib.SightMessage({
            sightUrl,
            content, // '<缩略图>'
            duration,
            size,
            name: title as string
          })
          break
        case 6:
          message = new RongIMLib.GIFMessage({
            gifDataSize: 30,
            remoteUrl: '<图片地址>',
            width: 300,
            height: 200
          })
          break
        case 7:
          message = new RongIMLib.ReferenceMessage({
            referMsgUserId: referMsg.senderUserId,
            referMsg: {
              content: referMsg.content.content
            },
            content,
            objName: RongIMLib.MessageType.TEXT
          })
          break
        case 8:
          message = new RongIMLib.LocationMessage({
            latitude,
            longitude,
            poi: '',
            content
          })
          break
        case 9:
          message = new HongBaoMessage({
            title: '恭喜发财，大吉大利',
            content,
            totalCount,
            totalMoney,
            status: 1,
            nickname,
            friendCircleRedPacketId
          })
          break
        case 10:
          message = new ProductMessage({
            title,
            content,
            imageUrl,
            path,
            productId,
            shopId
          })
          break
        case 11:
          message = new PinTuanMessage({
            title,
            content,
            imageUrl,
            path,
            orderId
          })
          break
        default:
          message = new RongIMLib.TextMessage({ content })
          break
      }
      return message
    },
    // 发送消息
    sendMessage(data: {
      targetId: any
      content: any
      msgType: any
      group: any
    }) {
      const { targetId, content, msgType, group } = data
      const conversation = {
        targetId,
        conversationType: group
          ? RongIMLib.ConversationType.GROUP
          : RongIMLib.ConversationType.PRIVATE
      }
      const message = this.buildMsg(data)
      // 发送消息
      RongIMLib.sendMessage(conversation, message).then(({ code, data }) => {
        if (code === 0) {
          console.log('消息发送成功：', data)
          const { userId } = this.userinfo
          if (!this.pinia_messagelist[userId]) {
            this.pinia_messagelist[userId] = {}
          }
          if (!this.pinia_messagelist[userId][targetId]) {
            this.pinia_messagelist[userId][targetId] = []
          }
          const messagelist = this.pinia_messagelist[userId][targetId]
          messagelist.push(data)
          console.log(`pinia_messagelist.${userId}.${targetId}`)
          this.setvar(
            `pinia_messagelist.${userId}.${targetId}`,
            messagelist,
            'lifeData'
          )
        } else {
          console.log('消息发送失败：', code)
        }
      })
    },
    // 撤回消息
    recallMessage(data: {
      targetId: any
      messageUId: any
      sentTime: any
      group: any
    }) {
      const { targetId, messageUId, sentTime, group } = data
      const conversation = {
        targetId,
        conversationType: group
          ? RongIMLib.ConversationType.GROUP
          : RongIMLib.ConversationType.PRIVATE
      }
      RongIMLib.recallMessage(conversation, {
        messageUId,
        sentTime
      })
        .then((res) => {
          if (res.code === 0) {
            console.log(res.code, res.data)
          } else {
            console.log(res.code, res.msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
})

export default useStore
