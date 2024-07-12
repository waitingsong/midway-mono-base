import type { AliOssConfig } from '@mwcp/ali-oss'

import type { OssClientKey } from './alioss.types.js'


export const clientConfig = {
  accessKeyId: process.env['ALI_OSS_AID'] ?? '',
  accessKeySecret: process.env['ALI_OSS_ASECRET'] ?? '',
  endpoint: process.env['ALI_OSS_ENDPOINT'] ?? 'https://oss-cn-hangzhou.aliyuncs.com',
  bucket: process.env['ALI_OSS_BUCKET'] ?? '',
}
export const aliOssConfig: AliOssConfig<OssClientKey> = {
  dataSource: {
    ossMain: clientConfig,
  },
}

