import OSS from 'ali-oss'
import crypto from 'crypto-js'
import { generateId } from '@/utils/common'
import { baseApi } from '@/api'
import { Base64 } from 'js-base64';

let client: { put: (arg0: string, arg1: any) => Promise<any> } | null = null
const ENDPOINT = 'https://image.blacksilverscore.com'
export const getAliOss = async () => {
  const {data} = await baseApi.getAliOssToken({id: new Date().getTime() })
  return (client = new OSS({
    accessKeyId: data.accessKeyId, // 阿里云KEY
    accessKeySecret: data.accessKeySecret, // 阿里云KEYSECRET
    bucket: data.bucketName, //OSS bucket
    region: 'oss-cn-shanghai', // bucket 所在地址
    cname: true,
    endpoint: ENDPOINT,
    stsToken: data.securityToken
  }))
}

export const upload = async (options: { file: any; uploadPath: string; onSuccess: (arg0: any) => any; onError: (arg0: string) => any }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await getAliOss()
      const file = options.file || options // 拿到 file
      const id = generateId()
      const temp = file.name ? file.name.split('.') : ''
      const suffixes = file.name ? temp[temp.length - 1] : 'png'
      const fileName = `${id + '.' + suffixes}`
      const path = options.uploadPath || 'uploads/' // 上传文件到OSS的uploads文件夹下
      client.put(path + fileName, file).then((res) => {
        if (res.res.statusCode === 200) {
          options.onSuccess && options.onSuccess(res)
          resolve(res.url)
        } else {
          reject()
        }
      })
    } catch (e) {
      console.log(e)
      options.onError && options.onError('上传失败')
    }
  })
}

// 计算签名。
function computeSignature(accessKeySecret: string | crypto.lib.WordArray, canonicalString: string | crypto.lib.WordArray) {
  return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
}
const date = new Date();
date.setHours(date.getHours() + 1);
const policyText = {
  expiration: date.toISOString(), // 设置policy过期时间。
  conditions: [
    // 限制上传大小。
    ["content-length-range", 0, 1024 * 1024 * 1024],
  ],
};
async function getFormDataParams() {
  const credentials = await baseApi.getAliOssToken({id: new Date().getTime() })
  const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。
  const signature = computeSignature(credentials.accessKeySecret, policy)
  const formData = {
    OSSAccessKeyId: credentials.accessKeyId,
    signature,
    policy,
    'x-oss-security-token': credentials.securityToken 
  }
  return formData
}
// export const wxUpload =async(filePath: any)=> {
//   uni.uploadFile({
//     url: ENDPOINT,
//     filePath: filePath,
//     name: 'file', // 必须填file。
//     formData: {
//       key,
//       policy,
//       OSSAccessKeyId: ossAccessKeyId,
//       signature,
//       // 'x-oss-security-token': securityToken // 使用STS签名时必传。
//     },
//     success: (res) => {
//       if (res.statusCode === 204) {
//         console.log('上传成功');
//       }
//     },
//     fail: err => {
//       console.log(err);
//     }
//   })
// }
