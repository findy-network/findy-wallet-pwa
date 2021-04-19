#!/bin/bash

set -e

CURRENT_DIR=$(dirname "$BASH_SOURCE")


node -e "console.log(require(\"$CURRENT_DIR/../package.json\").version);"