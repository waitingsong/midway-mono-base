#!/bin/bash
set -e

npm config set registry "$NPM_REGISTRY"
npm config set disturl "$NPM_DIST"
npm root -g
node -v
npm -v
free -m
df -hT
ls -l
du -sh packages/*

source .scripts/util/alias.sh
sh .scripts/util/check-env.sh
source .scripts/ci/ci-prepare.sh
source .scripts/util/import-myca.sh
