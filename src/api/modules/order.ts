import http from '../http'

/**
 * 订单新增
 */
function orderAdd(data: any) {
  return http.get('/order/api/v1/order/add', data)
}
/**
 * 订单删除
 */
function orderDelete(data: any) {
  return http.get('/order/api/v1/order/add', data)
}
/**
 * 订单详情
 */
function orderInfo(data: any) {
  return http.get('/order/api/v1/order/info', data)
}
/**
 * 订单列表
 */
function orderList(data: any) {
  return http.get('/order/api/v1/order/list', data)
}
/**
 * 订单金额
 */
function orderMoney(data: any) {
  return http.get('/order/api/v1/order/money', data)
}
/**
 * 订单支付
 */
function orderPay(data: any) {
  return http.get('/order/api/v1/order/pay', data)
}
/**
 * 微信支付回调
 */
function orderUpdate(data: any) {
  return http.get('/order/api/v1/order/weixinPayHandle', data)
}

export default {
  orderAdd,
  orderDelete,
  orderInfo,
  orderList,
  orderMoney,
  orderPay,
  orderUpdate
}
