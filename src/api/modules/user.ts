import http from '../http'

function login() {
  return http.post('/auth/api/v1/auth/wxMiniLogin')
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
export default {
  login,
  getCode
}
