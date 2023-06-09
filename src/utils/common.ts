/* eslint-disable no-console */
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
/**
 * 获取上一个路由页面实例
 */
export const getPrePage = () => {
  const pages = getCurrentPages()
  const prePage = pages[pages.length - 2]
  // #ifdef H5
  return prePage
  // #endif
  return prePage.$vm
}
/**
 * 拉起客户端APP
 */
export const launchClientApp = () => {
  const u = navigator.userAgent
  const isWeixin = u.toLowerCase().indexOf('micromessenger') !== -1 // 微信内
  const isAliPay = isAlipayClient()
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 // android终端
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
  if (isWeixin || isAliPay) {
    uni.showModal({
      content: '请在浏览器上打开'
    })
  } else {
    const enum Android {
      scheme = 'baixudroidapp://b2dhzj.jgshare.cn',
      download_url = 'https://www.blacksilverscore.com/download/index.html'
    }
    const enum Ios {
      scheme = 'com.sz.heiyinjifen://',
      download_url = 'https://apps.apple.com/cn/app/id1630271279'
    }
    if (isAndroid || isIOS) {
      window.location.href = isAndroid ? Android.scheme : Ios.scheme
      const timer = setTimeout(() => {
        uni.showModal({
          content: '此功能需访问黑银APP',
          confirmText: '下载黑银APP',
          success(res) {
            if (res.confirm) {
              window.location.href = isAndroid
                ? Android.download_url
                : Ios.download_url
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }, 2000)
      window.addEventListener('visibilitychange', () => {
        const hidden =
          window.document.hidden ||
          window.document.mozHidden ||
          window.document.msHidden ||
          window.document.webkitHidden
        if (hidden) {
          // 如果页面隐藏了，则表示唤起成功，这时候需要清除下载定时器
          clearTimeout(timer)
        }
      })
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
