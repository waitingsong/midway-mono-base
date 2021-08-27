#!/usr/bin/env zx

console.info(argv)
const baseDir = process.env.cwd
const CI_PROJECT_URL = process.env.CI_PROJECT_URL
const CI_DEFAULT_BRANCH = process.env.CI_DEFAULT_BRANCH
const CI_COMMIT_BRANCH = process.env.CI_COMMIT_BRANCH
const CI_COMMIT_TAG = process.env.CI_COMMIT_TAG

let logMsg = ''

const action = argv.action
const pkg = argv.pkg
const file = argv.file
const cacheDirName = argv.dirName ?? 'locks-cache'
const cacheDir = `${baseDir}/${cacheDirName}/${pkg}`
const path = `${cacheDir}/${file}`

if (action === 'save') {
  const exists = await fs.pathExists(file)
  if (! exists) {
    console.warn(`file not exists: "${file}"`)
    process.exit()
  }
  await fs.ensureDir(cacheDir)
  await fs.copy(file, path)
  await $`ls -al ${cacheDir}`
}
else if (action === 'restore') {
  const exists = await fs.pathExists(path)
  if (! exists) {
    console.warn(`file not exists: "${path}"`)
    process.exit()
  }
  await fs.copy(path, file)
  await $`ls -al`
}
else {
  console.warn('Value of param action must be save|restore')
}

