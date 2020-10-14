#!/bin/bash

CURRENT_DIR=$(dirname "$BASH_SOURCE")

set +e

docker stop findy-wallet-pwa-dev-proxy
docker rm findy-wallet-pwa-dev-proxy

set -e

docker run -d -v "$PWD/$CURRENT_DIR"/envoy.yaml:/etc/envoy/envoy.yaml:ro \
    -p 8080:8080 -p 9901:9901 --name findy-wallet-pwa-dev-proxy envoyproxy/envoy:v1.15.0

node "$CURRENT_DIR"/server.js
