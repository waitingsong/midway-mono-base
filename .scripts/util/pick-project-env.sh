#!/bin/bash
# Should under the folder <root>/package.json

if [ ! -f "package.json" ]; then
  echo -e "package.json not exists!, current dir:"
  pwd
  exit 1
fi

pwd

projectVer=$(jq -r '.version' package.json)
projectName=$(jq -r '.name' package.json)
projectPrivate=$(jq -r '.private' package.json)
projectDesc=$(jq -r '.description' package.json)

if [ -z "$projectVer" ]; then
  echo -e "Value of version from package.json invalid!"
  exit 1
fi

if [ -z "$projectName" ]; then
  echo -e "Value of name from package.json empty!"
  exit 1
fi

projectScope=""
if [ "${projectName:0:1}" == "@" ]; then
  projectScope=$(echo "$projectName" | awk -F'/' '{print $1}')
fi


echo -e "\$projectScope: $projectScope"
echo -e "\$projectName: $projectName"
echo -e "\$projectVer: $projectVer"
echo -e "\$projectDesc: $projectDesc"

