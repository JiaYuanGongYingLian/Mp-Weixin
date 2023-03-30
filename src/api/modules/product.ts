import http from '../http';

/**
 * 获取行业分类
 */
function getShopList(data: any) {
  return http.get('/product/api/v1/shop/list', data);
}
export default {
  getShopList
};
