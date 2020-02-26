#!/bin/bash
# Move folder of the scope under node_modules to node_modules-ext
# for image build cache.
# Must use `COPY node_modules-ext ./node_modules` in the Dockerfile
# Should called by tar.sh and build-images.sh
# Should under the folder <project>/packages/<some-pkg>

pwd
moveScope="$1"
dstDir="./node_modules-ext/"
mkdir "$dstDir"

if [ -z "$moveScope" ]; then
  return
fi

if [ ! -f "package.json" ]; then
  echo -e "package.json not exists!"
  exit 1
fi

if [ ! -d "node_modules" ]; then
  echo -e "folder node_modues not exists!"
  return
fi

srcDir="./node_modules/$moveScope"
dstDir="./node_modules-ext/"

if [ ! -d "$srcDir" ]; then
  return
fi

ls -l $srcDir
echo -e "\n>>> Splitting node_modules"
mv "$srcDir" $dstDir
ls -l $dstDir

