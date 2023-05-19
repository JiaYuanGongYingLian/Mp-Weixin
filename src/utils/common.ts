/* eslint-disable no-param-reassign */
// url所有传参获取
export function getQueryObject(url: string) {
  url = url || window.location.href
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs: any, $1: string, $2: string) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}
// url单个参数获取
export const getQueryVariable = (variable: string) => {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

// 判断是否为微信内部浏览器
export function isWeChat() {
  // #ifdef H5
  const ua = window.navigator.userAgent.toLowerCase()
  const env = ua.match(/MicroMessenger/i)
  return env ? env[0] === 'micromessenger' : false
  // #endif
  // #ifdef MP-WEIXIN
  return false
  // #endif
}
// 判断是否为支付宝内部浏览器
export function isAlipayClient() {
  // #ifdef H5
  return /AlipayClient/.test(window.navigator.userAgent)
  // #endif
  // #ifdef MP-WEIXIN
  return false
  // #endif
}

/**
 * vue3 调用上一个路由页面的方法
 * @param {router}  页面调用useRouter
 * @param {functionName}  调用函数名称
 */
export function callPreviousRouteMethod(
  router: {
    currentRoute: { value: { matched: any } }
  },
  functionName: string
) {
  const matchedRoutes = router.currentRoute.value.matched
  const currentRouteIndex = matchedRoutes.length - 1
  if (currentRouteIndex >= 1) {
    const previousRoute = matchedRoutes[currentRouteIndex - 1]
    if (
      previousRoute &&
      typeof previousRoute.components.default.methods[functionName] ===
        'function'
    ) {
      previousRoute.components.default.methods[functionName]()
    }
  }
}
export const getPrePage = () => {
  const pages = getCurrentPages()
  const prePage = pages[pages.length - 2]
  // #ifdef H5
  return prePage
  // #endif
  return prePage.$vm
}

export const launchClientApp = () => {
  const u = navigator.userAgent
  const isWeixin = u.toLowerCase().indexOf('micromessenger') !== -1 // 微信内
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isWeixin) {
    uni.showModal({
      title: '请在浏览器上打开'
    })
  } else {
    // android端
    if (isAndroid) {
      // 安卓app的scheme协议
      window.location.href = 'taobao://'
      setTimeout(() => {
        const hidden =
          window.document.hidden ||
          window.document.mozHidden ||
          window.document.msHidden ||
          window.document.webkitHidden
        if (typeof hidden === 'undefined' || hidden === false) {
          // 应用宝下载地址 (emmm 找不到淘宝应用宝的地址，这里放的是 lucky coffee 地址)
          window.location.href =
            'https://a.app.qq.com/o/simple.jsp?pkgname=com.lucky.luckyclient'
        }
      }, 2000)
    }
    // ios端
    if (isIOS) {
      // ios的scheme协议
      window.location.href = 'taobao://'
      setTimeout(() => {
        const hidden =
          window.document.hidden ||
          window.document.mozHidden ||
          window.document.msHidden ||
          window.document.webkitHidden
        if (typeof hidden === 'undefined' || hidden === false) {
          // App store下载地址
          window.location.href = 'http://itunes.apple.com/app/id387682726'
        }
      }, 2000)
    }
  }
}
/**
 * 生成随机id
 * @return {String} id
 */
export const generateId = () => {
  const s = []
  const hexDigits = '0123456789abcdef'
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4'
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'

  const uuid = s.join('')
  return uuid
}
export default {
  getQueryObject,
  getQueryVariable,
  isWeChat,
  isAlipayClient,
  getPrePage,
  callPreviousRouteMethod,
  launchClientApp,
  generateId
}
