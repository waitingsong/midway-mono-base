#!/bin/bash
# ---------------------------
# Remove images on remote(deploy) server
#
# Used CI Variables:
# - CD_SSH_HOST: hostname or ip, without protocol and port (like gitlab.example.com)
#   https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
# - CD_SSH_PORT: optional, Default 22
# - CD_SSH_PRIVATE_KEY: base64 encoded
# ---------------------------

echo -e "-------------------------------------------"
echo -e "           remove remote images "
echo -e "-------------------------------------------\n "

echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

source .scripts/cd/cd-ssh-agent.sh

pkgs=`find packages -maxdepth 1 -mindepth 1`
cmd="echo -e '\\n\\n'"
oneToRemove=""

for pkg in $pkgs
do
  name=$(echo "$pkg" | awk -F'/' '{print $2}')
  if [ "$name" == "demo-docs" -o "$name" == "demo-service" ]; then
    continue
  fi

  cd "$cwd/$pkg"
  if [ ! -f "package.json" -o ! -f "Dockerfile" ]; then
    continue
  fi

  echo -e "\n\n-------------------------------------------"
  source "${cwd}/.scripts/util/pick-pkg-env.sh"

  source "${cwd}/.scripts/util/whether-pkg-image-contains-latest-tag.sh" "$imgPatch" "$imgLatest"
  hasLatestTag=$?
  # rm remote image if NOT contains latest tag
  if [ $hasLatestTag == 0 ]; then
    echo "Image will be deleted: $imgPatch"
    oneToRemove=yes
    cmd="$cmd \
      && docker rmi $imgPatch "
  fi

done

if [ -z $oneToRemove ]; then
  echo -e "-------------------------------------------"
  echo No image need to remove, Skip action.
  echo -e "-------------------------------------------\n\n "
  return 0
fi

cmd="$cmd \
  && docker image prune -f \
  && df -lhT "

echo "cmd: \"$cmd\""
echo -e "----------------------------"
ssh -p $CD_SSH_PORT $CD_SSH_USER@$CD_SSH_HOST "$cmd"
echo -e "------------------------------\n "

cd "$cwd"

echo -e "-------------------------------------------"
echo -e "       remove remote images succeeded"
echo -e "-------------------------------------------\n\n "
return 0

