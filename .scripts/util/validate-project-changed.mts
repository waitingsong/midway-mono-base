#!/usr/bin/env tsx
import assert from 'node:assert'
import { $ } from 'zx'
import { PkgInfoLite } from '../ci-types.mjs'


await $`git fetch --tags`

const { stdout: tagVer } = await $`jq -r '.version' lerna.json`

const msg = `
No changed packages to publish
Version from lerna.json: ${tagVer}
`

try {
  const changedResp = await $`lerna changed --json --loglevel error`
  const changedPkgs = JSON.parse(changedResp.stdout) as PkgInfoLite[]
  if (! changedPkgs || ! changedPkgs.length) {
    console.error(msg)
    process.exit(1)
  }
}
catch (ex) {
  console.error(ex)
  console.error(msg)
  process.exit(1)
}

