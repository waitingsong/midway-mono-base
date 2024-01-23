#!/bin/bash
# ---------------------------
# Add sub-package from packages/demo-docs
#
# ---------------------------

cwd=`pwd`
PKGS="$cwd/packages"
tplDir="$PKGS/demo-docs"
tplName="@scope/docs"

pkgFullName="$1"
pkgName="$1"

if [ -z "$pkgFullName" ]; then
  echo -e "Missing package name!"
  echo -e "Command examples: "
  echo -e "  - npm run add:types types "
  echo -e "  - npm run add:types @foo/types "
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

f01=".eslintrc.yml"

echo -e "Copying files to folder: $pkgPath/ ..."
cp "$tplDir/$f1" "$pkgPath/"
cp "$tplDir/$f2" "$pkgPath/"
cp "$tplDir/$f4" "$pkgPath/"
cp "$tplDir/$f01" "$pkgPath/"
echo "" >> "$pkgPath/$fReadme"

pkgJson="$pkgPath/package.json"
echo -e "Updating file: $pkgJson"

sed -i "s#$tplName#${pkgFullName}#g" "$pkgJson"
sed -i "s#\(private.\+\)true#\1false#g" "$pkgJson"
repo=$(git remote get-url origin)
if [ -n "$repo" ]; then
  sed -i "s#\(git+https://\)#${repo}#" "$pkgJson"
fi

testDir="$pkgPath/test"
mkdir -p "$testDir"
t1="tsconfig.json"
t2=".eslintrc.yml"
t3="setup.ts"
t4="root.config.ts"
t5="00.dummy.test.ts"
t6="01.index.test.ts"
cp "$tplDir/test/$t1" "$testDir/"
cp "$tplDir/test/$t2" "$testDir/"
cp "$tplDir/test/$t3" "$testDir/"
cp "$tplDir/test/$t4" "$testDir/"
cp "$tplDir/test/$t5" "$testDir/"
cp "$tplDir/test/$t6" "$testDir/"

echo -e "Git add files..."
git add -f -- "$pkgPath"

git commit -nm "chore($pkgName): initialize package $pkgFullName"
echo -e "Git add success\n"


cp -a "$tplDir/src" "$pkgPath/"
echo -e "Copying folder src/ done, You should git add files manually!"

npm i
npm run build "$pkgFullName"

echo -e "\nInitialization success. You should git add files under src/ manually!"

echo -e "Packages list:"
lerna list

