/* eslint-disable no-console */
import * as RongIMLib from '@rongcloud/imlib-next'
import { RONGYUN_APPKEY } from '@/common/config'

RongIMLib.init({ appkey: RONGYUN_APPKEY })
console.log('融云初始化=======>完成')

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
export const PintuanMessage = RongIMLib.registerMessageType(
  'KX:Pintuan',
  true,
  true,
  [],
  false
)

export default RongIMLib
