#!/bin/bash
# for scripts.prepack of every package/*/package.json
# use only one prepack of top and pkg from ci/ci-prepack.sh or ci-pkg-prepack.sh

echo '============================== ci-pkg-prepack ==========================='

if [ -n "$NPM_REGISTRY" ]; then
  echo -e "\$NPM_REGISTRY: $NPM_REGISTRY"
  # rm node_modules -rf
  npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps --ignore-scripts  --package-lock-only \
    --registry "$NPM_REGISTRY"
else
  # rm node_modules -rf
  npm i --no-audit --omit=dev --omit=optional --legacy-peer-deps --ignore-scripts  --package-lock-only
fi

ls -al
echo '========================================================='

