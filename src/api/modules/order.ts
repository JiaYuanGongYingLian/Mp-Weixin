import http from '../http'

/**
 * 订单新增
 */
function orderAdd(data: any) {
  return http.post('/order/api/v1/order/add', data)
}
/**
 * 订单删除
 */
function orderDelete(data: any) {
  return http.get('/order/api/v1/order/delete', data)
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
  return http.post('/order/api/v1/order/money', data)
}
/**
 * 订单支付
 */
function orderPay(data: any) {
  return http.post('/order/api/v1/order/pay', data)
}
/**
 * 订单更新
 */
function orderUpdate(data: any) {
  return http.post('/order/api/v1/order/update', data)
}
/**
 * 订单支付
 */
function payInfoInfo(data: any) {
  return http.get('/order/api/v1/pay/info/info', data)
}
function payInfoList(data: any) {
  return http.get('/order/api/v1/pay/info/list', data)
}

export default {
  orderAdd,
  orderDelete,
  orderInfo,
  orderList,
  orderMoney,
  orderPay,
  orderUpdate,
  payInfoInfo,
  payInfoList
}
