import http from '../http'

function wxlogin() {
  return http.post('/auth/api/v1/auth/wxMiniLogin')
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
export default {
  login,
  wxlogin,
  getCode
};
