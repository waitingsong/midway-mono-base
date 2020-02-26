#!/bin/bash
# Should called by tar.sh, build-images.sh, cd-distribute-images.sh
# Should under the folder <project>/packages/<some-pkg>

if [ ! -f "package.json" ]; then
  echo -e "package.json not exists!"
  exit 1
fi

type jq 1>/dev/null
if [ $? != 0 ]; then
  echo -e "jq not callable!"
  echo -e "Download: https://stedolan.github.io/jq/download/"
  echo -e "For win32: copy jq-win64.exe to %windir%/system32/jq.exe"
  exit 1
fi

pwd

pkgVer=$(jq -r '.version' package.json)
pkgName=$(jq -r '.name' package.json)
pkgPrivate=$(jq -r '.private' package.json)
pkgDesc=$(jq -r '.description' package.json)

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
  pkgScope=$(echo "$pkgName" | awk -F'/' '{print $1}')
fi

majorValue=$(echo "$pkgVer" | awk -F'.' '{print $1}')
minorValue=$(echo "$pkgVer" | awk -F'.' '{print $2}')
patchValue=$(echo "$pkgVer" | awk -F'.' '{print $3}')

# @scope/pkg => scope/pkg
pkgImgNameNorm=$(echo "$pkgName" | sed -r 's/[@]//g')
if [ -z "$pkgImgNameNorm" ]; then
  echo -e "Value of name from package.json invalid!"
  exit 1
fi

# @scope/pkg => scope-pkg
fileNameNorm=$(echo "$pkgName" | sed -r 's/[@]//g' | tr / -)
if [ -z "$fileNameNorm" ]; then
  echo -e "Value of name from package.json invalid!"
  exit 1
fi

latestVer="latest"
majorVer="$majorValue" # 2
minorVer="${majorVer}.${minorValue}"  # 2.3
patchVer="${minorVer}.${patchValue}"  # 2.3.4

# @scope/pkg => scope/pkg
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
  imgLatest="$DOCKER_REG_SERVER/$imgLatest"
  imgMajor="$DOCKER_REG_SERVER/$imgMajor"
  imgMinor="$DOCKER_REG_SERVER/$imgMinor"
  imgPatch="$DOCKER_REG_SERVER/$imgPatch"
fi

# scope-pkg-1.2.3
fileNameNormVer="$fileNameNorm-$patchVer"

BUILD_TMP_DIR="${BUILD_TMP_DIR:-/tmp/build}"
#pkgBuildTmpDir="$BUILD_TMP_DIR/$fileNameNormVer-$CI_PIPELINE_ID-$CI_JOB_ID"
# only name for image build cache
pkgBuildTmpDir="$BUILD_TMP_DIR/$fileNameNorm"
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

