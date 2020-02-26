#!/bin/bash
# ---------------------------
# Distribute Image
#
# Used CI Variables:
# - CD_SSH_HOST: hostname or ip, without protocol and port (like gitlab.example.com)
#   https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
# - CD_SSH_PORT: optional, Default 22
# - CD_SSH_PRIVATE_KEY: base64 encoded
# - IMG_COMPRESSION_LEVEL: defined in .gitlab-ci.yml
# ---------------------------

echo -e "-------------------------------------------"
echo -e "           distribution process "
echo -e "-------------------------------------------"

cwd=`pwd`
source "$cwd/.scripts/cd/cd-env.sh"
echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

source .scripts/cd/cd-ssh-agent.sh
echo -e ">>> Retrieving file system disk space usage on deploy"
set -e
ssh -p $CD_SSH_PORT admins@$CD_SSH_HOST "df -lhT"
set +e

docker info

IMG_COMPRESSION_LEVEL=${IMG_COMPRESSION_LEVEL:-4}
export XZ_DEFAULTS="-T 0 -$IMG_COMPRESSION_LEVEL"

if [ -n "$DOCKER_REG_SERVER" -a -n "$DOCKER_REG_PWD" ]; then
  echo -e ">>> Login docker hub"
  if [ -z $DOCKER_REG_SERVER ]; then
    echo "$DOCKER_REG_PWD" | docker login -u "$DOCKER_REG_USER" --password-stdin
  else
    echo "$DOCKER_REG_PWD" | docker login -u "$DOCKER_REG_USER" --password-stdin $DOCKER_REG_SERVER
  fi
fi


pkgs=`find packages -maxdepth 1 -mindepth 1`

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

  echo -e " \n\n-------------------------------------------"
  source "${cwd}/.scripts/util/pick-pkg-env.sh"

  echo -e ">>> Checking image of $pkg exists in deploy"
  source "${cwd}/.scripts/util/verify-pkg-image-deploy.sh"
  if [ -n "$PKG_IMAGE_DEPLOY_EXISTS" ]; then
    echo -e "Image of $pkg exists in deploy, skip distribution."
    continue
  fi

  echo -e ">>> Pulling image of $pkg"
  source "${cwd}/.scripts/util/verify-pkg-image.sh"
  imgExists=$?
  if [ $imgExists == 0 ]; then
    echo -e "Image of $pkg NOT exists."
    exit 1
  fi

  echo -e "----------------------------"
  docker image ls "$imgPatch"
  echo -e ""
  docker image inspect -f "$iifmt" "$imgPatch"
  echo -e "------------------------------"

  echo -e ">>> Compressing image of $pkg"
  time docker save "$imgPatch" | xz > /tmp/$fileNameNormVer.xz
  ls -l /tmp/$fileNameNormVer.xz

  if [ $imgExists == 2 ]; then
    echo -e ">>> Cleaning local image of $pkg"
    docker rmi $imgPatch > /dev/null
  fi

  echo -e ">>> Distributing image of $pkg"
  set -e
  scp -p -P $CD_SSH_PORT /tmp/$fileNameNormVer.xz $CD_SSH_USER@$CD_SSH_HOST:/tmp/
  set +e
  rm /tmp/$fileNameNormVer.xz -f

  echo -e ">>> Loading image of $pkg on deploy"
  cmd="time xz -cd /tmp/$fileNameNormVer.xz | docker load \
    && rm /tmp/$fileNameNormVer.xz -f \
    && echo -e '\\n' \
    && docker image ls | grep -F '$pkgImgNameNorm' | grep -F '$patchVer' | head -n 10"
  echo "cmd: \"$cmd\""
  echo -e "----------------------------"
  set -e
  ssh -p $CD_SSH_PORT $CD_SSH_USER@$CD_SSH_HOST "$cmd"
  set +e
  echo -e "------------------------------"

done
cd $cwd

echo -e "-------------------------------------------"
echo -e "          distribution succeeded "
echo -e "-------------------------------------------\n\n "

