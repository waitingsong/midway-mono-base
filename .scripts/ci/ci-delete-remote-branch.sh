#!/bin/bash
# --------------
# Delete remote branch
#
# @usage `./ci-delete-remote-branch.sh $ACCESS_TOKEN "$CI_API_V4_URL" $CI_PROJECT_ID <branch name>`
# @demo `./ci-delete-remote-branch.sh d223a375d4c243926111110b386666 "https://gitlab.com/api/v4" 23 release`
# --------------


TOKEN=$1
API_URL=$2
PID=$3
BRANCH=$4

echo -e "\n>>> Do deleting remote branch \"$BRANCH\"..."

if [ -z $TOKEN ]; then
  echo -e "Parameter ACESS TOKEN EMPTY!"
  exit 1
fi
if [ -z "$API_URL" ]; then
  echo -e "Parameter URL EMPTY!"
  exit 1
fi
if [ -z $PID ]; then
  echo -e "Parameter project id EMPTY!"
  exit 1
fi
if [ -z $BRANCH ]; then
  echo -e "Parameter branch id EMPTY!"
  exit 1
fi

#curl --request DELETE
#  --header "PRIVATE-TOKEN: $TOKEN"
#  https://gitlab.example.com/api/v4/projects/23/repository/branches/newbranch

turl="$API_URL/projects/$PID/repository/branches/$BRANCH"
curl -s --request DELETE \
  --header "PRIVATE-TOKEN: $TOKEN" \
  $turl

echo -e "\n"

