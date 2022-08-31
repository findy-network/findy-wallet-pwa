#!/bin/bash

# Script configuration with env variables:
# E2E_USER: when defined, new user onboarding is skipped
# E2E_ORG: when defined, new organisation onboarding is skipped
# E2E_KEY: needed when using either of latter - agent key
# E2E_CRED_DEF_ID: when defined, cred def creation is skipped (needs E2E_ORG)

# Use when testing with remote host:
# AGENCY_URL
# AGENCY_API_URL
# AGENCY_TLS_PATH

set -e

read_timeout="60s"
timestamp=$(date +%s)
register_wait_time=$AGENCY_REGISTER_WAIT_TIME
if [ -z "$register_wait_time" ]; then
  register_wait_time=1
fi

user=$E2E_USER
existing="true"
if [ -z "$user" ]; then
  echo "User not defined, creating new..."
  user="user-$timestamp"
  existing="false"
fi

org=$E2E_ORG
if [ -z "$org" ]; then
  echo "Organisation not defined, creating new..."
  org="org-$timestamp"
fi

bot_file="./e2e/e2e-sa.yaml"

echo "::add-mask::$user"
echo "::add-mask::$org"

auth_url=$AGENCY_URL
if [ -z "$auth_url" ]; then
  auth_url="http://localhost:8088"
fi
auth_origin=$AGENCY_URL
if [ -z "$auth_origin" ]; then
  auth_origin="http://localhost:3000"
fi
grpc_server=$AGENCY_API_URL
if [ -z "$grpc_server" ]; then
  grpc_server="localhost:50052"
fi
tls_path=$AGENCY_TLS_PATH
if [ -z "$tls_path" ]; then
  tls_path="./tools/env/config/cert"
fi

default_key=$E2E_KEY
if [ -z "$default_key" ]; then
  default_key=$(findy-agent-cli new-key)
fi

echo "Running e2e test for $auth_url (origin: $auth_origin, api: $grpc_server)"

# register web wallet user
if [ -z "$E2E_USER" ]; then
  echo "Register user $user"
  findy-agent-cli authn register \
      -u $user \
      --url $auth_url \
      --origin $auth_origin \
      --key $default_key
fi

# login web wallet user
echo "Login user $user"
jwt=$(findy-agent-cli authn login \
    -u $user \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key)

# register org agent
if [ -z "$E2E_ORG" ]; then
  echo "Register org $org"
  if [ -z "$E2E_ORG_SEED" ]; then
    findy-agent-cli authn register \
        -u $org \
        --url $auth_url \
        --origin $auth_origin \
        --key $default_key
  else
    findy-agent-cli authn register \
        -u $org \
        --url $auth_url \
        --origin $auth_origin \
        --key $default_key \
        --seed $E2E_ORG_SEED
  fi
  # wait for onboard transaction to be written to ledger
  sleep $register_wait_time
fi

# login org
echo "Login org $org"
org_jwt=$(findy-agent-cli authn login \
    -u $org \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key)

# create invitation
echo "Create invitation for organisation"
invitation=$(findy-agent-cli agent invitation \
    --tls-path $tls_path --server $grpc_server \
    --label $org \
    --jwt $org_jwt)

echo $invitation > ./e2e/e2e.invitation.json
connection_id=$(node -pe "require('./e2e/e2e.invitation.json')['@id']")
echo "::add-mask::$connection_id"
echo "Invitation created with connection id $connection_id"

cred_def_id=$E2E_CRED_DEF_ID
if [ -z "$E2E_CRED_DEF_ID" ]; then
  # create schema
  echo "Create schema"
  sch_id=$(findy-agent-cli agent create-schema \
      --tls-path $tls_path --server $grpc_server \
      --jwt $org_jwt --name="email" --version=1.0 email)
  echo "::add-mask::$sch_id"

  # read schema - make sure it's found in ledger
  echo "Read schema"
  schema=$(findy-agent-cli agent get-schema \
      --tls-path $tls_path --server $grpc_server \
      --jwt $org_jwt --schema-id $sch_id --timeout $read_timeout)

  echo "Schema read successfully: $schema"

  # create cred def
  echo "Create cred def with schema id $sch_id"
  cred_def_id=$(findy-agent-cli agent create-cred-def \
      --tls-path $tls_path --server $grpc_server \
      --jwt $org_jwt --id $sch_id --tag $org)
  echo "::add-mask::$cred_def_id"

  # read cred def - make sure it's found in ledger
  echo "Read cred def"
  cred_def=$(findy-agent-cli agent get-cred-def \
      --tls-path $tls_path --server $grpc_server \
      --jwt $org_jwt --id $cred_def_id --timeout $read_timeout)

  echo "Cred def read successfully: $cred_def"
fi

# store details for testing
echo {\"jwt\": \"$jwt\", \"user\": \"$user\", \"existing\": $existing, \"organisation\": \"$org\", \"key\": \"$default_key\", \"credDefId\": \"$cred_def_id\" } > ./e2e/e2e.user.json

# store cred def id to bot template
cat "$bot_file".template > "$bot_file"
sub_cmd='{sub("<CRED_DEF_ID>","'$cred_def_id'")}1'
awk "$sub_cmd" "$bot_file" > "$bot_file".tmp && \
		mv "$bot_file".tmp "$bot_file"

# start bot in background
echo "Starting bot with connection $connection_id"
findy-agent-cli bot start \
    --tls-path $tls_path --server $grpc_server \
    --jwt $org_jwt \
    --conn-id $connection_id ./e2e/e2e-sa.yaml &
echo "Bot started"
