import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { NpmLogLevel } from './ci-types.mjs'


export const USER_HOME = process.env.HOME ?? ''

const __dirname = genCurrentDirname(import.meta.url)
export const CI_PROJECT_DIR = process.env.CI_PROJECT_DIR ?? ''
export const baseDir = CI_PROJECT_DIR ? CI_PROJECT_DIR : join(__dirname, '../')
export const CI_BUILDS_DIR = process.env.CI_BUILDS_DIR ?? '/build'
export const BUILD_TMP_DIR = process.env.BUILD_TMP_DIR ?? '/tmp/build'
export const BUNDLE_NAME = process.env.BUNDLE_NAME ?? 'bundle'

const _pkgInfo = await import(`${baseDir}/package.json`, {
  assert: { type: 'json' },
}) as Record<string, unknown>
export const pkgInfo = (_pkgInfo.default ?? _pkgInfo) as Record<string, unknown>

export const CI_DEFAULT_BRANCH = process.env.CI_DEFAULT_BRANCH ?? 'main'
export const CI_API_V4_URL = process.env.CI_API_V4_URL ?? ''
/**
 * @example gitlab.example.com
 */
export const CI_SERVER_HOST = process.env.CI_SERVER_HOST ?? ''
export const CI_SERVER_PORT = process.env.CI_SERVER_PORT ?? ''
export const CI_PROJECT_PATH = process.env.CI_PROJECT_PATH ?? ''
export const serverDomain = CI_SERVER_HOST.split('.').slice(1).join('.')
export const CI_SERVER_PROTOCOL = process.env.CI_SERVER_PROTOCOL ?? 'https'
/**
 * @example https://gitlab.example.com:8080
 */
export const CI_SERVER_URL = process.env.CI_SERVER_URL ?? ''
export const CI_USER_LOGIN = process.env.GITLAB_USER_LOGIN ?? ''
export const GITLAB_USER_NAME = process.env.GITLAB_USER_NAME ?? ''
export const GITLAB_USER_EMAIL = process.env.GITLAB_USER_EMAIL ?? ''

export const CI_PROJECT_NAME = process.env.CI_PROJECT_NAME ?? ''
export const CI_PROJECT_URL = process.env.CI_PROJECT_URL ?? 'https://'
export const CI_PROJECT_ID = process.env.CI_PROJECT_ID ? +process.env.CI_PROJECT_ID : 0
export const CI_PIPELINE_URL = process.env.CI_PIPELINE_URL ?? 'https://'
export const CI_PIPELINE_ID = process.env.CI_PIPELINE_ID ?? ''
export const CI_JOB_ID = process.env.CI_JOB_ID ?? ''
export const CI_JOB_URL = process.env.CI_JOB_URL ?? 'https://'
export const CI_JOB_NAME = process.env.CI_JOB_NAME ?? ''

/**
 * 包含完整的引用名称，如 refs/heads/branch-name
 */
export const CI_COMMIT_REF_NAME = process.env.CI_COMMIT_REF_NAME ?? ''
export const CI_COMMIT_REF_SLUG = process.env.CI_COMMIT_REF_SLUG ?? ''
/**
 * 只包含分支名称部分，如 branch-name
 */
export const CI_COMMIT_BRANCH = process.env.CI_COMMIT_BRANCH ?? ''
export const CI_COMMIT_DESCRIPTION = process.env.CI_COMMIT_DESCRIPTION ?? ''
export const CI_COMMIT_MESSAGE = process.env.CI_COMMIT_MESSAGE ?? 'n/a'
export const CI_COMMIT_SHA = process.env.CI_COMMIT_SHA ?? ''
export const CI_COMMIT_SHORT_SHA = process.env.CI_COMMIT_SHORT_SHA ?? ''
export const CI_COMMIT_TAG = process.env.CI_COMMIT_TAG ?? ''
export const CI_COMMIT_TIMESTAMP = process.env.CI_COMMIT_TIMESTAMP ?? ''
export const CI_COMMIT_TITLE = process.env.CI_COMMIT_TITLE ?? 'n/a'

export const PARENT_COMMIT_TAG = process.env.PARENT_COMMIT_TAG ?? ''

const CI_CONCURRENT_PROJECT_ID = process.env.CI_CONCURRENT_PROJECT_ID ?? '0000'
const CI_JOB_STARTED_AT = process.env.CI_JOB_STARTED_AT ?? ''

const debugArr: string[] = [ 'true', '1', 'yes', 'y', 'on' ]

export const BUILD_DEBUG = process.env.BUILD_DEBUG && debugArr.includes(process.env.BUILD_DEBUG) ? true : false
export const PUBLISH_DEBUG = process.env.PUBLISH_DEBUG && debugArr.includes(process.env.PUBLISH_DEBUG) ? true : false
export const DEPLOY_DEBUG = process.env.DEPLOY_DEBUG && debugArr.includes(process.env.DEPLOY_DEBUG) ? true : false
export const NOTIFY_DEBUG = process.env.NOTIFY_DEBUG && debugArr.includes(process.env.NOTIFY_DEBUG) ? true : false

export enum CIConfigTypeList {
  android = 'android',
  flutter = 'flutter',
  ios = 'ios',
  NA = 'n/a',
}
export const CIConfigType: CIConfigTypeList = process.env.CIConfigType as CIConfigTypeList | undefined ?? CIConfigTypeList.NA

const date = CI_JOB_STARTED_AT
  .replace(/:/ug, '')
  .replace('T', '.')


const randomDirName = `${date}-${CI_PIPELINE_ID}-${CI_JOB_ID}-${CI_CONCURRENT_PROJECT_ID}`
export const workPath = `${BUILD_TMP_DIR}/${randomDirName}`

