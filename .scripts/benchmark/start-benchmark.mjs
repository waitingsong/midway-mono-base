#!/usr/bin/env zx
import assert from 'node:assert'
import { join, basename } from 'node:path'
import { stat, copyFile } from 'node:fs/promises'



const pkgDir = argv.p ?? ''
const httpPath = argv.t ?? ''

assert(pkgDir, 'pkg dir is required with -p')

const dir = join('./packages', pkgDir)
try {
  const dirStat = await stat(dir)
  if (!dirStat.isDirectory()) {
    throw new Error(`"${dir}" is not a directory`)
  }
}
catch {
  throw new Error(`Path is not exists: ${dir}`)
}

const files = [
  ['start.js'],
  ['benchmark.mjs'],
  [`${pkgDir}/configuration.ts`, `src/configuration.ts`],
]
for (const [file, dst] of files) {
  const filePath = join(__dirname, file)
  const fileStat = await stat(filePath)
  if (! fileStat.isFile()) {
    throw new Error(`"${filePath}" is not a file`)
  }
  const dstPath = dst ? `${dir}/${dst}` : `${dir}/${basename(file)}`
  await copyFile(filePath, dstPath)
}

echo`[benchmark] script complete`

cd(dir)

await $`pwd && npm run build`
echo(chalk.blue('[benchmark] build example complete'))

let gotError = false
try {
  echo(chalk.blue('\n[benchmark] start'))
  await $`zx benchmark.mjs --api=${httpPath}`
}
catch (ex) {
  console.error(ex)
  gotError = true
}
finally {
  const arr = []
  for (const [file, dst] of files) {
    const filePath = join(__dirname, file)
    const fileStat = await stat(filePath)
    if (!fileStat.isFile()) {
      throw new Error(`"${filePath}" is not a file`)
    }
    if (dst) {
      arr.push(dst)
    }
  }
  if (arr.length > 0) {
    await $`git restore ${arr}`
  }

  if (gotError) {
    console.error(chalk.red('\n[benchmark] benchmark failed'))
    process.exit(1)
  }
  else {
    echo(chalk.green('\n[benchmark] finished'))
  }
}

