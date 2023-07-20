#!/bin/bash
set +e

dirs=".scripts .github"

for dir in $dirs; do
  find $dir -type f -iname "*.sh" -print0 | xargs -0II git update-index --ignore-missing --chmod=+x I
  find $dir -type f -iname "*.mjs" -print0 | xargs -0II git update-index --ignore-missing --chmod=+x I
done

find .githooks -type f -print0 | xargs -0II git update-index --ignore-missing --chmod=+x I

echo "Commit changes if changed!"

set -e

