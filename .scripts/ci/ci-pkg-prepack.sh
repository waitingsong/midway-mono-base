#!/bin/bash
# for scripts.prepack of every package/*/package.json
# use only one prepack of top and pkg from ci/ci-prepack.sh or ci-pkg-prepack.sh

echo '============================== ci-pkg-prepack ==========================='


DIST=""
if [ -n $NPM_DIST ]; then
  echo $NPM_DIST
  DIST=" --disturl=$NPM_DIST"
  # DIST=" --disturl=https://npmmirror.com/dist/"
fi

if [ -n "$NPM_REGISTRY" ]; then
  echo -e "\$NPM_REGISTRY: $NPM_REGISTRY"
  # rm node_modules -rf
  npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps --ignore-scripts  --package-lock-only \
    --registry "$NPM_REGISTRY" $DIST
else
  # rm node_modules -rf
  npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps --ignore-scripts  --package-lock-only $DIST
fi

ls -al
echo '========================================================='

