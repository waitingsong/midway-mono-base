#!/bin/bash
# ---------------------------
# Tar pack
#
# Used Variables:
# ---------------------------


if [ -n "$CI" ]; then
  if [ -z "$CI_COMMIT_TAG" ]; then
    # rc
    target="$cwd/$outDir/$fileNameNorm-v$pkgVer-$CI_COMMIT_SHORT_SHA-DEVELOP.tar.zst"
    echo -e "base:: $fileNameNorm"
    echo -e "target:: $target"
    echo -e "outdir:: $outDir"
    echo -e "cwd:: $cwd"
  else
    # ga
    target="$cwd/$outDir/$fileNameNorm-v$pkgVer-$CI_COMMIT_SHORT_SHA.tar.zst"
  fi
else
  target="$cwd/$outDir/$fileNameNorm-v$pkgVer-$localHeadShortSha.tar.zst"
fi

echo -e ">>> Packing $pkg"
time tarz \
  --exclude=.editorconfig \
  --exclude=.git \
  --exclude=.githooks \
  --exclude=.github \
  --exclude=.travis.yml \
  --exclude=.vscode \
  --exclude=appveyor.yml \
  --exclude=assets \
  --exclude=coverage \
  --exclude=docs \
  --exclude=example \
  --exclude=logs \
  --exclude=run \
  --exclude=src \
  --exclude=test \
  --exclude=yarn.lock \
  --exclude='./.scripts' \
  --exclude='.eslint*' \
  --exclude='node_modules?' \
  --exclude='tsconfig.*' \
  --exclude=*.swp \
  --totals -cpf $target ./

if [ "$?" -eq 0 ];then
  echo -e "Compressed pkg: \"${pkg}\""
else
  echo -e "Compress pkg: \"${pkg}\" failed!"
  exit 1
fi

