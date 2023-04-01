export const getPrePage = (index: any) => {
  const pages = getCurrentPages();
  const prePage = pages[pages.length - (index || 2)];
  // #ifdef H5
  return prePage;
  // #endif
  return prePage.$vm;
};
/**
 * 开发环境全局打印日志
 * @param {Object} title
 */
export const log = (title: object) => {
  if (process.env.NODE_ENV === 'development' && Boolean(title) === true) {
    console.log(JSON.stringify(title));
  }
};

/**
 * 拼接图片地址
 * @param {String} suffix
 */
const FILE_URL = 'https://image.blacksilverscore.com/';
export const getImgFullPath = (suffix: string) => {
  if (!suffix) return;
  if (suffix.includes('http' || 'https')) {
    return suffix;
  }
  return FILE_URL + suffix;
};

// 计算距离的方法实现
function rad(d) {
  return (d * Math.PI) / 180.0;
}

// 根据经纬度计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
export function getDistances(lat1: any, lng1: any, lat2: any, lng2: any) {
  const radLat1 = rad(lat1);
  const radLat2 = rad(lat2);
  const a = radLat1 - radLat2;
  const b = rad(lng1) - rad(lng2);
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin(a / 2) ** 2 +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(b / 2) ** 2
      )
    );
  s *= 6378.137; // EARTH_RADIUS;
  // 输出为公里
  s = Math.round(s * 10000) / 10000;

  const distance = s;
  let distance_str = '';

  if (parseInt(distance, 10) >= 1) {
    // distance_str = distance.toFixed(1) + "km";
    distance_str = `${distance.toFixed(2)} km`;
  } else {
    // distance_str = distance * 1000 + "m";
    distance_str = `${(distance * 1000).toFixed(2)} m`;
  }
  // s=s.toFixed(4);
  // console.info('距离是', s);
  // console.info('距离是', distance_str);
  // return s;
  const objData = {
    distance,
    distance_str
  };
  return objData;
}

export function handleMapLocation(shop: {
  latitude: any;
  longitude: any;
  addr: any;
}) {
  const { latitude, longitude, addr } = shop;
  console.log('进入导航');
  // 获取定位信息
  uni.getLocation({
    type: 'wgs84',
    success(res) {
      if (res.errMsg == 'getLocation:ok') {
        console.log(latitude);
        console.log(longitude);
        uni.openLocation({
          // 传入你要去的纬度
          latitude,
          // 传入你要去的经度
          longitude,
          // 传入你要去的地址信息 不填则为空
          address: addr,
          // 缩放大小
          scale: 18,
          success() {
            console.log('成功的回调success');
          }
        });
      }
    },
    fail(res) {
      console.log(res);
      if (res.errMsg == 'getLocation:fail auth deny') {
        uni.showModal({
          content: '检测到您没打开获取信息功能权限，是否去设置打开？',
          confirmText: '确认',
          cancelText: '取消',
          success: (res) => {
            if (res.confirm) {
              uni.openSetting({
                success: (res) => {
                  console.log('确定');
                }
              });
            } else {
              console.log('取消');
              return false;
            }
          }
        });
      }
    }
  });
}

// 预览图片
export function previewImage(pics: any, current?: any) {
  if (!pics) return;
  uni.previewImage({
    urls: pics,
    current,
    indicator: 'default'
  });
}

export default {
  getPrePage,
  log,
  getImgFullPath,
  getDistances,
  previewImage
};
