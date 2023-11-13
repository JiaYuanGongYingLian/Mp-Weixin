/* eslint-disable radix */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable no-param-reassign */
import { uploadUrl } from '@/common/config'
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
  // #ifndef H5
  return prePage.$vm
  // #endif
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

// 参数拼接
export const parseParams = (uri: string, params: { [x: string]: any }) => {
  if (!uri) return ''
  const paramsArray: string[] = []
  Object.keys(params).forEach(
    (key) => params[key] && paramsArray.push(`${key}=${params[key]}`)
  )
  if (uri?.search(/\?/) === -1) {
    uri += `?${paramsArray.join('&')}`
  } else {
    uri += `&${paramsArray.join('&')}`
  }
  return uri
}

// 判断空对象
export const isEmptyObject = (value: { constructor?: any }) => {
  return (
    value && Object.keys(value).length === 0 && value.constructor === Object
  )
}

// 判断手机号正确性
export const isMobile = (value: string) => {
  return /^1[3-9]\d{9}$/.test(value)
}

export const $toast = (
  str: any,
  option: { duration?: any } = { duration: 2000 }
) => {
  if (!str) {
    throw new Error('请填写正确的提示')
  }
  option = option || {}
  uni.showToast({
    title: str,
    icon: 'none',
    duration: option.duration
  })
}

/*
 * image文件url转base64
 * @param{ url } image文件url
 */
export const imageUrlToBase64 = (url: any) => {
  if (!url) return
  return new Promise((resolve, reject) => {
    uni.request({
      url,
      method: 'GET',
      responseType: 'arraybuffer',
      success: async (res) => {
        const base64 = uni.arrayBufferToBase64(res.data)
        const Base64Url = `data:image/jpeg;base64,${base64}`
        resolve(Base64Url)
      },
      fail: (e) => {
        reject(e)
      }
    })
  })
}
/*
 * bolb转file对象
 * @param{ bolb } 文件bolb
 * @param{ filename } 文件名称
 */
export const base64ToFile = (base64: string, name: string) => {
  if (typeof base64 !== 'string') {
    return
  }
  const arr = base64.split(',')
  const type = arr[0].match(/:(.*?);/)[1]
  const fileExt = type.split('/')[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${name}.${fileExt}`, {
    type
  })
}
/*
 * image文件url转 file
 * @param{ url } image文件url
 */
export const imageUrlToFile = async (url: string) => {
  const base64Url = await imageUrlToBase64(url)
  const file = await base64ToFile(base64Url, `${new Date()}`)
  return file
}

export const wxUploadImage = (filePath: any) => {
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: uploadUrl,
      filePath,
      name: 'object',
      header: {
        Authorization: `Bearer ${uni.getStorageSync('accessToken') || ''}`
      },
      success: (res) => {
        console.log('上传成功')
        resolve(JSON.parse(res.data))
      },
      fail: (err) => {
        console.log(err)
        reject(err)
      }
    })
  })
}

/**
 * browserVersion 判断浏览器环境
 * @return {Object}
 */
export const browserVersion = () => {
  const u = navigator.userAgent
  console.log('useragent==>', u)
  return {
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    webApp: u.indexOf('Safari') == -1, // 是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, // 是否微信 （2015-01-22新增）
    qq: u.match(/\sQQ/i) == ' qq', // 是否QQ
    isAndroid: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
    isIos: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    isHeiyin: u.indexOf('黑银') > -1, // 黑银
    isMp: u.indexOf('miniProgram') > -1 // 小程序
  }
}
/**
 * setCookie 设置cookie的函数
 * @param {1} key 设置的cookie的键
 * @param {2} value 设置的cookie的值
 * @param {3} seconds 设置cookie在多少秒之后失效 - 单位：秒
 * @param {4} path 设置cookie的路径 - 默认是 / 根目录
 */
export const setCookie = (
  key: any,
  value: null,
  seconds: number,
  path = '/'
) => {
  const date = new Date()
  date.setTime(date.getTime() - 8 * 3600 * 1000 + seconds * 1000)
  document.cookie = `${key}=${value};expires=${date};path=${path}`
}
/**
 * getCookie 获取cookie的函数
 * @param {1} key 要获取的cookie的键
 * return 返回想要的键对应的值
 */
export const getCookie = (key: string) => {
  const cookies = document.cookie
  const arr = cookies.split('; ')
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].split('=')[0] == key) {
      return arr[i].split('=')[1]
    }
  }
}
/**
 * removeCookie 删除cookie的函数
 * @param {1} key 要删除的cookie的键
 * @param {2} path 要删除的cookie的路径 - 默认为 / 根目录
 */
export const removeCookie = (key: any, path = '/') => {
  setCookie(key, null, -1, path)
}

/**
  * 版本号比较
  * @param {string
} v1 
  * @param {string
} v2 
  */
export function compareVersion(v1: any[], v2: any[]) {
  v1 = v1.split('.')
  v2 = v2.split('.')
  const len = Math.max(v1.length, v2.length)

  while (v1.length < len) {
    v1.push('0')
  }
  while (v2.length < len) {
    v2.push('0')
  }

  for (let i = 0; i < len; i++) {
    const num1 = parseInt(v1[i])
    const num2 = parseInt(v2[i])

    if (num1 > num2) {
      return 1
    }
    if (num1 < num2) {
      return -1
    }
  }

  return 0
}

/**
 * qs 对象转queryString
 * @param {1} data 要转换的对象
 */
export function qs(data: { [x: string]: any }) {
  const paramsArray: string[] = []
  Object.keys(data).forEach(
    (key) => data[key] && paramsArray.push(`${key}=${data[key]}`)
  )
  return paramsArray.join('&')
}

export default {
  getQueryObject,
  getQueryVariable,
  isWeChat,
  isAlipayClient,
  getPrePage,
  callPreviousRouteMethod,
  launchClientApp,
  generateId,
  parseParams,
  isEmptyObject,
  isMobile,
  $toast,
  imageUrlToFile,
  wxUploadImage,
  browserVersion,
  setCookie,
  getCookie,
  compareVersion,
  qs
}
