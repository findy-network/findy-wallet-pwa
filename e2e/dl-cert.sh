#!/bin/bash

cp -R ./tools/env/config/cert ./e2e
rm ./e2e/cert/server/server.crt

echo -n | openssl s_client -connect $AGENCY_API_URL -servername $AGENCY_API_URL \
    | openssl x509 > ./e2e/cert/server/server.crt