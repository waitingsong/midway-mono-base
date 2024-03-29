#!/bin/bash
# Should called by tar.sh and build-images.sh
# Should under the folder <project>/packages/<some-pkg>/node_modules
set -e


find . -mindepth 1 -type d -iname ".midway_bin_cache" -print0 | xargs -P0 -0II rm -rf I
find . -mindepth 3 -type d -iname "docs" -print0 | xargs -P0 -0II rm -rf I

find . -type d -iname "@types" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname ".github" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "benchmarks" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "example" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "man1" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "spec" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "test" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "tests" -print0 | xargs -P0 -0II rm -rf I
find . -type d -iname "build-tmp-*" -print0 | xargs -P0 -0II rm -rf I
# find . -type d -iname "build-tmp-napi-*" -print0 | xargs -P0 -0II rm -rf I


# unlink for image build cache
find . -type f -iname "package-lock.json" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".package-lock.json" -print0 | xargs -P0 -0II rm -f I

find . -type f -iname ".bak" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".coveralls.yml" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".DS_Store" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".dockerignore" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".editorconfig" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".eslint*" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".gitattributes" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".github" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".istanbul.yml" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".jshintrc" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".jscs.json" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".jscsrc" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".name" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".npmignore" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".nycrc" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".prettierrc*" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".travis.yml" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname ".tslint*" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "appveyor.yml" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "docker-compose.yml" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "Dockerfile" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "donate.png" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "example.png" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "flake.lock" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "float.patch" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "CHANGELOG*" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "CHANGELOG.rst" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "Makefile" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "test.js" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "yarn.lock" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "*.markdown" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "*.md" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "*.swp" -print0 | xargs -P0 -0II rm -f I

# gyp
find . -type f -iname "binding.gyp" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "config.gypi" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "binding.Makefile" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "addon.o.d" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "addon.target.mk" -print0 | xargs -P0 -0II rm -f I

find . -type f -iname "*.html" -not -path "./koa-onerror/templates/*" -print0 | xargs -P0 -0II rm -f I

find . -type f -iname "*.d.ts" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "*.d.ts.map" -print0 | xargs -P0 -0II rm -f I
find . -type f -iname "*.d.cts" -print0 | xargs -P0 -0II rm -f I

find . -type f -iname "LICENCE*" -print0 | xargs -P0 -0II gzip I
find . -type f -iname "LICENSE*" -print0 | xargs -P0 -0II gzip I

cd ../

set +e