export enum TargetKey {
  debug = 'debug',
  dev = 'dev',
  test = 'test',
  gray = 'gray',
  rc = 'rc',
  ga = 'ga',
  prod = 'prod',
  default = 'default',
}

export const targetMap = new Map([
  [TargetKey.debug, 'Debug'], // 调试
  [TargetKey.dev, 'Release'], // 开发
  [TargetKey.test, 'Release'], // 测试 ad-hoc
  [TargetKey.gray, 'Release'], // 灰度 ad-hoc
  [TargetKey.rc, 'Release'], // prod ad-hoc
  [TargetKey.ga, 'Release'], // prod app-store
])
export const targetNameMap = new Map([
  [TargetKey.debug, '调试版'],
  [TargetKey.dev, '开发版'],
  [TargetKey.test, '内测版'],
  [TargetKey.gray, '灰度版'],
  [TargetKey.rc, '候选版'],
  [TargetKey.ga, '正式版'],
])

export const hostTypeNameMap = new Map([
  [TargetKey.debug, '调试服务器'],
  [TargetKey.dev, '开发服务器'],
  [TargetKey.test, '内测服务器'],
  [TargetKey.gray, '灰度服务器'],
  [TargetKey.prod, '生产服务器'],
  [TargetKey.ga, '生产服务器'],
])



/** 主机配置文件相对路径 */
export const deployConfigFile = process.env.deployConfigFile ?? './config/deploy.config.ts'

const hostsConfigVarId = process.env.deployHostsConfigVarId ?? 'deployHostsConfig'
const sitesDeletionConfigVarId = process.env.deploySitesDeletionConfigVarId ?? 'sitesDeletionConfig'
const siteBaseDirVarId = process.env.deploySiteBaseDirVarId ?? 'siteBaseDir'
const siteNamePrefixVarId = process.env.deploySiteNamePrefixVarId ?? 'siteNamePrefix'
const siteDomainsVarId = process.env.deploySiteDomainsVarId ?? 'siteDomains'
const hostsSLBConfigVarId = process.env.deploySLBConfigVarId ?? 'hostsSLBConfig'
const remoteConfigDirVarId = process.env.deployRemoteConfigDirVarId ?? 'remoteConfigDir'
const hostRecordVarId = process.env.deployHostRecordVarId ?? 'hostRecord'
const operationHostsVarId = process.env.deployOperationHostsVarId ?? 'operationHosts'

export const deployConfigVars = {
  /** 主机配置变量名 */
  hostsConfigVarId,
  /** 站点删除配置变量名 */
  sitesDeletionConfigVarId,
  /** 站点基础目录变量名 */
  siteBaseDirVarId,
  /** 站点名称前缀变量名 */
  siteNamePrefixVarId,
  /** 站点域名变量名 */
  siteDomainsVarId,
  /** 负载均衡配置变量名 */
  hostsSLBConfigVarId,
  /**
   * 指定目标服务器配置文件目录
   * 部署时将会自动拷贝到目标服务器站点根目录
   */
  remoteConfigDirVarId,
  /** 主机配置列表 */
  hostRecordVarId,
  /** 部署操作目标主机列表，从 hostRecordVarId 从获取 ip 数组 */
  operationHostsVarId,
}

export const aliAId = process.env.ALI_AID ?? ''
export const aliASecret = process.env.ALI_ASECRET ?? ''


/**
 * generate __filename for ESM
 * @param inputUrl import.meta.url
 */
export function genCurrentFilename(inputUrl: string): string {
  return fileURLToPath(inputUrl).replace(/\\/ug, '/')
}
/**
 * generate __dirname for ESM
 * @param inputUrl import.meta.url
 */
export function genCurrentDirname(inputUrl: string): string {
  const __filename = genCurrentFilename(inputUrl)
  const dir = join(__filename, '..').replace(/\\/ug, '/')
  return dir
}


export const VERSIONING_BRANCH_PREFIX = process.env.VERSIONING_BRANCH_PREFIX ?? 'versioning_'
export const PUBLISH_TOKEN = process.env.PUBLISH_TOKEN ?? ''
const npmLogLevel = process.env.NPM_LOG_LEVEL as NpmLogLevel | undefined
export const NPM_LOG_LEVEL = npmLogLevel && Object.values(NpmLogLevel).includes(npmLogLevel)
  ? npmLogLevel
  : NpmLogLevel.notice
export const LOG_LEVEL = process.env.LOG_LEVEL ?? 'error'

/**
 * npm registry for versioning
 * @example
 * - https://registry.npmjs.org/
 * - https://nexus.foo.com/repository/mynpm/
 */
export const NPM_VERSION_REGISTRY = process.env.NPM_VERSION_REGISTRY ?? ''
/**
 * npm repository token for publish
 */
export const NPM_VERSION_TOKEN = process.env.NPM_VERSION_TOKEN ?? ''
/**
 * npm registry for install dependencies
 * @example
 * - https://registry.npmmirror.com/
 * - https://registry.npmjs.org/
 * - https://nexus.foo.com/repository/mynpm/
 * @default https://registry.npmmirror.com/
 */
export const NPM_REGISTRY = process.env.NPM_REGISTRY ?? 'https://registry.npmmirror.com/'

/**
 * publish release repo gitlab or github
 * @default gitlab
 */
export const PUBLISH_RELEASE_REPO = process.env.PUBLISH_RELEASE_REPO ?? 'gitlab'
/**
 * github publish token
 */
export const GH_TOKEN = process.env.GH_TOKEN ?? ''
/**
 * gitlab publish token
 */
export const GL_TOKEN = process.env.GL_TOKEN ?? ''

/**
 * @example https://gitlab.com/api/v4
 */
export const GL_API_URL= process.env.GL_API_URL ?? CI_API_V4_URL


