#!/bin/bash
# Move folder of the scope under node_modules to node_modules-ext
# for image build cache.
# Must use `COPY node_modules-ext ./node_modules` in the Dockerfile
# Should called by tar.sh and build-images.sh
# Should under the folder <project>/packages/<some-pkg>

pwd
srcScope="$1"
suffix=$2
dstDir="./node_modules-ext-$suffix/"
mkdir -p "$dstDir"

# if [ -z "$srcScope" ]; then
#   echo -e "Param \$srcScope empty!"
#   exit 1
# fi

# if [ ! -f "package.json" ]; then
#   echo -e "package.json not exists!"
#   exit 1
# fi

if [ ! -d "node_modules" ]; then
  echo -e "folder node_modues not exists, skip"
  mkdir -p node_modules
  exit 0
fi

srcDir="./node_modules/$srcScope"
if [ ! -d "$srcDir" ]; then
  # echo -e "folder not exists: $srcDir, skip"
  mkdir -p "$srcDir"
  exit 0
fi

echo -e "\n>>> Splitting node_modules: $srcScope"
mv "$srcDir" "$dstDir"

