#!/bin/bash
# ---------------------------
# Build images
#
# Used CI Variables:
# - DOCKER_REG_SERVER
# - DOCKER_REG_USER
# - DOCKER_REG_PWD
# - NODE_BASE_IMAGE
# ---------------------------
set -e

echo -e "-------------------------------------------"
echo -e "      images build and push process "
echo -e "-------------------------------------------"

if [ -n "$CI" ]; then
  nx reset
fi

# echo $authorOfTagOrCommit
echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"
echo -e "base img: $NODE_BASE_IMAGE"
echo -e "--------------\n\n"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

source "$cwd/.scripts/util/login-docker-repo.sh"

# BusyBox not support execdir
#pkgs=`find packages -maxdepth 1 -mindepth 1 -execdir basename {} .json ;`
pkgs=`find packages -maxdepth 1 -mindepth 1`
globalIgnoreFile="$cwd/.dockerignore"

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

  if [ ! -f ".dockerignore" ]; then
    cp "$globalIgnoreFile" ./.dockerignore
  fi

  # ${cwd}/.scripts/util/prepare-bin-for-image.mjs

  set -e
  if [ -n "$CI_COMMIT_TAG" ]; then
    ${cwd}/.scripts/ci/ci-build-image.mjs --src="$imgPatch" --cache-from="$imgLatest --ga=true"
  else
    ${cwd}/.scripts/ci/ci-build-image.mjs --src="$imgPatch" --cache-from="$imgLatest"
  fi

  rm "$pkgBuildTmpDir" -rf
done

cd $cwd

echo -e "-------------------------------------------"
echo -e "      images build and push succeeded"
echo -e "-------------------------------------------\n\n "

bash "$cwd/.scripts/util/image-random-prune.sh"


