#!/usr/bin/env zx
/**
 * 从入参提取的服务名称及版本执行 k8s 部
 * @param
 *   --name $pkgImgNameNorm
 *   --ver $pkgVer
 *   --token? $CD_Ready_For_K8s_Deploy
 *   --url? $CI_API_V4_URL
 *   --pid? project id of deploy default: $CD_Ready_For_K8s_PID
 *   --ref=main target branch
 */

// console.info(argv)
const baseDir = process.env.cwd
const CI_PROJECT_URL = process.env.CI_PROJECT_URL
const CI_DEFAULT_BRANCH = process.env.CI_DEFAULT_BRANCH
const CI_COMMIT_BRANCH = process.env.CI_COMMIT_BRANCH
const CI_COMMIT_TAG = process.env.CI_COMMIT_TAG

let logMsg = ''


const imgNameNorm = argv.name
const ver = argv.ver
const token = argv.token ?? process.env.CD_Ready_For_K8s_Deploy
const url = argv.url ?? process.env.CI_API_V4_URL
const pid = argv.pid ?? process.env.CD_Ready_For_K8s_PID
const refName = argv.ref ?? 'main'

if (! token) {
  console.error('Error: token EMPTY!')
  process.exit(1)
}

if (! url || ! pid || ! refName) {
  console.error('Error: some of parameter for pipeline trigger EMPTY!')
  console.error({ url, pid, refName })
  process.exit(1)
}

if (! imgNameNorm) {
  logMsg = `
Parameter name for pipeline trigger EMPTY!"
Format: scope_foo_bar-svc"
  `
  console.error(logMsg)
  process.exit(1)
}

if (! ver || ! /^\d+(\.\d+){2}/u.test(ver)) {
  logMsg = `
Parameter ver for pipeline trigger EMPTY!
Format: 1.2.3
  `
  console.error(logMsg)
  process.exit(1)
}

// console.info('>>> Do triggering deploy notify pipeline...')
// logMsg = `
// imgNameNorm: ${imgNameNorm}
// ver: ${ver}
// `
// console.info(logMsg)

const postUrl = `${url}/projects/${pid}/trigger/pipeline`
$.verbose = false
process.env.p1 = token
process.env.p2 = refName
process.env.p3 = imgNameNorm
process.env.p4 = ver
process.env.p5 = postUrl
const ret = await $`curl -X POST -s \
  -F token=$p1 \
  -F "ref=$p2" \
  -F "variables[CD_pkgImgNameNorm]=$p3" \
  -F "variables[CD_pkgVer]=$p4" \
  $p5
`
process.env.p1 = ''
$.verbose = true
// console.info(ret)

if (! ret) {
  throw new Error('result type undefined')
}

const { stdout, stderr, exitCode } = ret
if (ret.exitCode === 0 && typeof stdout === 'string' && stdout) {
  const { id, sha, ref, status, created_at, web_url, error, message } = JSON.parse(stdout)
  if (id) {
    console.info({
      pid,
      id, sha, ref, status, created_at, web_url,
    })
  }
  else {
    console.info({
      pid,
      token: `${token.slice(0, 2)}..${token.slice(-2)}`,
      error,
      message,
    })
  }
}
else {
  console.error({
    stderr,
    exitCode,
  })
  process.exit(1)
}

