#!/bin/bash
# ---------------------------
# Add sub-package from packages/demo-service
#
# ---------------------------

cwd=`pwd`
PKGS="$cwd/packages"
tplDir="$PKGS/demo-service"
tplName="@scope/demo-service"
svcTitle="midway-server-svc"

pkgFullName="$1"
pkgName="$1"

if [ -z "$pkgFullName" ]; then
  echo -e "Missing package name!"
  echo -e "Command examples: "
  echo -e "  - npm run add:svc service "
  echo -e "  - npm run add:svc @foo/svc "
  echo -e "\n"
  exit 1
fi

pkgScope=""
pkgScopeWoAt=""
if [ "${pkgFullName:0:1}" == "@" ]; then
  pkgScope=$(echo "$pkgFullName" | awk -F'/' '{print $1}')
  pkgScopeWoAt="${pkgScope/#@/}"
  pkgName=$(echo "$pkgFullName" | awk -F'/' '{print $2}')
fi

if [ -z "$pkgName" ]; then
  echo -e "pkgName empty!"
  echo -e "Input: \"$pkgFullName\""
  echo -e "\n"
  exit 1
fi
pkgFullDir="${pkgScopeWoAt}-${pkgName}"

echo -e "-------------------------------------------"
echo -e " Initialize package from tpl $tplName"
echo -e " Name: $pkgFullName "
echo -e " Folder: $pkgFullDir "
echo -e "-------------------------------------------"


# pkgPath="${PKGS}/${pkgName}"
pkgPath="${PKGS}/${pkgFullDir}"

if [ -d "$pkgPath" ]; then
  echo -e "pkg path EXITS!"
  echo -e "path: \"$pkgPath\""
  echo -e "\n"
  exit 1
fi

mkdir -p "$pkgPath"

fReadme="README.md"
f1="package.json"
f2="tsconfig.json"
f4=".editorconfig"
f6="Dockerfile"
f9="src/*.ts"


f03="bootstrap.js"

d1="database"
d2="src/util"
d3="src/middleware"
d4="src/core"
d5="src/config"
d6="src/app/public"
d7="src/app/home"
mkdir -p "$pkgPath/$d1" "$pkgPath/$d2" "$pkgPath/$d3" "$pkgPath/$d4" "$pkgPath/$d5" "$pkgPath/$d6" "$pkgPath/$d7"

echo -e "Copying files to folder: $pkgPath/ ..."
cp "$tplDir/$f1" "$pkgPath/"
cp "$tplDir/$f2" "$pkgPath/"
cp "$tplDir/$f4" "$pkgPath/"
cp "$tplDir/$f6" "$pkgPath/"

cp "$tplDir/$f03" "$pkgPath/"
echo "" >> "$pkgPath/$fReadme"

CMD="$tplDir/$f9 $pkgPath/src/"
cp -a $CMD

# cp -a "$tplDir/$d1" "$pkgPath"
cp -a "$tplDir/$d2" "$pkgPath/src"
cp -a "$tplDir/$d3" "$pkgPath/src"
cp -a "$tplDir/$d4" "$pkgPath/src"
cp -a "$tplDir/$d5" "$pkgPath/src"
cp -a "$tplDir/$d6" "$pkgPath/src/app"
cp -a "$tplDir/$d7" "$pkgPath/src/app"

pkgJson="$pkgPath/package.json"
echo -e "Updating file: $pkgJson"

sed -i "s#$tplName#${pkgFullName}#g" "$pkgJson"
sed -i "s#$svcTitle#${pkgFullName}#g" "$pkgJson"
sed -i "s#\(private.\+\)true#\1false#g" "$pkgJson"
sed -i "s#$pkgScope/docs#$svcTitle#g" package.json
repo=$(git remote get-url origin)
if [ -n "$repo" ]; then
  sed -i "s#\(git+https://\)#${repo}#" "$pkgJson"
fi

testDir="$pkgPath/test"
mkdir -p "$testDir"
t1="tsconfig.json"

t3="setup.ts"
t4="root.config.ts"
t5="00.dummy.test.ts"
t6="01.index.test.ts"
t7="10.home.test.ts"
cp "$tplDir/test/$t1" "$testDir/"

cp "$tplDir/test/$t3" "$testDir/"
cp "$tplDir/test/$t4" "$testDir/"
cp "$tplDir/test/$t5" "$testDir/"
cp "$tplDir/test/$t6" "$testDir/"
cp "$tplDir/test/$t7" "$testDir/"

echo -e "Git add files..."
git add -f -- "$pkgPath"

git commit -nm "chore($pkgName): initialize package $pkgFullName"
echo -e "Git add success\n"


#cp -a "$tplDir/src" "$pkgPath/"
#echo -e "Copying folder src/ done, You should git add files manually!"

npm i
npm run build "$pkgFullName"

echo -e "\nInitialization success. You should git add files under src/ manually!"

echo -e "Packages list:"
lerna list

