#!/usr/bin/env zx


const file = '/usr/bin/ossutil'
const exists = await fs.pathExists(file)

if (! exists) {
  await $`wget -nv https://gosspublic.alicdn.com/ossutil/1.7.11/ossutil64 -O ${file}`
  await $`chmod a+x ${file}`
}

