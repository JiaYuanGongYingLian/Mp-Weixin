const install = (Vue, vm) => {
  const getLogincode = (params = {}) => vm.$u.post('api/sms/send', params)

  const mobilelogin = (params = {}) =>
    vm.$u.post('api/user/mobilelogin', params)

  const getLoginStatus = (params = {}) => vm.$u.post('api/user/index')

  const getUserinfo = (params = {}) =>
    vm.$u.post('api/user/getuserinfo', params)

  const getfriends = (params = {}) => vm.$u.post('api/user/getfriends', params)

  const addfriends = (params = {}) => vm.$u.post('api/user/addfriends', params)

  const getfriendlist = (params = {}) => vm.$u.post('api/user/getfriendlist')

  const acceptfriend = (params = {}) =>
    vm.$u.post('api/user/acceptfriend', params)

  const sendHB = (params = {}) => vm.$u.post('api/user/HBCreate', params)

  const openHB = (params = {}) => vm.$u.post('api/user/HBOpen', params)

  const openisHB = (params = {}) => vm.$u.post('api/user/HBIsOpen', params)

  const infoHB = (params = {}) => vm.$u.post('api/user/HBInfo', params)

  const getGrouplist = (params = {}) => vm.$u.post('api/user/queryGroup')
  // 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
  vm.$u.api = {
    getLogincode,
    mobilelogin,
    getLoginStatus,
    getUserinfo,
    getfriends,
    addfriends,
    getfriendlist,
    acceptfriend,
    sendHB,
    openHB,
    openisHB,
    infoHB,
    getGrouplist
  }
}

export default {
  install
}
