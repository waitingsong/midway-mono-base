#!/usr/bin/env ts-node-esm
/**
 * Set git config for publish
 * @requires access token named PUBLISH_TOKEN with read/write_repository scope
 */
import assert from 'node:assert'
import { $ } from 'zx'

import {
  CI_PROJECT_PATH,
  CI_SERVER_HOST,
  CI_SERVER_PROTOCOL,
  CI_SERVER_PORT,
  GITLAB_USER_EMAIL,
  GITLAB_USER_NAME,
  PUBLISH_TOKEN,
  PUBLISH_DEBUG,
 } from '../ci-consts.mjs'

$.verbose = true
await $`pwd && date`

assert(CI_PROJECT_PATH, 'no CI_PROJECT_PATH found')
assert(PUBLISH_TOKEN, 'no PUBLISH_TOKEN found')

const url = CI_SERVER_PORT && CI_SERVER_PORT !== '80' && CI_SERVER_PORT !== '443'
  ? `${CI_SERVER_PROTOCOL}://${GITLAB_USER_NAME}:${PUBLISH_TOKEN}@${CI_SERVER_HOST}:${CI_SERVER_PORT}/${CI_PROJECT_PATH}.git`
  : `${CI_SERVER_PROTOCOL}://${GITLAB_USER_NAME}:${PUBLISH_TOKEN}@${CI_SERVER_HOST}/${CI_PROJECT_PATH}.git`

try {
  $.verbose = PUBLISH_DEBUG
  await $`git config --system core.fileMode false \
    && git config --global core.fileMode false \
    && git config user.email ${GITLAB_USER_EMAIL} \
    && git config user.name ${GITLAB_USER_NAME} \
    && git config http.sslVerify false
  `

  await $`git remote set-url origin ${url} `
}
catch (ex) {
  console.error(ex)
  process.exit(1)
}

await $`git remote -v`
$.verbose = true

