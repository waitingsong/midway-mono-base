#!/bin/bash
# for scripts.prepublishOnly of top package.json
# use only of top

set -e

echo '>>> ci-prepublishOnly...'
date
nx reset

# Do NOT use `--parallel`
# # lerna clean --yes
if [ -n "$NPM_REGISTRY" ]; then
  echo -e "\$NPM_REGISTRY: $NPM_REGISTRY "

  lerna exec --concurrency 1 -- \
    npm i --ignore-scripts \
    --no-audit --omit=dev --omit=optional --legacy-peer-deps --package-lock-only \
    --registry "$NPM_REGISTRY"
else
  lerna exec --concurrency 1 -- \
    npm i --ignore-scripts \
    --no-audit --omit=dev --omit=optional --legacy-peer-deps --package-lock-only
fi

mv package.json package.json.top
lerna exec --concurrency 1 -- npm shrinkwrap
lerna exec --concurrency 1 -- ls npm-shrinkwrap.json
mv package.json.top package.json

date

