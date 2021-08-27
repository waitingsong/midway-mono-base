#!/bin/bash
# Should called by tar.sh and build-images.sh
# Should under the folder $BUILD_TMP_DIR

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

