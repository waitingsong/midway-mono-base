#!/bin/bash
set -e

T1=$(echo "$CI_COMMIT_MESSAGE" | awk -F' ' '{print $1}')
if [[ "$T1" == "Merge" || "$T1" == "Rvert" ]]; then
  exit 0
fi


if [ -f "/usr/local/bin/commitlint" ]; then
  if [ -f "commitlint.config.js" ]; then
    cp -f commitlint.config.js /usr/local/lib/node_modules/@commitlint/config-conventional
  fi
  cd /usr/local/lib/node_modules/@commitlint/config-conventional
  echo "$CI_COMMIT_MESSAGE" | /usr/local/bin/commitlint
  cd -
else
  echo "$CI_COMMIT_MESSAGE" | commitlint
fi

