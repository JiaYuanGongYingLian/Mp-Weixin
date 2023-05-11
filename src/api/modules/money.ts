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

export default {
  walletList,
  walletInfo
}
