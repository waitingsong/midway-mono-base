#!/bin/bash
# Should called by util/prepare-pkg.sh
# Should under the folder <project>/packages/<some-pkg>/node_modules
# remove files under subfolder

# opentelemetry
echo -e ">>> Purging extra files: otel"

# opentelemetry
find $(find . -type d -iname "@opentelemetry") -maxdepth 3 -type d -iname "esm" -print0 | xargs -0II rm -rf I
find $(find . -type d -iname "@opentelemetry") -maxdepth 3 -type d -iname "esnext" -print0 | xargs -0II rm -rf I

# find $(find . -type d -iname "@opentelemetry") -maxdepth 1 -type d -iname "exporter-zipkin" -print0 | xargs -0II rm -rf I
# find $(find . -type d -iname "@opentelemetry") -maxdepth 1 -type d -iname "propagator-b3" -print0 | xargs -0II rm -rf I
# find $(find . -type d -iname "@opentelemetry") -maxdepth 1 -type d -iname "propagator-jaeger" -print0 | xargs -0II rm -rf I
# find . -type d -iname "jaeger-client" -print0 | xargs -0II rm -rf I

find $(find $(find . -type d -iname "@grpc") -maxdepth 1 -type d -name "grpc-js") \
  -maxdepth 1 -type d -iname "src" -print0 | xargs -0II rm -rf I


