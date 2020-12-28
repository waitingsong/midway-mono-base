#!/bin/bash
# ---------------------------
# Collect, merge and print coverage summary so that GitLab CI can parse the coverage number
# from a string like "Statements   : 100% ( 135/135 )"
#
# ---------------------------

echo -e "-------------------------------------------"
echo -e "      Collecting coverages process"
echo -e "-------------------------------------------"

cwd=`pwd`

tmpCovDir="$cwd/tmp.coverage"

rm "$cwd/.nyc_output" -rf
rm "$cwd/coverage" -rf
mkdir "$tmpCovDir" -p
rm "$tmpCovDir/*" -rf

pkgs=`find packages -maxdepth 1 -mindepth 1`

source "${cwd}/.scripts/util/pick-project-env.sh"

for pkg in $pkgs
do
  name=$(echo "$pkg" | awk -F'/' '{print $2}')
  if [ "$name" == "demo-docs" ]; then
    continue
  fi

  cd "$cwd/$pkg"
  if [ ! -f "package.json" ]; then
    continue
  fi

  source "${cwd}/.scripts/util/pick-pkg-env.sh"

  # 非框架测试时跳过 demo 前缀子包
  if [ "$projectName" != "midway-mono-base" ]; then
    namePrefix=$(echo "$name" | awk -F'-' '{print $1}')
    # demo-service or demo
    if [ "$namePrefix" == "demo"  ]; then
      echo -e "skip demo pkg: \"$name\""
      continue
    fi
  fi

  covFile="coverage-final.json"
  if [ ! -d "coverage" -o ! -f "coverage/$covFile" ]; then
    continue
  fi

  cp "coverage/$covFile" "$tmpCovDir/${fileNameNorm}.json"

done # for loop done

cd "$cwd"

echo -e "Merging coverages..."
nyc merge "$tmpCovDir" "$cwd/.nyc_output/merged-coverage.json"

echo -e "Project Coverage Summary:\n"
nyc report --report-dir "$cwd/coverage" --reporter=text-summary --reporter=html --reporter=json --reporter=cobertura

rm "$tmpCovDir" -rf


echo -e "-------------------------------------------"
echo -e "      Collecting coverages succeeded"
echo -e "-------------------------------------------\n\n "

