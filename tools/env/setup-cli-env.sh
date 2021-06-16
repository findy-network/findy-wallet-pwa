#!/bin/bash

if [ -z "$FCLI_KEY" ]; then
	export FCLI_KEY=`cli new-key`
	echo "$FCLI_KEY" >> .key_backup
fi
export FCLI_TLS_PATH="./config/cert"
export FCLI_USER="findy-root"
export FCLI_URL=http://localhost:8088
export FCLI_SERVER=localhost:50052
export FCLI_ORIGIN=http://localhost:3000

