#!/usr/bin/env tsx
/**
 * for scripts.prepublishOnly of top package.json
 * use only of top
 * @param {string} registry
 * @param {string} token - base64 encoded
 *
 */
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { b64decode } from '@waiting/base64'
import { $ } from 'zx'

import {
  NPM_VERSION_TOKEN,
  NPM_VERSION_REGISTRY,
 } from '../ci-consts.mjs'

$.verbose = true
await $`date`

const argv = retrieveArgsFromProcess()

const registry: string = argv.registry ?? NPM_VERSION_REGISTRY ?? ''
const token: string = argv.token ?? NPM_VERSION_TOKEN
const check = typeof argv.check === 'undefined' ? false : true
const debug = argv.debug === 'true' ? true : false

assert(registry, 'registry not set, example: "https://nexus.foo.com/repository/mynpm/"')
const tokenErrorMsg =  'npm token invalid, example: "NpmToken.00000000-0000-0000-0000-000000000000" before base64 encoded'
assert(token, tokenErrorMsg)

let msg = ` `

msg = '>>> Writing npm auth token...'
console.info(msg)

$.verbose = debug
await $`npm config set registry ${registry}`

let scope = registry.replace('https://', '').replace('http://', '')
if (! scope.endsWith('/')) {
  scope += '/'
}
const key = `//${scope}:_authToken`
const value = b64decode(token).trim()
assert(value, tokenErrorMsg)

try {
  // await $`echo ${NPM_VERSION_TOKEN} | base64 -d`
  await $`npm config set ${key} ${value}`
  if (check) {
    $.verbose = true
    await $`npm ping`
    await $`npm who`
    $.verbose = debug
  }
}
catch (ex) {
  console.error(ex)
  process.exit(1)
}

$.verbose = true
if (debug) {
  await $`cat ~/.npmrc`
}


