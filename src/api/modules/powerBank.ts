/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-10-10 16:46:56
 * @LastEditTime: 2023-10-10 18:02:48
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

export default {
  siteList
}
