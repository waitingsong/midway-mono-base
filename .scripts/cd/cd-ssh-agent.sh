#!/bin/bash
# ---------------------------
# Used CI Variables:
# - CD_SSH_HOST: hostname or ip, without protocol and port (like gitlab.example.com)
# - CD_SSH_PORT: optional, Default 22
# - CD_SSH_PRIVATE_KEY: base64 encoded
# - CD_SSH_USER
# ---------------------------
set -e

CD_SSH_PORT="${CD_SSH_PORT:-22}"

echo -e ">>> Starting ssh-agent..."

mkdir -p ~/.ssh
chmod 700 ~/.ssh

which ssh-agent
eval $(ssh-agent -s)

if [ ! -f ~/.ssh/known_hosts ]; then
  ssh-keyscan -t ed25519 -p $CD_SSH_PORT $CD_SSH_HOST >> ~/.ssh/known_hosts
  cat ~/.ssh/known_hosts
fi

# echo "$CD_SSH_PRIVATE_KEY" | base64 -d -
echo "$CD_SSH_PRIVATE_KEY" | base64 -d - | tr -d '\r' | ssh-add - > /dev/null

