export const getPrePage = (index: any) => {
  const pages = getCurrentPages()
  const prePage = pages[pages.length - (index || 2)]
  // #ifdef H5
  return prePage
  // #endif
  return prePage.$vm
};
/**
 * 开发环境全局打印日志
 * @param {Object} title
 */
export const log = (title: object) => {
  if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
    console.log(JSON.stringify(title))
  }
}

/**
 * 拼接图片地址
 * @param {String} suffix
 */
const FILE_URL = 'https://image.blacksilverscore.com/'
export const getImgFullPath = (suffix: string) => {
  if (suffix.includes('http' || 'https')) {
    return suffix
  }
  return FILE_URL + suffix
};

export default {
  getPrePage,
  log,
  getImgFullPath
}
