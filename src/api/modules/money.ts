import http from '../http'

/**
 * 用户钱包列表接口
 */
function walletList(data: any) {
  return http.get('/money/api/v1/wallet/list', data)
}
/**
 * 用户钱包详情接口
 */
function walletInfo(data: any) {
  return http.get('/money/api/v1/wallet/info', data)
}

/**
 * 红包
 */
function redPacketAdd(data: any) {
  return http.post('/money/api/v1/friend/circle/red/packet/add', data)
}
function redPacketInfo(data: any) {
  return http.get('/money/api/v1/friend/circle/red/packet/info', data)
}
function redPacketList(data: any) {
  return http.get('/money/api/v1/friend/circle/red/packet/list', data)
}

export default {
  walletList,
  walletInfo,
  redPacketAdd,
  redPacketInfo,
  redPacketList
}
