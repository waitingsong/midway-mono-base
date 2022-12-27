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
# if [ -f package-lock.json ]; then
#   npm ci --prod --no-audit --no-optional --legacy-peer-deps
# else
#   npm i --prod --no-audit --no-optional --legacy-peer-deps
# fi

if [ -z $NPM_DIST ]; then
  npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps
else
  echo $NPM_DIST
  npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps --disturl=$NPM_DIST
  # npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps --disturl=https://npmmirror.com/dist/
fi


date
du -sh node_modules

# Note: file link not works under windows properly
#echo -e ">>> Npm deduping"
#npm ddp --no-audit

echo -e ">>> Purging"
cd node_modules

rm "@types" -rf
rm .package-lock.json -f

date
source "${cwd}/.scripts/util/clean-extra-files.sh"
date
sh "${cwd}/.scripts/util/clean-pkg-files.sh"
date

cd ../

