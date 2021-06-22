#!/bin/bash

timestamp=$(date +%s)

findy-agent-cli authn register \
    -u test-$timestamp \
    --url http://localhost:8088 \
    --origin http://localhost:3000 \
    --key 15308490f1e4026284594dd08d31291bc8ef2aeac730d0daf6ff87bb92d4336c

jwt=$(findy-agent-cli authn login \
    -u test-$timestamp \
    --url http://localhost:8088 \
    --origin http://localhost:3000 \
    --key 15308490f1e4026284594dd08d31291bc8ef2aeac730d0daf6ff87bb92d4336c)

echo {\"jwt\": \"$jwt\", \"user\": \"test-$timestamp\"} > e2e.user.json