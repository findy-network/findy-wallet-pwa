#!/bin/bash

timestamp=$(date +%s)

user=user-$timestamp
org=org-$timestamp
auth_url="http://localhost:8088"
auth_origin="http://localhost:3000"
default_key="15308490f1e4026284594dd08d31291bc8ef2aeac730d0daf6ff87bb92d4336c"
tls_path="./tools/env/config/cert"
grpc_server="localhost:50052"
bot_file="./e2e/e2e-sa.yaml"

# register web wallet user
findy-agent-cli authn register \
    -u $user \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key

# login web wallet user
jwt=$(findy-agent-cli authn login \
    -u $user \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key)

# register org agent
findy-agent-cli authn register \
    -u $org \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key

# login org
org_jwt=$(findy-agent-cli authn login \
    -u $org \
    --url $auth_url \
    --origin $auth_origin \
    --key $default_key)

invitation=$(findy-agent-cli agent invitation \
    --label organisation \
    --jwt $org_jwt \
    --server "localhost:50052" \
    --tls-path ./tools/env/config/cert)

echo {\"jwt\": \"$jwt\", \"user\": \"$user\"} > ./e2e/e2e.user.json
echo $invitation > ./e2e/e2e.invitation.json


sch_id=$(findy-agent-cli agent create-schema \
    --tls-path $tls_path --server $grpc_server \
    --jwt $org_jwt --name="email" --version=1.0 email)
cred_def_id=$(findy-agent-cli agent create-cred-def \
    --tls-path $tls_path --server $grpc_server \
    --jwt $org_jwt --id $sch_id --tag $org)

cat "$bot_file".template > "$bot_file"
sub_cmd='{sub("<CRED_DEF_ID>","'$cred_def_id'")}1'
awk "$sub_cmd" "$bot_file" > "$bot_file".tmp && \
		mv "$bot_file".tmp "$bot_file"

connection_id=$(node -pe "require('./e2e/e2e.invitation.json')['@id']")

echo "Starting bot with connection $connection_id"
findy-agent-cli bot start \
    --tls-path $tls_path --server $grpc_server \
    --jwt $org_jwt \
    --conn-id $connection_id ./e2e/e2e-sa.yaml &
echo "Bot started"
