/* eslint-disable no-return-assign */
/* eslint-disable no-unused-expressions */
import OSS from 'ali-oss'
import { generateId } from '@/utils/common'
import { baseApi } from '@/api'

let client: {
  put: (arg0: string, arg1: any) => Promise<any>
  multipartUpload: (arg0: string, arg1: any, arg2: any) => Promise<any>
} | null = null
const ENDPOINT = 'https://eduimage.songzi-it.com/uploads'
export const getAliOss = async () => {
  const { data } = await baseApi.getAliOssToken({ id: new Date().getTime() })
  return (client = new OSS({
    accessKeyId: data.accessKeyId, // 阿里云KEY
    accessKeySecret: data.accessKeySecret, // 阿里云KEYSECRET
    bucket: data.bucketName, // OSS bucket
    region: 'oss-cn-shanghai', // bucket 所在地址
    cname: true,
    endpoint: ENDPOINT,
    stsToken: data.securityToken
  }))
}

export const webUpload = async (options: {
  file: any
  uploadPath: string
  onSuccess: (arg0: any) => any
  onError: (arg0: string) => any
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await getAliOss()
      const file = options.file || options // 拿到 file
      const id = generateId()
      const temp = file.name ? file.name.split('.') : ''
      const suffixes = file.name ? temp[temp.length - 1] : 'png'
      const fileName = `${`${id}.${suffixes}`}`
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

export const webUploadVideo = async (options: {
  file: any
  fileType?: any
  uploadPath?: string
  onSuccess?: (arg0: any) => any
  onError?: (arg0: string) => any
  onProgress?: (arg0: number) => any
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      await getAliOss()
      const file = options.file || options // 拿到 file
      const id = generateId()
      const temp = file.name ? file.name.split('.') : ''
      const suffixes =
        options.fileType ?? file.name ? temp[temp.length - 1] : 'png'
      const fileName = `${`${id}.${suffixes}`}`
      const path = options.uploadPath || 'dynamic/'
      client
        .multipartUpload(path + fileName, file, {
          progress(p: number) {
            // 获取进度条的值
            options.onProgress && options.onProgress(p * 100)
          }
        })
        .then((res) => {
          if (res.res.statusCode === 200) {
            options.onSuccess && options.onSuccess(res)
            resolve(res.name)
          } else {
            reject()
          }
        })
    } catch (e) {
      options.onError && options.onError('上传失败')
    }
  })
}

export const upload = (options: any) => {
  webUpload(options)
}
