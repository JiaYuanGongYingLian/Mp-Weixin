/* eslint-disable no-console */
import * as RongIMLib from '@rongcloud/imlib-next'
import { RONGYUN_APPKEY } from '@/common/config'

RongIMLib.init({ appkey: RONGYUN_APPKEY })
export const HongBaoMessage = RongIMLib.registerMessageType(
  'KX:HongBao',
  true,
  true,
  [],
  false
)
console.log('融云初始化=======>完成')

export default RongIMLib
