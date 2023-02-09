#!/bin/bash
# Should called by tar.sh, build-images.sh, cd-distribute-images.sh
# Should under the folder <project>/packages/<some-pkg>

if [ ! -f "package.json" ]; then
  echo -e "package.json not exists!, current dir:"
  pwd
  exit 1
fi

pwd

export pkgVer=$(jq -r '.version' package.json)
export pkgName=$(jq -r '.name' package.json)
export pkgPrivate=$(jq -r '.private' package.json)
export pkgDesc=$(jq -r '.description' package.json)

if [ -z "$pkgVer" ]; then
  echo -e "Value of version from package.json invalid!"
  exit 1
fi

if [ -z "$pkgName" ]; then
  echo -e "Value of name from package.json empty!"
  exit 1
fi

pkgScope=""
if [ "${pkgName:0:1}" == "@" ]; then
  export pkgScope=$(echo "$pkgName" | awk -F'/' '{print $1}')
fi

majorValue=$(echo "$pkgVer" | awk -F'.' '{print $1}')
minorValue=$(echo "$pkgVer" | awk -F'.' '{print $2}')
patchValue=$(echo "$pkgVer" | awk -F'.' '{print $3}')

# # @scope/pkg => scope/pkg
# pkgImgNameNorm=$(echo "$pkgName" | sed -r 's/[@]//g')
# if [ -z "$pkgImgNameNorm" ]; then
#   echo -e "Value of name from package.json invalid!"
#   exit 1
# fi

# @scope/pkg => scope-pkg
export fileNameNorm=$(echo "$pkgName" | sed -r 's/[@]//g' | tr / -)
if [ -z "$fileNameNorm" ]; then
  echo -e "Value of name from package.json invalid!"
  exit 1
fi
# @scope/pkg => scope-pkg
export pkgImgNameNorm="$fileNameNorm"
if [ -z "$pkgImgNameNorm" ]; then
  echo -e "Value of name from package.json invalid!"
  exit 1
fi

latestVer="latest"
export majorVer="$majorValue" # 1
export minorVer="${majorVer}.${minorValue}"  # 1.2
export patchVer="${minorVer}.${patchValue}"  # 1.2.3

# @scope/pkg => scope-pkg:version
imgLatest="$pkgImgNameNorm:$latestVer"
imgMajor="$pkgImgNameNorm:$majorVer"
imgMinor="$pkgImgNameNorm:$minorVer"

if [ -n "$CI" ]; then
  if [ -z "$CI_COMMIT_TAG" ]; then
    # rc
    imgPatch="$pkgImgNameNorm:rc-$CI_COMMIT_SHORT_SHA-$patchVer"
  else
    # ga
    imgPatch="$pkgImgNameNorm:$patchVer"
  fi
else
  imgPatch="$pkgImgNameNorm:manual-$localHeadShortSha-$patchVer"
fi

# specify reg server
if [ -n "$DOCKER_REG_SERVER" ]; then
  export imgLatest="$DOCKER_REG_SERVER/$imgLatest"
  export imgMajor="$DOCKER_REG_SERVER/$imgMajor"
  export imgMinor="$DOCKER_REG_SERVER/$imgMinor"
  export imgPatch="$DOCKER_REG_SERVER/$imgPatch"
else
  echo "env DOCKER_REG_SERVER empty"
  exit 1
fi

# scope-pkg-1.2.3
export fileNameNormVer="$fileNameNorm-$patchVer"

BUILD_TMP_DIR="${BUILD_TMP_DIR:-/tmp/build}"
#pkgBuildTmpDir="$BUILD_TMP_DIR/$fileNameNormVer-$CI_PIPELINE_ID-$CI_JOB_ID"
# only for image build cache
export pkgBuildTmpDir="$BUILD_TMP_DIR/$fileNameNorm"
if [ -d "$pkgBuildTmpDir" ]; then
  echo -e "folder \$pkgBuildTmpDir: '$pkgBuildTmpDir' already exists!"
  echo -e "try run: rm $pkgBuildTmpDir -rf"
  ls -l $pkgBuildTmpDir
  exit 1
fi
mkdir -p "$pkgBuildTmpDir"

echo -e "\$pkgScope: $pkgScope"
echo -e "\$pkgName: $pkgName"
echo -e "\$pkgVer: $pkgVer"
echo -e "\$pkgImgNameNorm: $pkgImgNameNorm"
echo -e "\$fileNameNormVer: $fileNameNormVer"
echo -e "\$pkgPrivate: $pkgPrivate"
echo -e "\$pkgDesc: $pkgDesc"
echo -e "\$imgPatch: $imgPatch"
echo -e "\$pkgBuildTmpDir: $pkgBuildTmpDir"

