#!/bin/bash
# --------------
# Cancel pipeline jobs having manual status
#
# @usage `./cancel-manual-jobs.sh $ACCESS_TOKEN "$CI_API_V4_URL" $CI_PROJECT_ID $CI_PIPELINE_ID`
# @demo `./cancel-manual-jobs.sh d223a375d4c243926111110b386666 "https://gitlab.com/api/v4" 23 123`
# --------------


echo -e "\n>>> Do cancelling pipeline manual jobs..."

TOKEN=$1
API_URL=$2
PID=$3
PLID=$4

type jq 1>/dev/null
if [ $? != 0 ]; then
  echo -e "jq not callable!"
  echo -e "Download: https://stedolan.github.io/jq/download/"
  echo -e "For win32: copy jq-win64.exe to %windir%/system32/jq.exe"
  exit 1
fi

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
if [ -z $PLID ]; then
  echo -e "Parameter pipeline id EMPTY!"
  exit 1
fi

url="$API_URL/projects/$PID/pipelines/$PLID/jobs?scope[]=manual"
jobList=$( curl -s --header "PRIVATE-TOKEN: $TOKEN" "$url" )
if [ -z "$jobList" ]; then
  echo -e 'Exit with unknown exception!'
  exit 1
fi

errmsg=$( echo $jobList | jq  -r '.message' 2>/dev/null )
if [ -n "$errmsg" ]; then
  echo -e "Error message: $errmsg"
  exit 1
fi

declare -i i=0
while [[ $i < 99 ]]; do
  jid=$( echo $jobList | jq -r ".[$i].id" )
  if [ -z $jid -o $jid == null ]; then
    break
  fi

  info=$( echo $jobList | jq ".[$i]" )
  name=$( echo $info | jq '.name')
  status=$( echo $info | jq '.status')
  stage=$( echo $info | jq '.stage')
  echo Cancel job: {id: $jid, name: $name, status: $status, stage: $stage}

  url="$API_URL/projects/$PID/jobs/$jid/cancel"
  cancelRet=$( curl -s --request POST --header "PRIVATE-TOKEN: $TOKEN" "$url" )
  msg=$( echo $cancelRet | jq -r '.status' )
  echo -e "result: $msg"

  let i++
done

