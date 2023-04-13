import http from '../http'

/**
 * 优惠卷
 */
function couponAdd(data: any) {
  return http.post('/coupon/api/v1/coupon/add', data)
}
/**
 * 用户优惠卷
 */
function userCouponAdd(data: any) {
  return http.post('/coupon/api/v1/user/coupon/add', data)
}
function userCouponList(data: any) {
  return http.get('/coupon/api/v1/user/coupon/list', data)
}

export default {
  couponAdd,
  userCouponAdd,
  userCouponList
}
