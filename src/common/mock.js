/*
 * @Description: 模拟数据
 * @Author: Kerwin
 * @Date: 2023-07-22 03:39:37
 * @LastEditTime: 2023-09-09 17:19:48
 * @LastEditors:  Please set LastEditors
 */

export const m_productList = [
  {
    moduleStr: '/api/v1/shop/product',
    id: 2208,
    productId: 100003040,
    categoryId: 400000,
    name: '【合伙人特权】手机管控系统希贤可儿体验卡9.9元*1000张',
    image: 'uploads/eb64af41-8814-46dd-8c8c-cd8ec14298c3.png',
    money: 1980,
    originalMoney: 9900,
    limitBeginTime: 1684771200,
    limitEndTime: 1688140799,
    supplierId: 1106,
    shopId: 1208,
    publishStatus: 1,
    dynamicPrice: false,
    couponSku: false,
    taskerSku: false,
    shopName: 'e起成长 学生手机防沉迷整体解决方案',
    shopCategoryId: 400023,
    shopType: 3,
    sortId: 1,
    remark:
      '【合伙人特权】手机管控系统希贤可儿体验卡9.9元*1000张，赠送【合伙人】名额一个',
    createTime: 1684810123,
    updateTime: 1689316854,
    shop: {
      moduleStr: '/api/v1/shop',
      id: 1208,
      userId: 500440,
      addressId: 959,
      code: 'T692Y1',
      latitude: 30.658215,
      longitude: 104.054518,
      categoryId: 400023,
      name: 'e起成长 学生手机防沉迷整体解决方案',
      avatar: 'shop/-1642890654.jpg',
      license: 'shop/1605497742.jpg',
      shopType: 3,
      sort: 1000,
      status: 20,
      supportDynamicPrice: true,
      supportLotteryUserCoupon: false,
      supportTasker: false,
      moneyRuleId: 220,
      remark:
        'e起成长 学生手机防沉迷整体解决方案————让每一个学生都能绽放自己！',
      createTime: 1684074364,
      updateTime: 1684074364
    },
    bannerResources: [
      {
        moduleStr: '/api/v1/resource',
        id: 76454,
        type: 1,
        length: 0,
        height: 2131,
        width: 2834,
        resourceUrl: 'uploads/8f8a2914-2ac3-4d34-8780-271f8075e75f.png',
        objectType: 1,
        objectId: 100003040,
        objectFunctionType: 1,
        createTime: 1684810123,
        updateTime: 1684810123
      }
    ],
    resources: [],
    shopProductSkus: [
      {
        moduleStr: '/api/v1/shop/product/sku',
        id: 69358,
        tradeType: 1,
        shopId: 1208,
        productId: 100003040,
        productSkuId: 11193,
        name: '手机管控系统希贤可儿体验卡9.9元*1000张，赠送【合伙人】名额一个',
        money: 1980,
        originalMoney: 9900,
        moneyOrderStatus: 20,
        dynamicPrice: false,
        couponSku: false,
        taskerSku: false,
        saleCount: 4,
        count: 9999,
        productSkuCountShared: true,
        publishStatus: 1,
        invoiceSupport: false,
        invoiceTypeSupport: 0,
        invoiceContentSupport: '',
        limitBeginTime: 1684771200,
        limitEndTime: 1688140799,
        sortId: 1,
        createTime: 1684810241,
        updateTime: 1689316860,
        productSku: {
          moduleStr: '/api/v1/product/sku',
          id: 11193,
          productId: 100003040,
          name: '手机管控系统希贤可儿体验卡9.9元*1000张，赠送【合伙人】名额一个',
          image: 'uploads/c09a4f0c-ae5e-4b06-977c-1c39ea0445a7.png',
          money: 1980,
          count: 999995,
          publishStatus: 1,
          status: 0,
          sort: 1000,
          createTime: 1684810240,
          updateTime: 1689313352
        },
        shopProductSkuContents: [
          {
            moduleStr: '/api/v1/shop/product/sku/content',
            id: 76,
            shopProductSkuId: 69358,
            content: '希贤可儿体验卡9.9元*1000张，赠送【合伙人】名额一个',
            count: 1,
            money: 1980,
            createTime: 1684814938,
            updateTime: 1684814938
          }
        ],
        product: {
          moduleStr: '/api/v1/product',
          id: 100003040,
          categoryId: 400000,
          name: '【合伙人特权】手机管控系统希贤可儿体验卡9.9元*1000张',
          image: 'uploads/eb64af41-8814-46dd-8c8c-cd8ec14298c3.png',
          money: 1980,
          supplierId: 1106,
          sortId: 1,
          remark:
            '【合伙人特权】手机管控系统希贤可儿体验卡9.9元*1000张，赠送【合伙人】名额一个',
          createTime: 1684810123,
          updateTime: 1689316854,
          productSkus: [
            {
              moduleStr: '/api/v1/product/sku',
              id: 11193,
              productId: 100003040,
              name: '手机管控系统希贤可儿体验卡9.9元*1000张，赠送【合伙人】名额一个',
              image: 'uploads/c09a4f0c-ae5e-4b06-977c-1c39ea0445a7.png',
              money: 1980,
              count: 999995,
              publishStatus: 1,
              status: 0,
              sort: 1000,
              createTime: 1684810240,
              updateTime: 1689313352
            }
          ],
          supplier: {
            moduleStr: '/api/v1/supplier',
            id: 1106,
            userId: 500440,
            objectType: 13,
            objectId: 1208,
            addressId: 959,
            name: 'e起成长 学生手机防沉迷整体解决方案',
            avatar: 'shop/-1642890654.jpg',
            license: 'shop/1605497742.jpg',
            sort: 1000,
            status: 20,
            remark:
              'e起成长 学生手机防沉迷整体解决方案————让每一个学生都能绽放自己！',
            createTime: 1684117020,
            updateTime: 1684117020
          },
          productAttributes: [
            {
              moduleStr: '/api/v1/product/attribute',
              id: 4608,
              productId: 100003040,
              productAttributeTypeId: 7,
              name: '功能',
              createTime: 1684810123,
              updateTime: 1684810123
            }
          ]
        }
      }
    ],
    category: {
      moduleStr: '/api/v1/category',
      id: 400000,
      parentId: 0,
      name: '教育培训',
      sort: 520,
      type: 1,
      createTime: 1679901512,
      updateTime: 1680843339
    }
  }
]

