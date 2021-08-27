#!/usr/bin/env zx
/**
 * pipeline trigger to pack app
 * @param
 *   --token $GL_TOKEN
 *   --url $CI_API_V4_URL
 *   --pid project id of deploy
 *   --ref v$tagVer
 */


// console.info(argv)
const baseDir = process.env.cwd
const token = argv.token
const url= argv.url
const pid = argv.pid
const ref = argv.ref

console.info(`>>> Do triggering pack pipeline...`)

if (! token) {
  console.error('Value of param token empty')
  process.exit(1)
}
else if (! url) {
  console.error('Value of param url empty')
  process.exit(1)
}
else if (! pid) {
  console.error('Value of param pid empty')
  process.exit(1)
}
else if (! ref) {
  console.error('Value of param ref empty')
  process.exit(1)
}

const turl = `${url}/projects/${pid}/trigger/pipeline`

$.verbose = false
process.env.p1 = token
process.env.p2 = ref
process.env.p3 = turl
const ret = await $`curl -X POST -s \
  -F token=$p1 \
  -F "ref=$p2" \
  -F "variables[CI_PUBLISH_COMPLETED]=true" \
  $p3
`
process.env.p1 = ''
$.verbose = true

if (! ret) {
  throw new Error('result type undefined')
}

const { stdout, stderr, exitCode } = ret
if (ret.exitCode === 0 && typeof stdout === 'string' && stdout) {
  const { id, sha, ref, status, created_at, web_url, error } = JSON.parse(stdout)
  console.info({
    id, sha, ref, status, created_at, web_url,
    error,
  })
}
else {
  console.error({
    stderr,
    exitCode,
  })
  process.exit(1)
}

