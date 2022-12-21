#!/bin/bash
# Should called by tar.sh and build-images.sh
# Should under the folder $BUILD_TMP_DIR

npm config get registry
if [ -n "$NPM_REGISTRY" ]; then
  # echo -e "\$NPM_REGISTRY: $NPM_REGISTRY"
  # must rm node_modules
  npm config set registry $NPM_REGISTRY
  npm config get registry
fi

pwd
npmPkg="$1"
npmPkgFile="$2"

if [ -z "$npmPkgFile" ]; then
  echo -e "Package NOT exists on npm repo: $npmPkgFile "
  exit 1
fi

echo -e ">>> Downloading '$npmPkg' from NPM"
npm pack --quiet "$npmPkg"
tar -xf "$npmPkgFile"
ls -l package
rm "$npmPkgFile" -f

