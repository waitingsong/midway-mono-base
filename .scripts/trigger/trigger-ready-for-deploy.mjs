#!/usr/bin/env zx
/**
 * 从入参提取的服务名称及版本执行 k8s 部
 * @param
 *   --name $pkgImgNameNorm
 *   --ver $pkgVer
 *   --tokens? $CD_Ready_For_Deploy
 *      @example '{ 51: "token1", 57: "token2" }'
 *   --url? $CI_API_V4_URL
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
const str = argv.tokens ?? process.env.CD_Ready_For_Deploy
const tokens = str ? str.trim() : ''
const url = argv.url ?? process.env.CI_API_V4_URL
const refName = argv.ref ?? 'main'

if (! tokens) {
  console.error('Error: Valueof  tokens for pipeline trigger EMPTY!')
  process.exit(1)
}

if (! url || ! refName || ! imgNameNorm || ! ver) {
  console.error('Error: some of parameter for pipeline trigger EMPTY!')
  console.error({ url, refName })
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

$.verbose = false
let deps
try {
   deps = JSON.parse(tokens)
}
catch (ex) {
  console.error('JSON.parse(tokens) got error, may input string invalid')
  process.exit(1)
}
if (! deps || ! Object.keys(deps).length) {
  logMsg = `
Target tokens empty, skip notify deployment
  `
  console.info(logMsg)
  process.exit(0)
}

$.verbose = true
console.info('>>> Do triggering deploy notify pipeline...')
logMsg = `
imgNameNorm: ${imgNameNorm}
ver: ${ver}
`
console.info(logMsg)

Object.entries(deps).forEach(async ([pid, token]) => {
  if (! pid || ! token) {
    console.warn(`pid or token empty, pid: ${pid}`)
    return
  }
  const t2 = token.trim()
  const u2 = url.trim()
  const p1 = imgNameNorm
  const p2 = ver
  const p3 = t2
  const p4 = u2
  const p5 = pid
  const p6 = refName

  $.verbose = false
  const ret = await nothrow($`$cwd/.scripts/trigger/trigger-ready-for-k8s-deploy.mjs \
   --name=${p1} --ver=${p2} --token=${p3} --url=${p4} --pid=${p5} --ref=${p6} `)
  $.verbose = true

  if (! ret) {
    throw new Error('result type undefined')
  }

  const { stdout, stderr, exitCode } = ret
  if (ret.exitCode === 0 && typeof stdout === 'string' && stdout) {
    console.info(stdout)
  }
  else {
    console.error({
      stderr,
      exitCode,
    })
  }

})
