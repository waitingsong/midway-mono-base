#!/usr/bin/env zx

try {
  await $`lerna changed`
}
catch (ex) {
  const msg = ` \n
===============================================
Project source code has no change, skip release
===============================================
  \n`
  console.info(msg)
  process.exit(1)
}

