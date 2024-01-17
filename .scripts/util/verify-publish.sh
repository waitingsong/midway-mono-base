#!/bin/bash
# ---------------------------
# Verify the commit for pre-publish valid
#   means no TAG created after this commit
# ---------------------------

if [ -n "$CI_COMMIT_TAG" ]; then
  echo -e 'Publishing the commit with CI_COMMIT_TAG is forbidden!'
  exit 1
fi

if [ -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e '$CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

if [ -z "$CI_DEFAULT_BRANCH" ]; then
  defaultBranch=main
  # echo -e '$CI_DEFAULT_BRANCH undefined! gitlab supports since v1.24'
  # echo -e 'see: https://docs.gitlab.com/ee/ci/variables/predefined_variables.html'
  # exit 1
else
  defaultBranch="$CI_DEFAULT_BRANCH"
fi

echo -e ">>> Verifying no newer publish..."
git fetch -q origin
set +e
latestTag="$(git describe --abbrev=0 origin/$defaultBranch)"
set -e

if [ -z "$latestTag" ]; then
  return 0
fi

set +e
# https://stackoverflow.com/a/29984371
distance=$(git rev-list --count $CI_COMMIT_SHORT_SHA.."$latestTag")
set -e

if [ "$distance" != "0" ]; then
  echo "distance: $distance to $latestTag"
  if [ "$FORCE_PUBLISH" == "yes" ]; then
    echo -e ""
    echo -e "------------------------ NOTE ------------------------"
    echo -e "A newer publish and tag merged after this commit"
    echo -e "Force publish with CI/CD variable \"FORCE_PUBLISH\""
    echo -e "The newest tag: $latestTag"
    echo -e "------------------------------------------------------"
    return 0
  fi

  echo -e ""
  echo -e "------------------------ CAUTION ------------------------"
  echo -e "Publishing of this commit is forbidden! "
  echo -e "A newer publish and tag merged after this commit"
  echo -e "Set CI/CD variable \"FORCE_PUBLISH\": \"yes\" and retry"
  echo -e "The newest tag: $latestTag"
  echo -e "---------------------------------------------------------"
  exit 1
fi

