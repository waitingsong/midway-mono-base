#!/bin/bash
# Verify image exists in local or remote
# Usage:
# source info-pkg-image.sh
# echo $imgExists
# - 0: image not exists local or remote
# - 1: image exists in local
# - 2: image exists in remote
# - 3: image exists both in local and remote
#

set +e

imageName="$1"
fmt="$2"

if [ -z "$fmt" ]; then
  fmt="$iifmtIdRepoTags"
fi

imgExists=0

echo -e "Try docker inspect image $imageName ..."
docker image inspect -f "$fmt" "$imageName" 2>/dev/null
if [ "$?" -eq 0 ]; then
  imgExists=$(( imgExists | 1 ))
  echo -e "\n"
  echo -e "Image exists in local: $imageName"
fi

echo -e "Try docker pull image $imageName ... "
docker pull --quiet "$imageName" 2>/dev/null
if [ "$?" -eq 0 ]; then
  imgExists=$(( imgExists | 2 ))
  echo -e "\n"
  echo -e "Image exists in repo: $imageName"
fi

imgExistsLocal=$(( imgExists & 1 ))
imgExistsRemote=$(( imgExists & 2 ))

set -e

exit $imgExists

