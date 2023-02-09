#!/bin/bash
set +e

ratio="${1:-100}"

imgGC=$(( ( RANDOM % $ratio )  + 1 ))

if [ $imgGC == 1 ]; then
  docker image prune -f
fi

set -e

