import http from '../http'

/**
 * 获取店铺列表
 */
function getShopList(data: any) {
  return http.get('/product/api/v1/shop/list', data)
}

/**
 * 店铺新增
 */
function shopAdd(data: any) {
  return http.post('/product/api/v1/shop/add', data)
}

/**
 * 获取店铺详情
 */
function getShopInfo(data: any) {
  return http.get('/product/api/v1/shop/info', data)
}

/**
 * 店铺详情更新
 */
function shopUpdate(data: any) {
  return http.post('/product/api/v1/shop/update', data)
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

/**
 * 购物车
 */
function productCartList(data: any) {
  return http.get('/product/api/v1/product/cart/list', data)
}
function productCartAdd(data: any) {
  return http.post('/product/api/v1/product/cart/add', data)
}
function productCartUpdate(data: any) {
  return http.post('/product/api/v1/product/cart/update', data)
}
function productCartDelete(data: any) {
  return http.get('/product/api/v1/product/cart/delete', data)
}
function productCartInfo(data: any) {
  return http.post('/product/api/v1/product/cart/info', data)
}

/**
 * 收藏sku
 */
function productFavoriteList(data: any) {
  return http.get('/product/api/v1/product/favorite/list', data)
}
function productFavoriteAdd(data: any) {
  return http.post('/product/api/v1/product/favorite/add', data)
}
function productFavoriteInfo(data: any) {
  return http.get('/product/api/v1/product/favorite/info', data)
}
function productFavoriteDelete(data: any) {
  return http.get('/product/api/v1/product/favorite/delete', data)
}
/**
 * 产品浏览量
 */
function productReviewAdd(data: any) {
  return http.post('/product/api/v1/product/review/add', data)
}
/**
 * 门店商品钱包使用配置列表接口
 */
function walletRuleList(data: any) {
  return http.get('/product/api/v1/shop/product/sku/wallet/rule/list', data)
}

/**
 * 门店红包券
 */
function shopStatisticsInfo(data: any) {
  return http.get('/product/api/v1/shop/statistics/info', data)
}

export default {
  getShopList,
  getShopInfo,
  getShopProductList,
  getShopProductSkuList,
  getShopProductInfo,
  productCartList,
  productCartAdd,
  productCartUpdate,
  productCartDelete,
  productCartInfo,
  productFavoriteAdd,
  productFavoriteList,
  productFavoriteInfo,
  productFavoriteDelete,
  productReviewAdd,
  walletRuleList,
  shopAdd,
  shopUpdate,
  shopStatisticsInfo
}
