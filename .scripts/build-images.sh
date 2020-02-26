#!/bin/bash
# ---------------------------
# Build images
#
# Used CI Variables:
# - DOCKER_REG_SERVER
# - DOCKER_REG_USER
# - DOCKER_REG_PWD
# - NODE_BASE_IMAGE
# ---------------------------

echo -e "-------------------------------------------"
echo -e "      images build and push process "
echo -e "-------------------------------------------"

cwd=`pwd`
source "$cwd/.scripts/ci/ci-env.sh"
# echo $authorOfTagOrCommit
echo -e "CI_JOB_MANUAL: $CI_JOB_MANUAL"
echo -e "base img: $NODE_BASE_IMAGE"
echo "--------------\n\n"

if [ -z "$CI_COMMIT_TAG" -a -z "$CI_COMMIT_SHORT_SHA" ]; then
  echo -e 'Both $CI_COMMIT_TAG and $CI_COMMIT_SHORT_SHA are empty!'
  exit 1
fi

if [ -z "$DOCKER_REG_USER" ]; then
  echo -e '$DOCKER_REG_USER undefined!'
  exit 1
fi
if [ -z "$DOCKER_REG_PWD" ]; then
  echo -e '$DOCKER_REG_PWD undefined!'
  exit 1
fi

docker info

pkgs=`find packages -maxdepth 1 -mindepth 1`
globalIgnoreFile="$cwd/.dockerignore"
imgGC=$(( ( RANDOM % 10 )  + 1 ))

echo -e ">>> Login docker hub"
if [ -z $DOCKER_REG_SERVER ]; then
  echo "$DOCKER_REG_PWD" | docker login -u "$DOCKER_REG_USER" --password-stdin
else
  echo "$DOCKER_REG_PWD" | docker login -u "$DOCKER_REG_USER" --password-stdin $DOCKER_REG_SERVER
fi


for pkg in $pkgs
do
  name=$(echo "$pkg" | awk -F'/' '{print $2}')
  if [ "$name" == "demo-docs" -o "$name" == "demo-service" ]; then
    continue
  fi

  cd "$cwd/$pkg"
  if [ ! -f "package.json" -o ! -f "Dockerfile" ]; then
    continue
  fi

  echo -e " \n\n-------------------------------------------"
  source "${cwd}/.scripts/util/pick-pkg-env.sh"

  echo -e ">>> Verifing image of $pkg if exists in remote"
  source "${cwd}/.scripts/util/verify-pkg-image.sh"
  imgExists=$?
  if [ $imgExists == 2 ]; then
    echo "Image of $pkg exists in remote, skip building."
    continue
  elif [ $imgExists == 1 ]; then
    echo "Image of $pkg exists in local, push to remote."
    docker push $imgPatch > /dev/null
    if [ $? != 0 ]; then
      echo "Push image failed: $imgPatch"
      exit 1
    fi
    continue
  fi


  set -e
  cd "$pkgBuildTmpDir"
  sh "${cwd}/.scripts/util/download-npm-pkg.sh" "$pkgName@$pkgVer" "$fileNameNormVer.tgz"
  cd "$pkgBuildTmpDir/package"
  source "${cwd}/.scripts/util/prepare-pkg.sh"
  echo "------------------"
  du -sh *
  echo "------------------"
  sh "${cwd}/.scripts/ci/ci-split-pkg-deps.sh" $pkgScope

  if [ ! -f ".dockerignore" ]; then
    cp "$globalIgnoreFile" ./.dockerignore
  fi

  if [ -n "$CI_COMMIT_TAG" ]; then
    # ga
    echo -e ">>> Building image of $pkg"
    docker build \
      --build-arg baseImage="$NODE_BASE_IMAGE" \
      --label baseImage="$NODE_BASE_IMAGE" \
      --label publisher="$authorOfTagOrCommit" \
      --label pkgName="$pkgName" \
      --label pkgImgNameNorm="$pkgImgNameNorm" \
      --label pkgVer="$pkgVer" \
      --label fileNameNormVer="$fileNameNormVer" \
      -t "$imgPatch" ./

    echo -e ">>> Tagging image of $pkg"
    docker tag "$imgPatch" "$imgLatest"
    docker tag "$imgPatch" "$imgMajor"
    docker tag "$imgPatch" "$imgMinor"

    echo -e ">>> Pushing image of $imgPatch"
    docker push $imgPatch | cat

    echo -e ">>> Pushing image of $imgMinor"
    docker push $imgMinor | cat

    echo -e ">>> Pushing image of $imgMajor"
    docker push $imgMajor | cat

    echo -e ">>> Pushing image of $imgLatest"
    docker push $imgLatest | cat
  else
    # rc
    echo -e ">>> Building image of $pkg"
    docker build \
      --build-arg baseImage="$NODE_BASE_IMAGE" \
      --label baseImage="$NODE_BASE_IMAGE" \
      --label publisher="$authorOfTagOrCommit" \
      --label pkgName="$pkgName" \
      --label pkgImgNameNorm="$pkgImgNameNorm" \
      --label pkgVer="$pkgVer" \
      --label fileNameNormVer="$fileNameNormVer" \
      -t "$imgPatch" ./

    echo -e ">>> Pushing image of $imgPatch"
    docker push $imgPatch | cat
  fi

  echo -e "----------------------------"
  docker image ls "$imgPatch"
  echo -e ""
  docker image inspect -f "$iifmt" "$imgPatch"
  echo -e "------------------------------"

  set +e

  echo -e ">>> Cleaning local image of $pkg"
  # keep image for next build cache
  # docker rmi $imgPatch
  if [ -n "$CI_COMMIT_TAG" ]; then
    docker rmi $imgMajor > /dev/null
    docker rmi $imgMinor > /dev/null
    docker rmi $imgLatest > /dev/null
  fi
  rm "$pkgBuildTmpDir" -rf
done

if [ $imgGC == 1 ]; then
  docker image prune -f
  # docker system prune -f
fi

cd $cwd

echo -e "-------------------------------------------"
echo -e "      images build and push succeeded"
echo -e "-------------------------------------------\n\n "

