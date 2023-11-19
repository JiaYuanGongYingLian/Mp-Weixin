export { default as userApi } from './modules/user'
export { default as baseApi } from './modules/base'
export { default as productApi } from './modules/product'
export { default as orderApi } from './modules/order'
export { default as couponApi } from './modules/coupon'
export { default as moneyApi } from './modules/money'
export { default as socialApi } from './modules/social'
export { default as enumAll } from './enum'
export const getMockData = (name: any) => {
  return new Promise((resolve, reject) => {
    uni.request({
      method: 'GET',
      url: `./static/json/${name}.json`,
      dataType: 'json',
      success: (res: any) => {
        resolve(res.data)
      },
      fail: (err: any) => {
        reject(err)
      }
    })
  })
}
