#!/bin/bash
# ---------------------------
# Distribute Image
#
# Used CI Variables:
#   https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
# ---------------------------
set -e

echo -e "-------------------------------------------"
echo -e "           distribution process "
echo -e "-------------------------------------------"

echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

# BusyBox not support execdir 
pkgs=`find packages -maxdepth 1 -mindepth 1`

for pkg in $pkgs
do
  name=$(echo "$pkg" | awk -F'/' '{print $2}')
  if [ "$name" == "demo-docs" -o "$name" == "demo-service" ]; then
    continue
  fi

  cd "$cwd/$pkg"
  if [ ! -f "package.json" -o ! -f "Dockerfile" ]; then
    continue
  fi

  echo -e " \n\n-------------------------------------------"
  source "${cwd}/.scripts/util/pick-pkg-env.sh"

  $cwd/.scripts/trigger/trigger-ready-for-deploy.mjs --name=$pkgImgNameNorm --ver=$pkgVer

done

cd $cwd

echo -e "-------------------------------------------"
echo -e "          distribution succeeded "
echo -e "-------------------------------------------\n\n "


