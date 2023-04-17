/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store'

const store = useUserStore()
const { hasLogin } = storeToRefs(store)

export const getPrePage = (index: any) => {
  const pages = getCurrentPages()
  const prePage = pages[pages.length - (index || 2)]
  // #ifdef H5
  return prePage
  // #endif
  return prePage.$vm
}
/**
 * 开发环境全局打印日志
 * @param {Object} title
 */
export const log = (title: object) => {
  if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
    console.log(JSON.stringify(title))
  }
}

export const dateFormat = (date: Date, fmt: string) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substr(4 - RegExp.$1.length)
    )
  }
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = `${o[k]}`
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}
function padLeftZero(str: string | any[]) {
  return `00${str}`.substr(str.length)
}

/**
 * 拼接图片地址
 * @param {String} suffix
 */
const FILE_URL = 'https://image.blacksilverscore.com/'
export const getImgFullPath = (suffix: string) => {
  if (!suffix) return
  if (suffix.includes('http' || 'https')) {
    return suffix
  }
  return FILE_URL + suffix
}

// 计算距离的方法实现
function rad(d: number) {
  return (d * Math.PI) / 180.0
}

// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export function getDistance(lat1: any, lng1: any, lat2: any, lng2: any) {
  return new Promise((resolve, reject) => {
    const radLat1 = rad(lat1)
    const radLat2 = rad(lat2)
    const a = radLat1 - radLat2
    const b = rad(lng1) - rad(lng2)
    let s =
      2 *
      Math.asin(
        Math.sqrt(
          Math.sin(a / 2) ** 2 +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) ** 2
        )
      )
    s *= 6378.137 // EARTH_RADIUS;
    // 输出为公里
    s = Math.round(s * 10000) / 10000

    const distance = s
    let distance_str = ''

    if (parseInt(distance, 10) >= 1) {
      // distance_str = distance.toFixed(1) + "km";
      distance_str = `${distance.toFixed(2)} km`
    } else {
      // distance_str = distance * 1000 + "m";
      distance_str = `${(distance * 1000).toFixed(2)} m`
    }
    const objData = {
      distance,
      distance_str
    }
    resolve(objData)
  })
}
export function getDistanceMatrix(lat1: any, lng1: any, lat2: any, lng2: any) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: 'https://apis.map.qq.com/ws/distance/v1/matrix',
      method: 'GET',
      data: {
        mode: 'walking',
        from: `${lat1},${lng1}`,
        to: `${lat2},${lng2}`,
        key: 'WZUBZ-XKZ3W-EXIRA-3IAU7-MHXY7-ARBJO'
      },
      success: (res) => {
        let { distance } = res.data.result.rows[0].elements[0] // 拿到距离(米)
        let distance_str = ''
        if (distance && distance !== -1) {
          if (distance < 1000) {
            distance_str = `${distance}m`
          }
          // 转换成公里
          else {
            distance_str = `${(distance / 2 / 500).toFixed(2)}km`
          }
        } else {
          distance = '距离太近或请刷新重试'
        }
        const objData = {
          distance,
          distance_str
        }
        resolve(objData)
      }
    })
  })
}

export function handleMapLocation(shop: {
  latitude: any
  longitude: any
  addr: any
}) {
  const { latitude, longitude, addr } = shop
  console.log('进入导航')
  // 获取定位信息
  uni.getLocation({
    type: 'wgs84',
    success(res) {
      if (res.errMsg == 'getLocation:ok') {
        console.log(latitude)
        console.log(longitude)
        uni.openLocation({
          // 传入你要去的纬度
          latitude,
          // 传入你要去的经度
          longitude,
          // 传入你要去的地址信息 不填则为空
          address: addr,
          // 缩放大小
          scale: 18,
          success() {
            console.log('成功的回调success')
          }
        })
      }
    },
    fail(res) {
      console.log(res)
      if (res.errMsg == 'getLocation:fail auth deny') {
        uni.showModal({
          content: '检测到您没打开获取信息功能权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (res) => {
                  console.log('确定')
                }
              })
            } else {
              console.log('取消')
              return false
            }
          }
        })
      }
    }
  })
}

// 预览图片
export function previewImage(pics: any, current?: any) {
  if (!pics) return
  uni.previewImage({
    urls: pics,
    current,
    indicator: 'default'
  })
}
// 检查登录态
export function checkLoginState() {
  if (!hasLogin.value) {
    uni.navigateTo({
      url: '/pages/login/index'
    })
    return false
  }
  return true
}
// 调用电话
export function makePhoneCall(phoneNumber: any) {
  if (!phoneNumber) return
  uni.makePhoneCall({
    phoneNumber
  })
}
export default {
  getPrePage,
  log,
  getImgFullPath,
  getDistance,
  getDistanceMatrix,
  previewImage,
  checkLoginState,
  makePhoneCall,
  dateFormat
}
