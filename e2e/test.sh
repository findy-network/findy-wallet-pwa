#!/bin/bash

set -e

CURRENT_DIR=$(dirname "$BASH_SOURCE")

rm -rf $CURRENT_DIR/test
git clone https://github.com/findy-network/e2e-test-action.git $CURRENT_DIR/test

cd $CURRENT_DIR/test
npm install
npm start
