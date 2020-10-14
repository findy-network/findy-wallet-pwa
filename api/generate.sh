#!/bin/bash
set -e

CURRENT_DIR=$(dirname "$BASH_SOURCE")
OUTPUT_DIR=./src/generated
mkdir -p $OUTPUT_DIR
rm -rf $OUTPUT_DIR/api

protoc -I=. ./api/helloworld.proto \
	--js_out=import_style=commonjs:$OUTPUT_DIR \
	--grpc-web_out=import_style=typescript,mode=grpcwebtext:$OUTPUT_DIR

# TODO temp hack: add /* eslint-disable */ to generated files
for f in "${OUTPUT_DIR}"/api/*.js; do
	echo '/* eslint-disable */' | cat - "${f}" >temp && mv temp "${f}"
done

############# TOOLS START ##########

TOOLS_OUTPUT_DIR=./tools/server/generated
mkdir -p $TOOLS_OUTPUT_DIR
rm -rf $TOOLS_OUTPUT_DIR/api

grpc_tools_node_protoc \
	--js_out=import_style=commonjs,binary:$TOOLS_OUTPUT_DIR \
	--grpc_out=$TOOLS_OUTPUT_DIR \
	--plugin=protoc-gen-grpc=$(which grpc_tools_node_protoc_plugin) $CURRENT_DIR/helloworld.proto

# TODO temp hack: add /* eslint-disable */ to generated files
for f in "${TOOLS_OUTPUT_DIR}"/api/*.js; do
	echo '/* eslint-disable */' | cat - "${f}" >temp && mv temp "${f}"
done

############# TOOLS END ##########

echo "Generation complete."
