#!/bin/bash

if [ -n "$CI_COMMIT_TAG" ]; then
  authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_TAG | grep Author | cut -d ' ' -f2-)"
else
  authorOfTagOrCommit="$(git rev-list -n 1 --pretty=short $CI_COMMIT_SHA | grep Author | cut -d ' ' -f2-)"
fi

# no indent
iifmt="Id:{{.Id}} {{println}}\
Created: {{.Created}} {{println}}\
RepoDigests: {{range .RepoDigests}}{{println}}  {{.}}{{end}} {{println}}\
RepoTags: {{range .RepoTags}}{{println}}  {{.}}{{end}} {{println}}\
Layers: {{range .RootFS.Layers}}{{println}}  {{.}}{{end}} {{println}}\
Labels: {{range .Config.Labels}}{{println}}  {{.}}{{end}} {{println}}\
"
