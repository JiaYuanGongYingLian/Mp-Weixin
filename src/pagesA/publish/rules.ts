/*
 * @Description: Description
 * @Author: Kerwin
 * @Date: 2023-08-08 17:32:28
 * @LastEditTime: 2023-08-08 17:32:28
 * @LastEditors:  Please set LastEditors
 */

export default {
  categoryName: [
    {
      required: true,
      message: '请选择行业',
      // 可以单个或者同时写两个触发验证方式
      trigger: ['change', 'blur']
    }
  ],
  name: [
    {
      required: true,
      message: '请填写商家名称',
      trigger: ['change', 'blur']
    }
  ],
  addressName: [
    {
      required: true,
      message: '请选择地址',
      trigger: ['change', 'blur']
    }
  ],
  avatar: {
    required: true,
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
      required: true,
      message: '请填写商家简介',
      trigger: ['change', 'blur']
    },
    {
      min: 5,
      message: '简介不能少于5个字',
      trigger: 'change'
    }
  ]
}
