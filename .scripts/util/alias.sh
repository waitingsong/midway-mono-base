#!/bin/bash



# no indent
export iifmt="Id:{{.Id}} {{println}}\
Created: {{.Created}} {{println}}\
Size: {{ .Size }} {{println}}\
RepoDigests: {{range .RepoDigests}}{{println}}  {{.}}{{end}} {{println}}\
RepoTags: {{range .RepoTags}}{{println}}  {{.}}{{end}} {{println}}\
Layers: {{range .RootFS.Layers}}{{println}}  {{.}}{{end}} {{println}}\
Labels: {{range .Config.Labels}}{{println}}  {{.}}{{end}} {{println}}\
"

export iifmtId="Id:{{.Id}} {{println}}"

export iifmtSize="Size:{{.Size}} {{println}}"

export iifmtIdRepoTags="Id:{{.Id}} {{println}}\
RepoTags: {{range .RepoTags}}{{println}}  {{.}}{{end}} {{println}}\
"

