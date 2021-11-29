#!/bin/bash
# ---------------------------
# Login Docker Repo
# if DOCKER_REG_SERVER and DOCKER_REG_PWD defined
#
# Used CI Variables:
# - DOCKER_REG_SERVER
# - DOCKER_REG_USER
# - DOCKER_REG_PWD
# ---------------------------

DK_CONF="/root/.docker/config.json"

if [ -n "$DOCKER_REG_SERVER" -a -n "$DOCKER_REG_PWD" ]; then
  echo -e ">>> Login docker hub"
  if [ -z $DOCKER_REG_SERVER ]; then
    echo "$DOCKER_REG_PWD" | docker login -u "$DOCKER_REG_USER" --password-stdin
  else
    echo "$DOCKER_REG_PWD" | docker login -u "$DOCKER_REG_USER" --password-stdin $DOCKER_REG_SERVER
  fi
fi

# jq -r ".auths[\"$DOCKER_REG_SERVER\"].auth" $DK_CONF | cut -c 1-6
# jq -r ".auths[\"$DOCKER_REG_SERVER\"].auth" $DK_CONF | cut -c 21-
_TK=$( jq -r ".auths[\"$DOCKER_REG_SERVER\"].auth" $DK_CONF )
echo ${_TK:1:6}..${_TK:21}
_TK=""

#docker info

