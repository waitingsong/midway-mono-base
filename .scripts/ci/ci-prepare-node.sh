#!/bin/bash
set -e


npm config set registry "$NPM_REGISTRY"
npm config set disturl "$NPM_DIST"
npm root -g
node -v
npm -v

