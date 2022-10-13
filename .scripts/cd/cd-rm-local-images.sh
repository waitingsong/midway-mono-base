#!/bin/bash
# ---------------------------
# Remove local images
# ---------------------------

echo -e "\n-------------------------------------------"
echo -e "           remove local images "
echo -e "-------------------------------------------\n"

source "$cwd/.scripts/cd/cd-env.sh"
echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

#docker info

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

  echo -e "\n\n-------------------------------------------"
  source "${cwd}/.scripts/util/pick-pkg-env.sh"

  echo -e "\n----------------------------"
  docker image ls "$imgPatch"
  echo -e ""
  docker image inspect -f "$iifmt" "$imgPatch"
  echo -e "------------------------------\n"

  echo -e "\n>>> Cleaning local image of $pkg"
  docker rmi $imgPatch
done
cd "$cwd"

echo -e "\n-------------------------------------------"
echo -e "       remove local images succeeded"
echo -e "-------------------------------------------\n\n"

