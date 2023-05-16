#!/bin/bash

# Sets development environment for agency client development

[[ $- == *e* ]] && state=-e || state=+e
set -e

bin=$FCLI
if [ -z "$bin" ]; then
  bin='findy-agent-cli'
fi

echo "Using CLI $bin"

$bin --version || (echo "Please install $bin first.")

new_key=$FCLI_KEY
if [ -z "$new_key" ]; then
  new_key=$($bin new-key)
fi

echo "Using KEY $new_key"

username=$FCLI_USER
if [ -z "$username" ]; then
  username="$(whoami)-$(date +%s)"
fi

echo "Using USER NAME $username"

# Create file with env variables
env=".envrc"

mv $env $env.bak || echo "$env does not exist."

echo "# agency authentication service URL" >>$env
echo "export FCLI_URL='http://localhost:8088'" >>$env

echo "# agency authentication origin" >>$env
echo "export FCLI_ORIGIN='http://localhost:3000'" >>$env

echo "# desired agent user name" >>$env
echo "# note: this should be an unique string within agency context," >>$env
echo "# use for example your email address" >>$env
echo 'export FCLI_USER="'$username'"' >>$env

echo "# desired agent authentication key (create new random key: 'findy-agent-cli new-key')" >>$env
echo "# note: this key authenticates your client to agency, so keep it secret" >>$env
echo 'export FCLI_KEY="'$new_key'"' >>$env

echo "# agency API server" >>$env
echo "export AGENCY_API_SERVER='localhost'" >>$env

echo "# agency API server port" >>$env
echo "export AGENCY_API_SERVER_PORT='50052'" >>$env

# API server address for CLI
echo "# full API server address" >>$env
echo 'export FCLI_SERVER="$AGENCY_API_SERVER:$AGENCY_API_SERVER_PORT"' >>$env

# agency API server cert path
if [ -z "$FCLI_TLS_PATH" ]; then
  mkdir -p "cert/client"
  mkdir -p "cert/server"
  cert_home="https://raw.githubusercontent.com/findy-network/findy-wallet-pwa/master/tools/env/config"
  curl -s -o ./cert/client/client.crt "$cert_home/cert/client/client.crt"
  curl -s -o ./cert/client/client.key "$cert_home/cert/client/client.key"
  curl -s -o ./cert/client/client-pkcs8.key "$cert_home/cert/client/client-pkcs8.key"
  # download public cert
  echo -n | openssl s_client -connect "localhost:50052" -servername "localhost:50052" | openssl x509 >./cert/server/server.crt
  FCLI_TLS_PATH="$PWD/cert"
fi

echo "Using TLS PATH $FCLI_TLS_PATH"
echo "# agency API server TLS cert path" >>$env
echo 'export FCLI_TLS_PATH="'$FCLI_TLS_PATH'"' >>$env

source .envrc

echo "*******************************************"
echo "Web wallet URL (FCLI_ORIGIN): $FCLI_ORIGIN"
echo "Auth server URL (FCLI_URL): $FCLI_URL"
echo "API server address (FCLI_SERVER): $FCLI_SERVER"
echo "TLS cert path (FCLI_TLS_PATH): $FCLI_TLS_PATH"

echo "*******************************************"
echo "Username (FCLI_USER): $username"
echo "Master key (FCLI_KEY): $new_key"
echo "*******************************************"

echo "Environment setup ready for agency client"
echo "The configuration is stored here: $env."
echo "Please use direnv or 'source $env' to recreate environment."
echo "*******************************************"

set "$state"
