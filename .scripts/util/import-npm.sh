#!/bin/bash
# ---------------------------
# Import npm auth token
#
# Used CI Variables:
# - NPM_TOKEN
# ---------------------------

echo '' >> ~/.npmrc

echo -e ">>> Importing npm auth token..."
if [ "$NPM_TOKEN" ]; then
  # echo "//nexus.foo.com/repository/mynpm/:_authToken=NpmToken.bar..." >> ~/.npmrc
  # or
  # echo "_auth=base64..." >> ~/.npmrc
  echo "$NPM_TOKEN" | base64 -d >> ~/.npmrc
else
  echo -e "-------------------------------------------"
  echo -e "Value of NPM_TOKEN empty!"
  echo -e "Or check the release branch is Protected Branche if NPM_TOKEN is protected"
  echo -e "-------------------------------------------"
  exit 1
fi
# cat ~/.npmrc

