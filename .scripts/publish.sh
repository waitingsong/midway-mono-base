#!/bin/bash
# --------------
# npm publish and trigger pack pipeline
# may called by ci-publish.sh or by hand
#
# Used CI Variables:
# - CI_PUBLISH_COMPLETED_TOKEN (for gitlab)
# - GH_TOKEN (optinal for creating release to github)
# - GL_TOKEN (optinal for creating release to gitlab)
# --------------

appDir=`pwd`
scriptDir="$appDir/.scripts"

tagVerCur=$(jq -r '.version' $appDir/lerna.json)
if [ -z "$tagVerCur" ]; then
  echo -e "Retrieve version of lerna.json failed!"
  exit 1
fi
pkgsChanged="$( lerna changed )"
if [ -z "$pkgsChanged" ]; then
  echo -e "No changed packages to publish"
  echo -e "Version from lerna.json: $tagVerCur"
  exit 0
fi

if [[ "$*" =~ "github" && -z $GH_TOKEN ]]; then
  echo -e "Invalid GH_TOKEN for lerna publish args '--create-release github'"
  echo -e "see: https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type"
  exit 1
fi
if [[ "$*" =~ "gitlab" ]]; then
  if [ -z $GL_TOKEN ]; then
    echo -e "Invalid GL_TOKEN for lerna publish args '--create-release gitlab'"
    echo -e "see: https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type"
    exit 1
  fi
  if [ -z $GL_API_URL ]; then
    export GL_API_URL="$CI_API_V4_URL"
    echo -e "GL_API_URL: $GL_API_URL"
  fi
  if [ -z $GL_API_URL ]; then
    echo -e "Invalid GL_API_URL  for lerna publish args '--create-release gitlab'"
    echo -e "see: https://github.com/lerna/lerna/tree/master/commands/version#--create-release-type"
    exit 1
  fi
fi

if [ -z $RELEASE_BRANCH ]; then
  branch=release
else
  branch="$RELEASE_BRANCH"
fi

if [ -z $CI_PUBLISH_COMPLETED_TOKEN ]; then
  echo -e "env CI_PUBLISH_COMPLETED_TOKEN NOT generated or specified!"
  echo -e "see: https://docs.gitlab.com/ee/ci/triggers/README.html"
  exit 1
fi

source $scriptDir/util/validate-head-diff.sh "$branch"
if [ "$?" -ne 0 ]; then
  echo -e "Release branch \"$branch\" has changed!"
  echo -e "Retry publishing on the latest pipeline"
  echo -e "script: $0 "
  echo -e "------------------------------------------------------"
  exit 1
fi

set -e

echo -e ">>> lerna initializing..."
#npm run clean 
npm run bootstrap
#source $scriptDir/build.sh
lerna run build

echo -e ">>> lerna publishing..."
git add --ignore-errors ./packages
lerna publish $*
sleep "5s"
git push --follow-tags origin

set +e

tagVer=$(jq -r '.version' $appDir/lerna.json)
if [ -z "$tagVer" ]; then
  echo -e "Retrieve version of lerna.json failed!"
  exit 1
fi
if [ "$tagVer" != "$tagVerCur" ]; then
  echo -e "Version from lerna.json: $tagVer\n\n\n "
  git rev-parse v$tagVer >/dev/null 2>&1
  if [ -n $? ]; then
    source $scriptDir/trigger/trigger-publish-completed.sh \
      $CI_PUBLISH_COMPLETED_TOKEN \
      "$CI_API_V4_URL" \
      $CI_PROJECT_ID \
      v$tagVer 
  fi
fi

