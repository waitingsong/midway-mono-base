#!/usr/bin/env tsx
/**
 * Delete remote branch
 * @requires access token named PUBLISH_TOKEN with api, read_api and write_repository scope
 * @usage `./ci-delete-remote-branch.sh $ACCESS_TOKEN "$CI_API_V4_URL" $CI_PROJECT_ID <branch name>`
 * @example  `./ci-delete-remote-branch.sh d223a375d4c243926111110b386666 "https://gitlab.com/api/v4" 23 release`
 */
import assert from 'node:assert'

import { retrieveArgsFromProcess } from '@waiting/shared-core'
import { $ } from 'zx'

import {
  CI_PROJECT_PATH,
  PUBLISH_TOKEN,
  CI_API_V4_URL,
  CI_PROJECT_ID,
 } from '../ci-consts.mjs'

$.verbose = true
await $`pwd && date`
let msg = ''

const argv = retrieveArgsFromProcess()
console.info(argv)

const token = argv.token ?? ''
const apiUrl = argv.api_url ?? CI_API_V4_URL
const pid = argv.pid ?? CI_PROJECT_ID
const branch = argv.branch ?? ''

assert(token, 'Parameter ACESS TOKEN EMPTY')
assert(apiUrl, 'no api_url found')
assert(pid > 0, 'Parameter project id EMPTY')
assert(branch, 'no branch found')

assert(CI_PROJECT_PATH, 'no CI_PROJECT_PATH found')
assert(PUBLISH_TOKEN, 'no PUBLISH_TOKEN found')

msg = `\n>>> Do deleting remote branch "${branch}"...`
console.info(msg)

// #curl --request DELETE
// #  --header "PRIVATE-TOKEN: $TOKEN"
// #  https://gitlab.example.com/api/v4/projects/23/repository/branches/newbranch

const url= `${apiUrl}/projects/${pid}/repository/branches/${branch}`
await $`curl -s --request DELETE  --header "PRIVATE-TOKEN: ${token}" ${url}`


