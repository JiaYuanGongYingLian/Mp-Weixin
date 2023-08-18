/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-08-08 17:32:28
 * @LastEditTime: 2023-08-18 18:50:41
 * @LastEditors:  Please set LastEditors
 */

export default {
  categoryName: [
    {
      required: false,
      message: '请选择行业',
      // 可以单个或者同时写两个触发验证方式
      trigger: ['change', 'blur']
    }
  ],
  name: [
    {
      required: false,
      message: '请填写名称',
      trigger: ['change', 'blur']
    }
  ],
  addressName: [
    {
      required: false,
      message: '请选择地址',
      trigger: ['change', 'blur']
    }
  ],
  avatar: {
    required: false,
    message: '请上传头像',
    trigger: ['change', 'blur']
  },
  license: {
    required: false,
    message: '请上传营业执照',
    trigger: ['change', 'blur']
  },
  bannerResources: {
    required: false,
    message: '请上传店铺展示图',
    trigger: ['change', 'blur']
  },
  remark: [
    {
      required: false,
      message: '请填写提供的服务',
      trigger: ['change', 'blur']
    }
  ]
}
