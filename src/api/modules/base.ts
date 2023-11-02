import http from '../http'
/**
 * 发送验证码
 */
function smsSend(data: any) {
  return http.post('/base/api/v1/sms/send', data)
}
/**
 * 获取行业分类
 */
function getCategoryList(data: any) {
  return http.get('/base/api/v1/category/list', data)
}

/**
 * 获取首页分类
 */
// eslint-disable-next-line no-shadow
enum advertising_enum {
  ADV_HOME_LIST1 = 1000, // 黑银首页最上面的广告位
  ADV_HOME_LIST2 = 1001, // 黑银首页圆功能的广告位-黑银积分兑换
  ADV_HOME_LIST3 = 1002, // 黑银首页圆功能的广告位-现金付款
  ADV_HOME_LIST4 = 1003, // 黑银首页圆功能的广告位-充值找店家
  ADV_HOME_LIST5 = 1004, // 黑银首页圆功能的广告位-黑豆兑换
  ADV_HOME_LIST6 = 1005, // 黑银首页圆功能的广告位-黑豆兑换
  ADV_HOME_LIST7 = 1006, // 黑银首页圆功能的广告位-黑豆兑换 生活服务
  ADV_HOME_BANNER1 = 1011, // 黑银首页Banner的广告位-全城会员充值位"
  ADV_HOME_BANNER2 = 1012, // 黑银首页Banner的广告位-合伙人计划
  ADV_HOME_BANNER3 = 1021, // 黑银首页推荐的广告位
  CONTACT_HOME_LIST1 = 3000, // 黑银社交首页最上面的广告位
  ADV_FAMOUS_LIST = 5000 // 黑银名人堂-名人分类
}
function getAdvertisingList(data: any) {
  return http.get('/base/api/v1/advertising/list', data)
}

/**
 * 腾讯逆地址解析
 */
function reverseGeocoding(data: any) {
  return http.get('/base/api/v1/qq/reverse/geocoding/info', data)
}
/**
 * 获取首页分类
 */
function getAliOssToken(data: any) {
  return http.get('/base/api/v1/ali/token', data)
}
/**
 * 添加资源文件
 */
function aliAddFile(data: any) {
  return http.post('/base/api/v1/ali/addFile', data)
}
/**
 * 获取系统配置表
 */
function getSystemConfigInfo(data: any) {
  return http.get('/base/api/v1/system/config/info', data)
}
/**
 * 获取wx jsSdk签名配置
 */
function getWxSdkConfig(data: any) {
  return http.post('/base/api/v1/wx/getJsSdkSign', data)
}
/**
 * 问卷列表接口
 */
function questionPaperList(data: any) {
  return http.get('/base/api/v1/question/paper/list', data)
}
/**
 * 问卷详情接口
 */
function questionPaperInfo(data: any) {
  return http.get('/base/api/v1/question/paper/info', data)
}
/**
 * 问卷题列表接口
 */
function questionList(data: any) {
  return http.get('/base/api/v1/question/list', data)
}
/**
 * 问卷题详情接口
 */
function questionInfo(data: any) {
  return http.get('/base/api/v1/question/info', data)
}
/**
 * 问卷题选项列表接口
 */
function questionOptionList(data: any) {
  return http.get('/base/api/v1/question/option/list', data)
}
/**
 * 问卷题选项列表接口
 */
function questionOptionInfo(data: any) {
  return http.get('/base/api/v1/question/option/info', data)
}
/**
 * 问卷结果新增接口
 */
function questionAnsAdd(data: any) {
  return http.post('/base/api/v1/question/paper/answer/add', data)
}
/**
 * 问卷结果删除接口
 */
function questionAnsDel(data: any) {
  return http.post('/base/api/v1/question/paper/answer/delete', data)
}
/**
 * 问卷结果详情接口
 */
function questionAnsInfo(data: any) {
  return http.post('/base/api/v1/question/paper/answer/info', data)
}
/**
 * 问卷结果列表
 */
function questionAnsList(data: any) {
  return http.get('/base/api/v1/question/paper/answer/list', data)
}

export default {
  getCategoryList,
  getAdvertisingList,
  advertising_enum,
  smsSend,
  reverseGeocoding,
  getAliOssToken,
  aliAddFile,
  getSystemConfigInfo,
  getWxSdkConfig,
  questionPaperList,
  questionPaperInfo,
  questionList,
  questionInfo,
  questionOptionList,
  questionOptionInfo,
  questionAnsAdd,
  questionAnsDel,
  questionAnsInfo,
  questionAnsList
}
