#!/usr/bin/env zx

import { join } from 'node:path'
import { rm } from 'node:fs/promises'

const dirs = [
  '@midwayjs/cli-plugin-build/node_modules/typescript',
  '@midwayjs/cli-plugin-test/node_modules',
  '@midwayjs/mwcc/node_modules/typescript',
  'dependency-tree/node_modules/typescript',
  'detective-typescript/node_modules/typescript',
  'filing-cabinet/node_modules/typescript',
  'madge/node_modules/typescript',
]

for (const dir of dirs) {
  const path = join(__dirname, '../node_modules', dir).replace(/\\/g, '/')
  rm(path, { recursive: true }).catch(() => {})
}