export const m_fcate = [
  {
    name: '董事长'
  },
  {
    name: '创始人'
  },
  {
    name: '总经理'
  },
  {
    name: '个体户'
  }
]

export const base64 =
  'data:image/jpeg;base64,PCFET0NUWVBFIGh0bWw+DQo8aHRtbCBsYW5nPSJlbiI+DQoNCjxoZWFkPgogIDxzY3JpcHQ+aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAndW5kZWZpbmVkJykgewogIHdpbmRvdy5nbG9iYWxUaGlzID0gd2luZG93Cn08L3NjcmlwdD4KCiAgPHNjcmlwdCB0eXBlPSJtb2R1bGUiIHNyYz0iL0B2aXRlL2NsaWVudCI+PC9zY3JpcHQ+Cg0KICA8bWV0YSBjaGFyc2V0PSJVVEYtOCIgLz4NCiAgPG1ldGEgbmFtZT0iYXBwbGUtbW9iaWxlLXdlYi1hcHAtY2FwYWJsZSIgY29udGVudD0ieWVzIj4NCiAgPG1ldGEgbmFtZT0ieDUtZnVsbHNjcmVlbiIgY29udGVudD0idHJ1ZSI+DQogIDxtZXRhIG5hbWU9ImZ1bGwtc2NyZWVuIiBjb250ZW50PSJ5ZXMiPg0KICA8c2NyaXB0Pg0KICAgIHZhciBjb3ZlclN1cHBvcnQgPSAnQ1NTJyBpbiB3aW5kb3cgJiYgdHlwZW9mIENTUy5zdXBwb3J0cyA9PT0gJ2Z1bmN0aW9uJyAmJiAoQ1NTLnN1cHBvcnRzKCd0b3A6IGVudihhKScpIHx8DQogICAgICBDU1Muc3VwcG9ydHMoJ3RvcDogY29uc3RhbnQoYSknKSkNCiAgICBkb2N1bWVudC53cml0ZSgNCiAgICAgICc8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCB1c2VyLXNjYWxhYmxlPW5vLCBpbml0aWFsLXNjYWxlPTEuMCwgbWF4aW11bS1zY2FsZT0xLjAsIG1pbmltdW0tc2NhbGU9MS4wJyArDQogICAgICAoY292ZXJTdXBwb3J0ID8gJywgdmlld3BvcnQtZml0PWNvdmVyJyA6ICcnKSArICciIC8+JykNCiAgPC9zY3JpcHQ+DQogIDxzY3JpcHQgc3JjPSJodHRwczovL3Jlcy53eC5xcS5jb20vb3Blbi9qcy9qd2VpeGluLTEuNi4wLmpzIj48L3NjcmlwdD4NCiAgPCEtLSBqbWVzc2FnZS1zZGstd2ViLjIuNi4wLm1pbi5qcyAtLT4NCiAgPHNjcmlwdCBzcmM9Imh0dHBzOi8vaW1hZ2UuYmxhY2tzaWx2ZXJzY29yZS5jb20vQXBwLzUzZDFmYTNkLWNjNDktNDZjNS04YmVjLTA0MGZkZTU4NmM5Yy5qcyI+PC9zY3JpcHQ+DQogIDwhLS0gam1lc3NhZ2Utd3hhcHBsZXQtc2RrLTEuNC4zLm1pbi5qcyAtLT4NCiAgPCEtLSA8c2NyaXB0IHNyYz0iaHR0cHM6Ly9pbWFnZS5ibGFja3NpbHZlcnNjb3JlLmNvbS9BcHAvZWJjNTkyYWYtOWU0ZC00ZGViLTgwMTQtMjVkOTk1NjhjODkzLmpzIj48L3NjcmlwdD4gLS0+DQogIDxzY3JpcHQgc3JjPSJodHRwczovL2d3LmFsaXBheW9iamVjdHMuY29tL2FzL2cvaDUtbGliL2FsaXBheWpzYXBpLzMuMS4xL2FsaXBheWpzYXBpLmluYy5taW4uanMiPjwvc2NyaXB0Pg0KICA8c2NyaXB0IHNyYz0iaHR0cHM6Ly9jZG4uYm9vdGNzcy5jb20vZXJ1ZGEvMS40LjMvZXJ1ZGEubWluLmpzIj48L3NjcmlwdD4NCiAgPHNjcmlwdD4NCiAgICAvLyBlcnVkYS5pbml0KCk7DQogIDwvc2NyaXB0Pg0KICA8dGl0bGU+6buR6ZO255Sf5rS7PC90aXRsZT4NCiAgPCEtLXByZWxvYWQtbGlua3MtLT4NCiAgPCEtLWFwcC1jb250ZXh0LS0+DQo8L2hlYWQ+DQoNCjxib2R5Pg0KICA8ZGl2IGlkPSJhcHAiPg0KICAgIDwhLS1hcHAtaHRtbC0tPg0KICA8L2Rpdj4NCiAgPHNjcmlwdCB0eXBlPSJtb2R1bGUiIHNyYz0iL3NyYy9tYWluLnRzP3Q9MTY5NDI1MDc2MzA1MyI+PC9zY3JpcHQ+DQo8L2JvZHk+DQoNCjwvaHRtbD4='
