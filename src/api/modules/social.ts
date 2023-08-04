/*
 * @Description: 社交服务
 * @Author: Kerwin
 * @Date: 2023-06-29 15:54:59
 * @LastEditTime: 2023-08-01 11:01:54
 * @LastEditors:  Please set LastEditors
 */
import http from '../http'

/**
 * 动态
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
/**
 * 朋友圈
 */
function circleAdd(data: any) {
  return http.post('/social/api/v1/friend/circle/add', data)
}
function circleList(data: any) {
  return http.get('/social/api/v1/friend/circle/list', data)
}
function circleDelete(data: any) {
  return http.get('/social/api/v1/friend/circle/delete', data)
}
function circleInfo(data: any) {
  return http.get('/social/api/v1/friend/circle/info', data)
}
function circleUpdate(data: any) {
  return http.post('/social/api/v1/friend/circle/update', data)
}
/**
 * 朋友圈动态
 */
function circleDynamicAdd(data: any) {
  return http.post('/social/api/v1/friend/circle/dynamic/add', data)
}
function circleDynamicList(data: any) {
  return http.get('/social/api/v1/friend/circle/dynamic/list', data)
}
function circleDynamicDelete(data: any) {
  return http.get('/social/api/v1/friend/circle/dynamic/delete', data)
}
function circleDynamicInfo(data: any) {
  return http.get('/social/api/v1/friend/circle/dynamic/info', data)
}
function circleDynamicUpdate(data: any) {
  return http.post('/social/api/v1/friend/circle/dynamic/update', data)
}
/**
 * 朋友圈用户
 */
function circleUserAdd(data: any) {
  return http.post('/social/api/v1/friend/circle/user/add', data)
}
function circleUserList(data: any) {
  return http.get('/social/api/v1/friend/circle/user/list', data)
}
function circleUserDelete(data: any) {
  return http.get('/social/api/v1/friend/circle/user/delete', data)
}
function circleUserUpdate(data: any) {
  return http.post('/social/api/v1/friend/circle/user/update', data)
}
export default {
  dynamicAdd,
  dynamicList,
  dynamicDelete,
  dynamicInfo,
  dynamicUpdate,
  circleDynamicAdd,
  circleDynamicList,
  circleDynamicDelete,
  circleDynamicInfo,
  circleDynamicUpdate,
  circleAdd,
  circleList,
  circleDelete,
  circleInfo,
  circleUpdate,
  circleUserAdd,
  circleUserList,
  circleUserDelete,
  circleUserUpdate
}
