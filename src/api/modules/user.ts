import http from '../http'

function wxMiniLogin() {
  return http.post('/auth/api/v1/auth/wxMiniLogin')
}

function wxWebLogin() {
  return http.post('/auth/api/v1/auth/wxWebLogin')
}

function login(data: any) {
  return http.post('/auth/api/v1/auth/login', data)
}
/**
 * 获取验证码
 * @param phone 手机号
 */
function getCode(phone: string): Promise<{ num: number }> {
  return http.get('random/code', {
    params: {
      phone
    }
  })
}
/**
 * 用户信息
 */
function userInfo() {
  return http.get('/ups/api/v1/user/info')
}
/**
 * 地址
 */
function getAddressList(data: any) {
  return http.get('/ups/api/v1/user/address/list', data)
}
function getAddressInfo(data: any) {
  return http.get('/ups/api/v1/user/address/info', data)
}
function updateAddressInfo(data: any) {
  return http.post('/ups/api/v1/user/address/update', data)
}
function deleteAddressInfo(data: any) {
  return http.get('/ups/api/v1/user/address/delete', data)
}
function addressAdd(data: any) {
  return http.post('/ups/api/v1/user/address/add', data)
}

export default {
  login,
  wxMiniLogin,
  wxWebLogin,
  getCode,
  getAddressList,
  getAddressInfo,
  updateAddressInfo,
  deleteAddressInfo,
  addressAdd,
  userInfo
}
