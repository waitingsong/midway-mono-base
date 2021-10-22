#!/bin/bash
set -e

# nodejs
if [ -n "$CI_COMMIT_TAG" ]; then
  export authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_TAG | grep Author | cut -d ' ' -f2-)"
else
  export authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_SHA | grep Author | cut -d ' ' -f2-)"
fi


# android
export GRADLE_USER_HOME=.gradle-bin


# flutter
export PUB_CACHE="$CI_PROJECT_DIR/.pub-cache"

