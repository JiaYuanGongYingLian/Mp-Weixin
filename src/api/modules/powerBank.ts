/* eslint-disable no-shadow */
/*
 * @Description: 物联网（充电宝）相关接口，使用用的api地址来自蒲哥，文档地址http://47.98.169.155:16588/#/home
 * @Author: Kerwin
 * @Date: 2023-10-10 16:46:56
 * @LastEditTime: 2023-10-25 15:24:35
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
 * 获取正在进行的订单列表
 */
function getCustomerWashingOrders(data: any) {
  return http.get('/getCustomerWashingOrders', data)
}
/**
 * 获取正在进行的订单详情
 */
function getCustomerWashingOrder(data: any) {
  return http.get('/getCustomerWashingOrder', data)
}
/**
 * 获取所有订单记录
 */
function getOrders(data: any) {
  return http.post('/getOrders', data)
}
/**
 * 获取用户信息、卡信息、优惠券信息（V3删除了用户钱包，分离了优惠券、卡）
 */
function getCustomerInfo(data: any) {
  return http.get('/getCustomerInfo', data)
}
/**
 * 获取用户微信信用分
 */
function createScoreServiceOrder(data: any) {
  return http.get('/createScoreServiceOrder', data)
}
/**
 * 查询信用分订单
 */
function queryScoreServiceOrder(data: any) {
  return http.get('/queryScoreServiceOrder', data)
}
/**
 * 获取wx jsSdk签名配置
 */
function getWxJsSdkSign(data: any) {
  return http.post('/getWxJsSdkSign', data)
}
enum serviceType {
  WASH = 1, // "洗车"
  DPC_CHARGE = 2, // "电瓶车充电"
  AC_CHARGE = 3, // "交流慢充"
  DC_CHARGE = 4, // "直流快充"
  DOOR_WASH = 5, // "上门洗车"
  HELP_WASH = 6, // "代洗车"
  WIRELESS_CHARGE = 7, // "隔空无线充电"
  PORTABLE_CHARGER = 8 // "共享充电宝"
}
export default {
  siteList,
  getDeviceDetail,
  deviceStart,
  getOrderConsumeType,
  getCustomerWashingOrder,
  getCustomerWashingOrders,
  getOrders,
  getCustomerInfo,
  serviceType,
  createScoreServiceOrder,
  getWxJsSdkSign,
  queryScoreServiceOrder
}
