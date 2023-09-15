#!/bin/bash
# Should called by tar.sh and build-images.sh
# Should under the folder <project>/packages/<some-pkg>
set -e
pwd

if [ ! -f "package.json" ]; then
  echo -e "package.json not exists!"
  exit 1
fi

echo -e ">>> Npm installing"
# remove the pkg symlink created by lerna
rm node_modules -rf
date

disturl="--disturl=https://npmmirror.com/dist/"
if [ -n "$NPM_DIST" ]; then
  echo $NPM_DIST
  disturl="--disturl=${NPM_DIST}"
fi

# --legacy-peer-deps
if [ -f npm-shrinkwrap.json ]; then
  echo -e ">>> npm-shrinkwrap.json exists, use it"
  npm ci --no-audit --omit=dev --omit=optional  $disturl
else
  npm i --no-audit --omit=dev --omit=optional $disturl
fi

date
du -sh node_modules

echo -e ">>> Purging"
cd node_modules

rm "@types" -rf
rm .package-lock.json -f

date

source "${cwd}/.scripts/util/clean-extra-files.sh"
date

source "${cwd}/.scripts/util/clean-extra-files-otel.sh"
date

sh "${cwd}/.scripts/util/clean-pkg-files.sh"
date


echo -e " Purged"
cd ../
du -sh node_modules

