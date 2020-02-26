#!/bin/bash
# Verify image exists in local or remote
# return code:
# - 0: image not exists local or remote
# - 1: image exists in local
# - 2: image exists in remote


echo -e "try docker inspect image:"
docker image inspect -f "$iifmt" "$imgPatch" 2>/dev/null
if [ "$?" -eq 0 ]; then
  echo -e "Image exists in local: $imgPatch"
  return 1
fi

echo -e "try docker pull image:"
docker pull --quiet "$imgPatch" 2>/dev/null
if [ "$?" -eq 0 ]; then
  echo -e "Image exists in hub: $imgPatch"
  return 2
fi

return 0

