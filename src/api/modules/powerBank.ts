/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-10 16:46:56
 * @LastEditTime: 2023-10-17 13:56:56
 * @LastEditors:  Please set LastEditors
 */
import { RequestHttp, RequestEnums } from '../http'
import { iotBaseUrl as BASEURL } from '@/common/config'

const CONFIG = {
  baseURL: BASEURL,
  timeout: RequestEnums.TIMEOUT as number,
  withCredentials: true,
  isIot: true,
  success: 0
}
const http = new RequestHttp(CONFIG)
/**
 * 站点列表
 */
function siteList(data: any) {
  return http.get('/siteList', data)
}
/**
 * 洗车机设备详情信息
 */
function getDeviceDetail(data: any) {
  return http.get('/getDeviceDetail', data)
}
/**
 * 启动设备
 */
function deviceStart(data: any) {
  return http.get('/start', data)
}
/**
 * 获取订单消费方式，单次、会员余额、卡等方式
 */
function getOrderConsumeType(data: any) {
  return http.get('/getOrderConsumeType', data)
}
/**
 * 获取正在进行的订单
 */
function getCustomerWashingOrder(data: any) {
  return http.get('/getCustomerWashingOrder', data)
}

export default {
  siteList,
  getDeviceDetail,
  deviceStart,
  getOrderConsumeType,
  getCustomerWashingOrder
}
