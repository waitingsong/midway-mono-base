#!/bin/bash
# for scripts.prepack of every package/*/package.json
# use only one prepack of top and pkg from ci/ci-prepack.sh or ci-pkg-prepack.sh

set -e

if [ -n "$NPM_REGISTRY" ]; then
  echo -e "\$NPM_REGISTRY: $NPM_REGISTRY"
  rm node_modules -rf
  npm i --ignore-scripts --no-audit --no-optional --package-lock-only --prod \
    --registry "$NPM_REGISTRY"
else
  rm node_modules -rf
  npm i --ignore-scripts --no-audit --no-optional --package-lock-only --prod
fi

set +e

