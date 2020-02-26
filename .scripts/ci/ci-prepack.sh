#!/bin/bash
# for scripts.prepack of top package.json
# use only one prepack of top and pkg from ci/ci-prepack.sh or ci-pkg-prepack.sh

set -e

if [ -n "$NPM_REGISTRY" ]; then
  echo -e "\$NPM_REGISTRY: $NPM_REGISTRY"
  # must rm node_modules
  lerna clean --yes
  lerna bootstrap --hoist=false --ignore-scripts -- \
    --no-audit --no-optional --prod --package-lock-only \
    --registry "$NPM_REGISTRY"
else
  lerna clean --yes
  lerna bootstrap --hoist=false --ignore-scripts -- \
    --no-audit --no-optional --prod --package-lock-only
fi

set +e

