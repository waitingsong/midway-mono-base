#!/bin/bash


fmt="Id:{{.Id}}"

imgPatch="$1"
imgLatest="$2"

imgPatchHash=""
imgLatestHash=""
imgPatchExistsLocal=""
imgLatestExistsLocal=""


echo -e ">>> Whether docker image has latest tag: $imgPatch"
imgPatchHash=$( docker image inspect -f "$fmt" "$imgPatch" 2>/dev/null )
if [ -n "$imgPatchHash" ]; then
  imgPatchExistsLocal="yes"
else
  echo -e "try docker pull image: $imgPatch"
  docker pull --quiet "$imgPatch" 2>/dev/null
  imgPatchHash=$( docker image inspect -f "$fmt" "$imgPatch" 2>/dev/null )
  if [ -z "$imgPatchHash" ]; then
    echo -e "Notice: image NOT exists in hub: $imgPatch"
    return 0
  fi
fi

if [ -z "$imgPatchExistsLocal" ]; then
  docker rmi $imgPatch > /dev/null
fi

imgLatestHash=$( docker image inspect -f "$fmt" "$imgLatest" 2>/dev/null )
if [ -n "$imgLatestHash" ]; then
  imgLatestExistsLocal="yes"
else
  echo -e "try docker pull image: $imgLatest"
  docker pull --quiet "$imgLatest" 2>/dev/null
  imgLatestHash=$( docker image inspect -f "$fmt" "$imgLatest" 2>/dev/null )
  if [ -z "$imgLatestHash" ]; then
    echo -e "Notice: image NOT exists in hub: $imgLatest"
    return 0
  fi
fi

if [ -z "$imgLatestExistsLocal" ]; then
  docker rmi $imgLatest > /dev/null
fi

echo -e "imgPatchHash:  $imgPatchHash"
echo -e "imgLatestHash: $imgLatestHash"

if [ "$imgPatchHash" == "$imgLatestHash" ]; then
  return 1
else
  return 0
fi

