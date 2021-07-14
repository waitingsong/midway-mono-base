#!/bin/bash
set -e

T1=$(echo "$CI_COMMIT_MESSAGE" | awk -F' ' '{print $1}')
if [[ "$T1" == "Merge" || "$T1" == "Rvert" ]]; then
  exit 0
fi

echo "$CI_COMMIT_MESSAGE" | /usr/local/bin/commitlint

