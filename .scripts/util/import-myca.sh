#!/bin/bash
# ---------------------------
# Import My CA
#
# Used CI Variables:
# - CA_PUB (optinal): base64 encoded
# ---------------------------

echo '' >> ~/.npmrc

if [ -n "$CA_PUB" ]; then
  echo -e ">>> Importing myca..."
  # echo "$CA_PUB" | base64 -d -
  echo "$CA_PUB" | base64 -d - > /etc/ssl/myca.pem
  export NODE_EXTRA_CA_CERTS="/etc/ssl/myca.pem"
  cat /etc/ssl/myca.pem >> /etc/ssl/certs/ca-certificates.crt
  
  cp ~/.npmrc ~/.npmrc.bak
  npm config set cafile /etc/ssl/certs/ca-certificates.crt
fi

