#!/bin/bash
# ---------------------------
# Verify image exists in remote deploy
#
# Used CI Variables:
# - CD_SSH_HOST: hostname or ip, without protocol and port (like gitlab.example.com)
#   https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
# - CD_SSH_PORT: optional, Default 22
# - CD_SSH_PRIVATE_KEY: base64 encoded
# - IMG_COMPRESSION_LEVEL: defined in .gitlab-ci.yml
# ---------------------------


PKG_IMAGE_DEPLOY_EXISTS=""
# ssh -p $CD_SSH_PORT $CD_SSH_USER@$CD_SSH_HOST "docker image ls | grep $pkgImgNameNorm"
ssh -p $CD_SSH_PORT $CD_SSH_USER@$CD_SSH_HOST "docker inspect --format='{{.Id}}' $imgPatch"

if [ "$?" -eq 0 ]; then
  echo -e "Image exists in deploy: $imgPatch"
  PKG_IMAGE_DEPLOY_EXISTS="yes"
fi

