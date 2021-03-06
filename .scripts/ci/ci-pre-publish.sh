#!/bin/bash

# pre-publish
# switch new release branch from master and push

echo -e "-------------------------------------------"
echo -e "            pre-publish process "
echo -e "-------------------------------------------"

# https://stackoverflow.com/a/54533010
# git fetch origin
EXISTS=`git ls-remote --exit-code --heads origin $RELEASE_BRANCH`
if [ "$EXISTS" ]; then
  echo -e ""
  echo -e "---------------------------------- CAUTION -------------------------------------------"
  echo -e "Remote repository already contains release branch during pre-publish stage!"
  echo -e "It seems another publish process exists."
  echo -e "Wait until another publish process completed or delete branch origin/release manually."
  echo -e "--------------------------------------------------------------------------------------"
  exit 1
fi

source .scripts/ci/ci-ssh-agent.sh
source .scripts/util/verify-publish.sh

if [ "$RELEASE_BRANCH" != "master" ]; then
  echo -e ">>> Do deleting local release branch if exists..."
  git branch -a
  git branch -D $RELEASE_BRANCH

  echo -e ">>> Do creating a new release branch for publishing..."
  git checkout -b $RELEASE_BRANCH
  git log | head -n 1
  git push -v origin $RELEASE_BRANCH
  if [ "$?" -ne 0 ]; then
    echo -e "-------------------------------------------"
    echo -e "Push local branch to remote failed!"
    echo -e "-------------------------------------------\n\n"
    exit 1
  fi
fi


tagVer=$(jq -r '.version' lerna.json)
if [ -z "$tagVer" ]; then
  echo -e "Retrieve version of lerna.json failed!"
  exit 1
fi
repChanged="$( lerna changed )"
if [ -z "$repChanged" ]; then
  echo -e "No changed packages to publish"
  echo -e "Version from lerna.json: $tagVer"
  exit 0
fi

