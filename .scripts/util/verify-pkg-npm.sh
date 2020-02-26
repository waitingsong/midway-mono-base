#!/bin/bash
# Verify pkg exists in NPM reg


pkg=$1
if [ -z $pkg ]; then
  echo -e "pkg EMPTY!"
  exit 1
fi

PKG_NPM_EXISTS=""

echo -e "try npm inspect :"
# tarball=$( npm view foo@v6.140.10 dist.tarball )
tarball=$( npm view $pkg dist.tarball 2>/dev/null )

if [ "$?" -eq 0 -o -n "$tarball" ]; then
  PKG_NPM_EXISTS="yes"
fi

