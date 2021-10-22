#!/bin/bash
set -e

T1=$(echo "$CI_COMMIT_MESSAGE" | awk -F' ' '{print $1}')
if [[ "$T1" == "Merge" || "$T1" == "Rvert" ]]; then
  exit 0
fi

if [ -f "/usr/local/bin/commitlint" ]; then
  echo "$CI_COMMIT_MESSAGE" | /usr/local/bin/commitlint
else
  echo "$CI_COMMIT_MESSAGE" | commitlint
fi

