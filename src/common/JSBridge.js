/* eslint-disable no-plusplus */
/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-useless-constructor */
/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-17 09:58:16
 * @LastEditTime: 2023-10-31 10:29:33
 * @LastEditors:  Please set LastEditors
 */

import { browserVersion, setCookie } from '@/utils/common'

class JSBridgeClass {
  constructor() {}

  id = 0

  callbacks = {}

  registerFuncs = {}

  nativeBridge = null

  invoke(eventName, data, callback) {
    const thisId = this.id++ // 获取唯一 id
    this.callbacks[thisId] = callback // 存储 Callback
    const ua = browserVersion()
    // 判断环境，获取不同的 nativeBridge
    if (ua.isAndroid) {
      this.nativeBridge = window.nativeBridge
      console.log('is andiord bridge', this.nativeBridge)
    }
    if (ua.isIos) {
      this.nativeBridge = window.webkit.messageHandlers.CallbackEvent // WKWebView
      console.log('is ios bridge', this.nativeBridge)
    }
    // this.registerEvent(data.bridgeName, callback)
    if (this.nativeBridge) {
      this.nativeBridge.postMessage({
        eventName,
        data: data || {}
      })
    }
  }

  registerEvent(bridgeName, callback) {
    this.registerFuncs[bridgeName] = callback
  }

  callbackEvent(msg) {
    console.log('callbackEvent===>', msg)
    if (!(msg instanceof Object)) {
      msg = JSON.parse(msg)
    }
    const { bridgeName } = msg
    const data = msg.data || {}
    console.log('callbackEvent===>', bridgeName)
    if (bridgeName) {
      this.registerFuncs[bridgeName] && this.registerFuncs[bridgeName](data)
    }
  }

  // new
  HYUserEvent(msg) {
    let newMsg
    if (!(msg instanceof Object)) {
      newMsg = msg.replace(/\s+/g, '')
    } else {
      newMsg = JSON.stringify(msg)
    }
    uni.setStorageSync('userInfo', newMsg)
    const data = JSON.parse(newMsg)
    console.log('JSBridge用户信息:', data)
    const token = data.token || data.auth // ios 和 andiord 给的key不一致
    if (token) {
      token.accessToken && setCookie('HYToken', token.accessToken)
      token.blmToken && setCookie('BLMToken', token.blmToken)
    }
    if (data.deviceSn) {
      setCookie('deviceSn', data.deviceSn)
      setCookie('serviceType', data.serviceType)
    }
    const bridgeName = 'HYUserEvent'
    this.registerFuncs[bridgeName](data)
  }
}
const JSBridge = new JSBridgeClass()

window.JSBridge = JSBridge
window.callbackEvent = JSBridge.callbackEvent.bind(JSBridge)
window.HYUserEvent = JSBridge.HYUserEvent.bind(JSBridge)
// 注册回调事件
/* window.JSBridge.registerEvent("bridgeName", (data) => {
  //  do something
}); 
*/
// 父项目是H5时需要监听message
window.addEventListener('message', (event) => {
  const { data } = event
  if (data && data.userInfo) {
    window.HYUserEvent(data.userInfo)
  }
})
