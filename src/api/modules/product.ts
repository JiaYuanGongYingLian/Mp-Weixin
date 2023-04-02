import http from '../http'

/**
 * 获取店铺列表
 */
function getShopList(data: any) {
  return http.get('/product/api/v1/shop/list', data)
}

/**
 * 获取店铺详情
 */
function getShopInfo(data: any) {
  return http.get('/product/api/v1/shop/info', data)
}

/**
 * 获取店铺产品列表
 */
function getShopProductList(data: any) {
  return http.get('/product/api/v1/shop/product/list', data)
}

/**
 * 获取店铺产品详情
 */
function getShopProductInfo(data: any) {
  return http.get('/product/api/v1/shop/product/info', data)
}

/**
 * 获取店铺sku列表
 */
function getShopProductSkuList(data: any) {
  return http.get('/product/api/v1/shop/product/sku/list', data)
}
export default {
  getShopList,
  getShopInfo,
  getShopProductList,
  getShopProductSkuList,
  getShopProductInfo
}
