#!/bin/sh
#
# 初始化 git 项目
# 执行完毕后自动删除本文件
#
# Author: waiting
# Date: 2021.03.06
#

sed -i '/^## 创建新项目/,+46 d' README.md
git add README.md
git commit -m "chore: clean"

sed -i 's#\(lerna run build\)#\1 --ignore @scope/*#g' .scripts/build.sh
sed -i 's#\(lerna run lint\s\+\)#\1 --ignore @scope/*#g' .scripts/lint.sh
sed -i 's#\(lerna run lint:\w\+\)#\1 --ignore @scope/*#g' .scripts/lint-no-fix.sh
sed -i 's#\(lerna run lint:\w\+\)#\1 --ignore @scope/*#g' .scripts/lint-no-fix-s.sh
sed -i 's#\(lerna run test\)#\1 --ignore @scope/*#g' .scripts/test.sh
sed -i 's#\(lerna run cov\)#\1 --ignore @scope/*#g' .scripts/cov.sh

git add .scripts/build.sh .scripts/lint.sh .scripts/lint-no-fix.sh .scripts/lint-no-fix-s.sh .scripts/test.sh  .scripts/cov.sh
git commit -m "chore: initialize"

rm -- "$0" && git add "$0" && git commit -m "chore: clean"

