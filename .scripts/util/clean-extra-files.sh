#!/bin/bash
# Should called by util/prepare-pkg.sh
# Should under the folder <project>/packages/<some-pkg>/node_modules
# remove files under subfolder

echo -e ">>> Purging extra files"

find $(find $(find . -type d -iname "@waiting") -mindepth 2 -maxdepth 2 -type d -name "dist") \
  -maxdepth 1 -type f -iname "*.esm.*" -print0 | xargs -0i rm -f {}
find $(find $(find . -type d -iname "@waiting") -mindepth 2 -maxdepth 2 -type d -name "dist") \
  -maxdepth 1 -type f -iname "*.umd.*" -print0 | xargs -0i rm -f {}

# Delete all .d.ts files
# find . -type f -iname "*.d.ts" -print0 | xargs -0i rm -f {}

find $(find . -type d -iname "source-map") -maxdepth 1 -type d -iname "dist" -print0 | xargs -0i rm -rf {}

find $(find . -type d -iname "moment") -maxdepth 1 -type d -iname "src" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "moment") -maxdepth 1 -type d -iname "min" -print0 | xargs -0i rm -rf {}

find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "src" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "_esm5" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "_esm2015" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "add" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "bundles" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "migrations" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "observable" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "operator" -print0 | xargs -0i rm -rf {}
find $(find . -type d -iname "rxjs") -maxdepth 1 -type d -iname "testing" -print0 | xargs -0i rm -rf {}

find $(find . -type d -iname "moment-timezone") -maxdepth 1 -type d -iname "builds" -print0 | xargs -0i rm -rf {}

find $(find . -type d -iname "nunjucks") -maxdepth 1 -type d -iname "browser" -print0 | xargs -0i rm -rf {}

return 0

