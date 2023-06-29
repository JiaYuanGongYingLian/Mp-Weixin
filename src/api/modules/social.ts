/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-06-29 15:54:59
 * @LastEditTime: 2023-06-29 17:16:23
 * @LastEditors:  Please set LastEditors
 */
import http from '../http'

/**
 * 优惠卷
 */
function dynamicAdd(data: any) {
  return http.post('/social/api/v1/dynamic/add', data)
}
function dynamicList(data: any) {
  return http.get('/social/api/v1/dynamic/list', data)
}
function dynamicDelete(data: any) {
  return http.get('/social/api/v1/dynamic/delete', data)
}
function dynamicInfo(data: any) {
  return http.get('/social/api/v1/dynamic/info', data)
}
function dynamicUpdate(data: any) {
  return http.post('/social/api/v1/dynamic/update', data)
}

export default {
  dynamicAdd,
  dynamicList,
  dynamicDelete,
  dynamicInfo,
  dynamicUpdate
}
