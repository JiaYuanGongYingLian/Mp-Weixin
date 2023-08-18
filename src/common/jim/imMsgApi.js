/* eslint-disable default-param-last */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-nested-ternary */
const jimMsg = {
  getSingleMsg(chatList = [], chatInfoList = [], userInfo) {
    const object = {}
    const _chatList = chatList.map((e) => e.username)
    const _chatInfoList = chatInfoList.map((e) => e.from_username)
    const index = _chatList.indexOf(userInfo.username)
    if (index === -1) {
      object.isfind = false
      object._chatInfoList = null
      object._chatList = {
        name: userInfo.username,
        username: userInfo.username,
        appkey: userInfo.appkey,
        type: 3,
        mtime: new Date().getTime(),
        avatar: userInfo.avatar,
        nickName: userInfo.nickName,
        extras: userInfo.extras,
        unread_msg_count: 0
      }
    } else {
      const _index = _chatInfoList.indexOf(userInfo.username)
      if (_index === -1) {
        object.isfind = false
        object._chatInfoList = null
        object._chatList = {
          name: userInfo.username,
          username: userInfo.username,
          appkey: userInfo.appkey,
          type: 3,
          mtime: new Date().getTime(),
          avatar: userInfo.avatar,
          nickName: userInfo.nickName,
          extras: userInfo.extras,
          unread_msg_count: 0
        }
      } else {
        object.isfind = true
        object._chatList = null
        object._chatInfoList = chatInfoList[_index].msgs || []
      }
    }
    return object
  },
  formatConversation(chatList = [], chatInfoList = []) {
    chatList.forEach((e) => {
      chatInfoList.forEach((el) => {
        if (e.username === el.from_username) {
          const msgs = el.msgs || []
          const content =
            (msgs[msgs.length - 1] && msgs[msgs.length - 1].content) || null
          if (content) {
            const types =
              content.msg_type === 'text'
                ? '1'
                : content.msg_type === 'image'
                ? '2'
                : '3'
            let txt = ''
            if (types == 1) {
              txt = content.msg_body.text || ''
            } else if (types == 2) {
              txt = '[图片]'
            } else if (content.msg_body.extras.isVoice) {
              txt = '[录音]'
            } else {
              txt = '[文件]'
            }
            e.content = txt
          }
        }
      })
    })
    return chatList
  },
  formatMsgInfo(jimUserInfo = {}, params = {}, res = {}) {
    let content
    if (params.target_gid) {
      content = {
        from_id: jimUserInfo.username,
        from_platform: 'web',
        set_from_name: 0,
        create_time: new Date().getTime(),
        target_type: 'group',
        target_gname: params.target_gname,
        target_gid: res.target_gid,
        version: 1,
        msg_body: {
          ...params,
          text: params.content,
          extras: params.extras
        },
        msg_type: params.type || 'text'
      }
    } else {
      content = {
        from_type: 'user',
        from_id: jimUserInfo.username,
        set_from_name: 0,
        target_appkey: params.appkey,
        target_name: params.target_username,
        create_time: new Date().getTime(),
        from_appkey: jimUserInfo.appkey,
        target_type: 'single',
        from_platform: 'web',
        target_id: params.target_username,
        from_name: jimUserInfo.username,
        version: 1,
        msg_body: {
          ...params,
          text: params.content,
          extras: params.extras
        },
        msg_type: params.type || 'text'
      }
    }
    const msgInfo = {
      ctime_ms: res.ctime_ms,
      from_appkey: params.appkey,
      from_username: params.target_username,
      from_gid: params.target_gid,
      target_gid: params.target_gid,
      msg_type: params.target_gid ? 4 : 3,
      need_receipt: false,
      custom_notification: {
        alert: '',
        at_prefix: '',
        title: '',
        enabled: ''
      },
      msg_id: res.msg_id,
      msg_level: res.msg_level || 0,
      content
    }
    return msgInfo
  },
  formatMsgInfoReceive(msg) {
    const { content, ctime_ms, msg_type, need_receipt, from_gid } = msg
    const msgInfo = {
      from_appkey: content.from_appkey,
      from_username: content.from_id,
      from_gid,
      ctime_ms,
      msg_type,
      need_receipt,
      custom_notification: {
        alert: '',
        at_prefix: '',
        title: '',
        enabled: ''
      },
      msg_id: msg.msg_id,
      msg_level: msg.msg_level,
      content
    }
    return msgInfo
  },
  getGroupMsg(chatList = [], chatInfoList = [], groupInfo) {
    const object = {}
    const _chatList = chatList.map((e) => e.gid)
    const _chatInfoList = chatInfoList.map((e) => e.from_gid)
    const index = _chatList.indexOf(String(groupInfo.gid))
    if (index === -1) {
      object.isfind = false
      object._chatInfoList = null
      object._chatList = {
        name: groupInfo.name,
        username: groupInfo.username,
        appkey: groupInfo.appkey,
        type: 4,
        mtime: new Date().getTime(),
        avatar: groupInfo.avatar,
        nickName: groupInfo.nickName,
        extras: groupInfo.extras,
        unread_msg_count: 0
      }
    } else {
      const _index = _chatInfoList.indexOf(String(groupInfo.gid))
      if (_index === -1) {
        object.isfind = false
        object._chatInfoList = null
        object._chatList = {
          name: groupInfo.name,
          username: groupInfo.username,
          appkey: groupInfo.appkey,
          type: 4,
          mtime: new Date().getTime(),
          avatar: groupInfo.avatar,
          nickName: groupInfo.nickName,
          extras: groupInfo.extras,
          unread_msg_count: 0
        }
      } else {
        object.isfind = true
        object._chatList = null
        object._chatInfoList = chatInfoList[_index].msgs || []
      }
    }
    return object
  }
}

export default jimMsg
