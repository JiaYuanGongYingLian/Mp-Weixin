/* eslint-disable no-console */
import * as RongIMLib from '@rongcloud/imlib-next'
import { RONGYUN_APPKEY_V1, RONGYUN_APPKEY_V2 } from '@/common/config'

RongIMLib.init({ appkey: RONGYUN_APPKEY_V2 })
// const v = uni.getStorageSync('version')
// console.log('vvv==>', v)
// if (v && v > '1.1.1') {
//   console.log('appKey2', RONGYUN_APPKEY_V2)
//   RongIMLib.init({ appkey: RONGYUN_APPKEY_V2 })
// } else {
//   RongIMLib.init({ appkey: RONGYUN_APPKEY_V1 })
// }
console.log('融云初始化=======>完成')

export const PinTuanMessage = RongIMLib.registerMessageType(
  'KX:PinTuan',
  true,
  true,
  [],
  false
)
export const HongBaoMessage = RongIMLib.registerMessageType(
  'KX:HongBao',
  true,
  true,
  [],
  false
)
export const ProductMessage = RongIMLib.registerMessageType(
  'KX:Product',
  true,
  true,
  [],
  false
)
export default RongIMLib
