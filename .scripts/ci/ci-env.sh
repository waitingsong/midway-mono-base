#!/bin/bash

if [ -n "$CI_COMMIT_TAG" ]; then
  export authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_TAG | grep Author | cut -d ' ' -f2-)"
else
  export authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_SHA | grep Author | cut -d ' ' -f2-)"
fi

