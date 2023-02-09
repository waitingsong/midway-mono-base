#!/bin/bash
# --------------
# pipeline trigger to pack app
#
# @usage `./trigger-publish-completed.sh $CI_PUBLISH_COMPLETED_TOKEN "$CI_API_V4_URL" $CI_PROJECT_ID $tagVer`
# @demo `./trigger-publish-completed.sh d223a375d4c243926111110b386666 "https://gitlab.com/api/v4" 23 v1.2.3`
# --------------


echo -e "\n>>> Do triggering pack pipeline..."

TOKEN=$1
API_URL=$2
PID=$3
REF_NAME=$4

if [ -z $TOKEN ]; then
  echo -e "Parameter TOKEN for pipeline trigger EMPTY!"
  exit 1
fi
if [ -z "$API_URL" ]; then
  echo -e "Parameter URL for pipeline trigger EMPTY!"
  exit 1
fi
if [ -z $PID ]; then
  echo -e "Parameter project id for pipeline trigger EMPTY!"
  exit 1
fi
if [ -z "$REF_NAME" ]; then
  echo -e "Parameter REF_NAME for pipeline trigger EMPTY!"
  exit 1
fi

#curl -X POST -s \
#  -F token=$TOKEN \
#  -F "ref=$REF_NAME" \
#  -F "variables[CI_PUBLISH_COMPLETED]=true" \
#  https://gitlab.com/api/v4/projects/23/trigger/pipeline

turl="$API_URL/projects/$PID/trigger/pipeline"
curl -X POST -s \
  -F token=$TOKEN \
  -F "ref=$REF_NAME" \
  -F "variables[CI_PUBLISH_COMPLETED]=true" \
  $turl

echo -e "\n"

