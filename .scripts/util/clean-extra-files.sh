#!/bin/bash
# Should called by util/prepare-pkg.sh
# Should under the folder <project>/packages/<some-pkg>/node_modules
# remove files under subfolder
set -e

echo -e ">>> Purging extra files"

find $(find . -type d -iname "@mwcp") -maxdepth 3 -type d -iname "database" -print0 | xargs -0II rm -rf I

# find $(find $(find . -type d -iname "@waiting") -mindepth 2 -maxdepth 2 -type d -name "dist") \
#   -maxdepth 1 -type f -iname "*.esm.*" -print0 | xargs -0II rm -f I
find $(find $(find . -type d -iname "@waiting") -mindepth 2 -maxdepth 2 -type d -name "dist") \
  -maxdepth 1 -type f -iname "*.umd.*" -print0 | xargs -0II rm -f I

find $(find . -type d -iname "ajv") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "ajv") -maxdepth 1 -type d -iname "scripts" -print0 | xargs -0II rm -rf I

# find $(find . -type d -iname "ali-oss") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "joi") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "json5") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "moment") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "moment") -maxdepth 1 -type d -iname "src" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "moment") -maxdepth 1 -type d -iname "min" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "moment-timezone") -maxdepth 1 -type d -iname "builds" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "nunjucks") -maxdepth 1 -type d -iname "browser" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "needle") -maxdepth 1 -type d -iname "examples" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "opentracing") -maxdepth 1 -type d -iname "src" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "src" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "_esm5" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "_esm2015" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "add" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "migrations" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "observable" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "operator" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "testing" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "rxjs") -maxdepth 2 -type d -iname "bundles" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 2 -type d -iname "esm5" -print0 | xargs -0II rm -rf I
# find $(find . -type d -iname "rxjs") -maxdepth 2 -type d -iname "esm" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "rxjs") -maxdepth 2 -type d -iname "types" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "sqlite3") -maxdepth 1 -type d -iname "src" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "sqlite3") -maxdepth 1 -type d -iname "deps" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "sqlite3") -maxdepth 1 -type d -iname "tools" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "sqlite3") -maxdepth 1 -type d -iname "build-tmp-*" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "sqlite3") -maxdepth 1 -type d -iname "build-tmp-napi-v6" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "source-map") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "winston") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I


find $(find . -type d -iname "class-transformer") -maxdepth 1 -type d -iname "esm5" -print0 | xargs -0II rm -rf I
# find $(find . -type d -iname "class-transformer") -maxdepth 1 -type d -iname "esm2015" -print0 | xargs -0II rm -rf I

# find $(find . -type d -iname "dayjs") -maxdepth 1 -type d -iname "esm" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "@protobufjs") -maxdepth 2 -type d -iname "tests" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "protobufjs") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0II rm -rf I
# @grpc/proto-loader/build/src/index.js need this
# find $(find . -type d -iname "protobufjs") -maxdepth 1 -type d -iname "ext" -print0 | xargs -0II rm -rf I

find $(find . -type d -iname "undici") -maxdepth 1 -type d -iname "types" -print0 | xargs -0II rm -rf I


set +e

