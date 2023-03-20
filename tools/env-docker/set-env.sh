#!/bin/bash

# Sets development environment for agency client development

set -e

bin=$FCLI
if [ -z "$bin" ]; then
  bin='findy-agent-cli'
fi

echo "Using CLI $bin"

$bin --version || echo "Please install $bin first."

new_key=$FCLI_KEY
if [ -z "$new_key" ]; then
  new_key=$($bin new-key)
fi

echo "Using KEY $new_key"

username=$FCLI_USER
if [ -z "$username" ]; then
  username=$(whoami)
fi

echo "Using USER NAME $username"

# agency API server cert path
# relative to the folder where you run the sample
if [ -z "$FCLI_TLS_PATH" ]; then
  mkdir -p "cert/client"
  mkdir -p "cert/server"
  cert_home="https://raw.githubusercontent.com/findy-network/findy-wallet-pwa/master/tools/env/config/"
  curl -s "$cert_home/cert/client/client.crt" >./cert/client/client.crt
  curl -s "$cert_home/cert/client/client.key" >./cert/client/client.key
  curl -s "$cert_home/cert/server/server.crt" >./cert/server/server.crt
  export FCLI_TLS_PATH='./cert'
fi

echo "Using TLS PATH $FCLI_TLS_PATH"

# agency authentication service URL
export FCLI_URL='http://localhost:8088'

# agency authentication origin
export FCLI_ORIGIN='http://localhost:3000'

# desired agent user name
# note: this should be an unique string within agency context,
# use for example your email address
export FCLI_USER="$username"

# desired agent authentication key (create new random key: 'findy-agent-cli new-key')
# note: this key authenticates your client to agency, so keep it secret
export FCLI_KEY="$new_key"

# agency API server
export AGENCY_API_SERVER='localhost'

# agency API server port
export AGENCY_API_SERVER_PORT='50052'

# API server address for CLI
export FCLI_SERVER="$AGENCY_API_SERVER:$AGENCY_API_SERVER_PORT"

echo "*******************************************"
echo "Web wallet URL (FCLI_ORIGIN): $FCLI_ORIGIN"
echo "Auth server URL (FCLI_URL): $FCLI_URL"
echo "API server address (FCLI_SERVER): $FCLI_SERVER"
echo "TLS cert path (FCLI_TLS_PATH): $FCLI_TLS_PATH"

echo "*******************************************"
echo "Environment setup ready for agency client"
echo "Username (FCLI_USER): $username"
echo "Master key (FCLI_KEY): $new_key"
echo "Please store the username and key for later use."
echo "*******************************************"
