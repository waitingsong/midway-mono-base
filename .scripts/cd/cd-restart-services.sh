#!/bin/bash
# ---------------------------
# Restart services
#
# Used CI Variables:
# - CD_SSH_HOST: hostname or ip, without protocol and port (like gitlab.example.com)
#   https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
# - CD_SSH_PORT: optional, Default 22
# - CD_SSH_PRIVATE_KEY: base64 encoded
# - CD_REMOTE_RESTART_SCRIPT: services restart script path in remote deploy,
#   eg. "/docker/project/restart.sh"
# ---------------------------

echo -e "\n-------------------------------------------"
echo -e "        restart services process "
echo -e "-------------------------------------------\n"

echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi


if [ -z "$CD_REMOTE_RESTART_SCRIPT" ]; then
  echo 'Notice: CD_REMOTE_RESTART_SCRIPT is empty or not defined'
fi

source .scripts/cd/cd-ssh-agent.sh

pkgs=`find packages -maxdepth 1 -mindepth 1`
cwd=`pwd`
cmd="df -lhT && echo -e '\\n\\n'"

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

  echo -e "\n>>> Checking image of $pkg exists in deploy"
  source "${cwd}/.scripts/util/verify-pkg-image-deploy.sh"

  if [ -z "$PKG_IMAGE_DEPLOY_EXISTS" ]; then
    echo -e "Error: Image of $pkg NOT exists in deploy"
    exit 1
  fi

  cmd="$cmd \
    && docker tag $imgPatch $imgLatest \
    && docker image ls  | grep -F '$pkgImgNameNorm' | grep latest | head -n 2 \
    && docker image ls | grep -F '$pkgImgNameNorm' | grep -F '$patchVer' | head -n 5 \
    && echo -e '\\n' "
done

if [ -n "$CD_REMOTE_RESTART_SCRIPT" ]; then
  cmd="$cmd && sh \"$CD_REMOTE_RESTART_SCRIPT\" "
fi

echo -e "cmd: \"$cmd\""
echo -e "\n----------------------------"
ssh -p $CD_SSH_PORT $CD_SSH_USER@$CD_SSH_HOST "$cmd"
echo -e "------------------------------\n"


cd $cwd

echo -e "\n-------------------------------------------"
echo -e "        restart services succeeded "
echo -e "-------------------------------------------\n\n"

