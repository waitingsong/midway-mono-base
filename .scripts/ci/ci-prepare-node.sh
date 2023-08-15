#!/bin/bash
set -e


npm config set registry "$NPM_REGISTRY"
# npm config set disturl "$NPM_DIST"
npm root -g
node -v
npm -v

# nodejs
if [ -n "$CI_COMMIT_TAG" ]; then
  export authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_TAG | grep Author | cut -d ' ' -f2-)"
else
  export authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_SHA | grep Author | cut -d ' ' -f2-)"
fi
echo $authorOfTagOrCommit

globalDir="$(npm root -g)"
# if globalDir exists and local node_modules does not exist
if [ -d "$globalDir" ] &&  [ ! -d node_modules ] ; then
  ln -s $globalDir node_modules
fi

