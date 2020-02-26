#!/bin/bash
# ---------------------------
# Tar pack
#
# Used Variables:
# - TAR_COMPRESSION_LEVEL: defined in .gitlab-ci.yml
# ---------------------------
set -e

localHeadSha=$( git rev-parse HEAD )
localHeadShortSha=$( git rev-parse --short HEAD )

curDir=$(dirname $(readlink -f "$0"))
appPath=$(dirname $curDir)
outDir=assets
mkdir -p "$outDir"

TAR_COMPRESSION_LEVEL=${TAR_COMPRESSION_LEVEL:-7}
export XZ_DEFAULTS="-T 0 -$TAR_COMPRESSION_LEVEL"

pkgs=`find packages -maxdepth 1 -mindepth 1`
cwd=`pwd`

for pkg in $pkgs
do
  name=$(echo "$pkg" | awk -F'/' '{print $2}')
  if [ "$name" == "demo-docs" -o "$name" == "demo-service" ]; then
    continue
  fi

  cd "$cwd/${pkg}"
  if [ ! -f "package.json" ]; then
    continue
  fi

  echo -e " \n\n-------------------------------------------"
  source "${cwd}/.scripts/util/pick-pkg-env.sh"
  cd "$pkgBuildTmpDir"
  sh "${cwd}/.scripts/util/download-npm-pkg.sh" "$pkgName@$pkgVer" "$fileNameNormVer.tgz"
  cd "$pkgBuildTmpDir/package"
  source "${cwd}/.scripts/util/prepare-pkg.sh"
  source "${cwd}/.scripts/util/packing-pkg.sh"

  rm "$pkgBuildTmpDir" -rf
done

cd $cwd

echo -e ">>> Result assets:"
ls -lh $outDir

set +e

