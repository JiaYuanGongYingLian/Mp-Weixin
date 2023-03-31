import http from '../http';

/**
 * 获取店铺列表
 */
function getShopList(data: any) {
  return http.get('/product/api/v1/shop/list', data);
}

/**
 * 获取店铺详情
 */
function getShopInfo(data: any) {
  return http.get('/product/api/v1/shop/info', data);
}
export default {
  getShopList,
  getShopInfo
};
