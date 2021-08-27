#!/bin/bash
# --------------
# publish by CI
#
# Must on branch "release"
# only one origin/release exists during publish process
# --------------

echo -e "-------------------------------------------"
echo -e "            publish process "
echo -e "-------------------------------------------"

echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"
sh .scripts/util/import-npm.sh

# Only on release branch
# R1=$(echo "$CI_COMMIT_REF_NAME" | awk -F'-' '{print $1}')
if [ -z "$CI_COMMIT_REF_NAME" -o "$CI_COMMIT_REF_NAME" != $RELEASE_BRANCH ]; then
  echo -e "-------------------------------------------"
  echo -e "NPM publish only on branch \"release\" or \"release-<SHA>\"!"
  echo -e "Current branch: $CI_COMMIT_REF_NAME"
  echo -e "-------------------------------------------\n\n"
  exit 1
fi

source .scripts/util/verify-publish.sh
source .scripts/ci/ci-ssh-agent.sh

# valiate remote for deleting
source .scripts/util/validate-head-diff.sh $RELEASE_BRANCH
if [ "$?" -ne 0 ]; then
  echo -e "Release branch \"$RELEASE_BRANCH\" has changed!"
  echo -e "Retry publishing on the latest pipeline"
  echo -e "script: $0 "
  echo -e "------------------------------------------------------\n\n"
  exit 1
fi

set -e
echo -e "CI_COMMIT_REF_NAME:: $CI_COMMIT_REF_NAME"
git -c core.fileMode=false checkout "$CI_COMMIT_REF_NAME"
git log | head -n 1
# check push to remote available
echo -e "list branches"
git remote -v
git branch -a
git push origin --no-verify


echo -e ">>> lerna initializing..."
#npm run clean
date
npm run bootstrap -- --ci
date
#lerna run build # not works on lerna v4
npm run build

set +e
source .scripts/publish.sh --yes $*
pubflag=$?
set -e


if [ "$RELEASE_BRANCH" == "$CI_DEFAULT_BRANCH" ]; then
  return 0
fi
if [ "$RELEASE_BRANCH" == "main" ]; then
  return 0
fi

echo -e "-------------------------------------------"
echo -e "            post-publish process "
echo -e "-------------------------------------------"

echo -e ">>> Do Merging to default branch..."
git config pull.rebase false
git -c core.fileMode=false checkout $CI_DEFAULT_BRANCH
git pull origin
set +e
git merge "$CI_COMMIT_REF_NAME" -m "Merge release branch"
if [ "$?" -ne 0 ]; then
  echo -e "-------------------------------------------"
  echo -e "Merge release branch to $CI_DEFAULT_BRANCH failed!"
  echo -e "Do merging manually!"
  echo -e "-------------------------------------------\n\n"
  exit 1
fi

echo -e ">>> Do pushing local $CI_DEFAULT_BRANCH to remote..."
git push --no-verify -v origin
if [ "$?" -ne 0 ]; then
  echo -e "-------------------------------------------"
  echo -e "Push local branch to remote failed!"
  echo -e "Do merging manually!"
  echo -e "-------------------------------------------\n\n"
  exit 1
fi

# valiate remote for deleting
git checkout "$RELEASE_BRANCH"
sh $cwd/.scripts/ci/ci-prepare.sh
source .scripts/util/validate-head-diff.sh $RELEASE_BRANCH
if [ "$?" -ne 0 ]; then
  echo -e "Release branch \"$RELEASE_BRANCH\" has changed after published."
  echo -e "Remote branch \"$RELEASE_BRANCH\" will NOT be deleted!"
  echo -e "script: $0 "
  echo -e "------------------------------------------------------\n\n"
  exit 1
fi

# Not works since gitlab v12.4
#echo -e ">>> Do deleting the remote release branch..."
#git push --no-verify origin -d release
source .scripts/ci/ci-delete-remote-branch.sh $GL_TOKEN "$CI_API_V4_URL" $CI_PROJECT_ID "$RELEASE_BRANCH"

$cwd/.scripts/util/save-cache.sh

if [ $pubflag != 0 ]; then
  echo publish failed
  exit 1
fi

#echo -e ">>> Do deleting local release branch..."
#git checkout $CI_DEFAULT_BRANCH
#git branch -D "$RELEASE_BRANCH"
#git log | head -n 1

echo -e "-------------------------------------------"
echo -e "            publish succeeded "
echo -e "-------------------------------------------\n\n"

set -e

