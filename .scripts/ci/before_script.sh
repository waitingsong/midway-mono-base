#!/bin/bash
set -e

free -m
df -hT
ls -l

if [ -d packages ]; then
  du -sh packages/*
fi

source .scripts/util/alias.sh
sh .scripts/util/check-env.sh
source .scripts/ci/ci-env.sh
source .scripts/ci/ci-prepare.sh
source .scripts/util/import-myca.sh

.scripts/ci/ci-prepare-node.sh

