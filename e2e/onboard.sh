#!/bin/bash

set -e

read_timeout="60s"
timestamp=$(date +%s)

user=user-$timestamp
org=org-$timestamp
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

default_key=$(findy-agent-cli new-key)

echo "Running e2e test for $auth_url (origin: $auth_origin, api: $grpc_server)"

# register web wallet user
echo "Register user $user"
findy-agent-cli authn register \
    -u $user \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key

# login web wallet user
echo "Login user $user"
jwt=$(findy-agent-cli authn login \
    -u $user \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key)

# register org agent
echo "Register org $org"
findy-agent-cli authn register \
    -u $org \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key

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
    --label organisation \
    --jwt $org_jwt)

echo {\"jwt\": \"$jwt\", \"user\": \"$user\"} > ./e2e/e2e.user.json
echo $invitation > ./e2e/e2e.invitation.json
connection_id=$(node -pe "require('./e2e/e2e.invitation.json')['@id']")
echo "::add-mask::$connection_id"
echo "Invitation created with connection id $connection_id"

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
