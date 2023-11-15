const install = (Vue, vm) => {
  // 此为自定义配置参数，具体参数见上方说明
  Vue.prototype.$u.http.setConfig({
    baseUrl: vm.api_url,
    loadingText: '努力加载中~',
    loadingTime: 800,
    originalData: true
  })

  // 请求拦截，配置Token等参数
  Vue.prototype.$u.http.interceptor.request = (config) => {
    if (config.url == 'api/user/mobilelogin' || config.url == 'api/sms/send') {
      config.header.noToken = true
    } else {
      config.header.token = vm.userinfo.token
    }
    return config
  }

  // 响应拦截，判断状态码是否通过
  Vue.prototype.$u.http.interceptor.response = (res) => {
    // return res;
    if (res.statusCode == 200) {
      return res.data
    }
    if (res.statusCode == 401) {
      // vm.$u.toast('验证失败，请重新登录');
      // setTimeout(() => {
      // 	// 此为uView的方法，详见路由相关文档
      // 	vm.$u.route('/pages/public/login/login')
      // }, 1500)
      return res.data
    }
    // 如果返回false，则会调用Promise的reject回调，
    // 并将进入this.$u.post(url).then().catch(res=>{})的catch回调中，res为服务端的返回值
    return false
  }
}

export default {
  install
}
