#!/bin/bash
# Should called by tar.sh and build-images.sh
# Should under the folder <project>/packages/<some-pkg>

pwd

if [ ! -f "package.json" ]; then
  echo -e "package.json not exists!"
  exit 1
fi

echo -e ">>> Npm installing"
# remove the pkg symlink created by lerna
rm node_modules -rf
npm i --prod --no-audit --no-optional --legacy-peer-deps

# Note: file link not works under windows properly
#echo -e ">>> Npm deduping"
#npm ddp --no-audit

echo -e ">>> Purging"
cd node_modules

find . -mindepth 3 -type d -iname "docs" -print0 | xargs -0i rm -rf {}
find . -type d -iname "example" -print0 | xargs -0i rm -rf {}
find . -type d -iname "test" -print0 | xargs -0i rm -rf {}
find . -type d -iname "tests" -print0 | xargs -0i rm -rf {}

# unlink for image build cache
find . -type f -iname "package-lock.json" -print0 | xargs -0i rm -f {}

find . -type f -iname ".coveralls.yml" -print0 | xargs -0i rm -f {}
find . -type f -iname ".DS_Store" -print0 | xargs -0i rm -f {}
find . -type f -iname ".dockerignore" -print0 | xargs -0i rm -f {}
find . -type f -iname ".editorconfig" -print0 | xargs -0i rm -f {}
find . -type f -iname ".eslint*" -print0 | xargs -0i rm -f {}
find . -type f -iname ".github" -print0 | xargs -0i rm -f {}
find . -type f -iname ".jshintrc" -print0 | xargs -0i rm -f {}
find . -type f -iname ".jscs.json" -print0 | xargs -0i rm -f {}
find . -type f -iname ".jscsrc" -print0 | xargs -0i rm -f {}
find . -type f -iname ".npmignore" -print0 | xargs -0i rm -f {}
find . -type f -iname ".prettierrc*" -print0 | xargs -0i rm -f {}
find . -type f -iname ".travis.yml" -print0 | xargs -0i rm -f {}
find . -type f -iname ".tslint*" -print0 | xargs -0i rm -f {}
find . -type f -iname "appveyor.yml" -print0 | xargs -0i rm -f {}
find . -type f -iname "docker-compose.yml" -print0 | xargs -0i rm -f {}
find . -type f -iname "CHANGELOG*" -print0 | xargs -0i rm -rf {}
find . -type f -iname "Makefile" -print0 | xargs -0i rm -f {}
find . -type f -iname "yarn.lock" -print0 | xargs -0i rm -f {}
find . -type f -iname "*.markdown" -print0 | xargs -0i rm -f {}
find . -type f -iname "*.md" -print0 | xargs -0i rm -f {}
find . -type f -iname "*.swp" -print0 | xargs -0i rm -f {}

find . -type f -iname "*.html" -not -path "./koa-onerror/templates/*" -print0 | xargs -0i rm -f {}

find . -type f -iname "*.d.ts" -print0 | xargs -0i rm -f {}

find . -type f -iname "LICENCE*" -print0 | xargs -0i gzip {}
find . -type f -iname "LICENSE*" -print0 | xargs -0i gzip {}

source "${cwd}/.scripts/util/clean-extra-files.sh"

cd ../

