// url所有传参获取
export function getQueryObject(url: string | null) {
  url = url == null ? window.location.href : url
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
  const ua = window.navigator.userAgent.toLowerCase()
  const env = ua.match(/MicroMessenger/i)
  return env ? env[0] === 'micromessenger' : false
}
export default {
  getQueryObject,
  getQueryVariable,
  isWeChat
}
