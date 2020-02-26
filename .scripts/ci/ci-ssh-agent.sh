#!/bin/bash
# ---------------------------
# Used Predefined Variables:
# - CI_SERVER_HOST: hostname or ip, without protocol and port (like gitlab.example.com)
#   https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
#
# Used CI Variables:
# - CI_SSH_PORT (optional): Default 22
# - CI_SSH_PRIVATE_KEY: base64 encoded
# ---------------------------
set -e

CI_SSH_PORT="${CI_SSH_PORT:-22}"

echo -e ">>> Starting ssh-agent..."
mkdir -p ~/.ssh
chmod 700 ~/.ssh

which ssh-agent
eval $(ssh-agent -s)

ssh-keyscan -t ed25519 -p $CI_SSH_PORT $CI_SERVER_HOST >> ~/.ssh/known_hosts
cat ~/.ssh/known_hosts

# echo "$CI_SSH_PRIVATE_KEY" | base64 -d -
echo "$CI_SSH_PRIVATE_KEY" | base64 -d - | tr -d '\r' | ssh-add - > /dev/null

git config user.email "$GITLAB_USER_EMAIL"
git config user.name "$GITLAB_USER_NAME"
git remote set-url origin git@$CI_SERVER_HOST:$CI_PROJECT_PATH.git
git remote -v
# git checkout "$CI_COMMIT_REF_NAME"
# git remote update

set +e

