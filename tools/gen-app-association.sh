#!/bin/sh

# Define ASSOCIATED_APPS as following:
# export ASSOCIATED_APPS='\"ABCDE12345.com.example.app\", \"ABCDE12345.com.example.app2\"'

if [ -z "$ASSOCIATED_APPS" ]; then
  echo "Skipping ASSOCIATED APPS file generation as not defined."
  exit 0
fi

mkdir -p './public/.well-known'

TEMPLATE_PATH='./tools/apple-app-site-association'
TEMP_PATH='./public/.well-known/apple-app-site-association-temp'
TARGET_PATH='./public/.well-known/apple-app-site-association'

cp $TEMPLATE_PATH $TEMP_PATH

# replace app ids
sub_cmd='{gsub("\\[]","['$ASSOCIATED_APPS']")}1'
awk "$sub_cmd" "$TEMP_PATH" >"./$TEMP_PATH.tmp" && mv ./$TEMP_PATH.tmp $TEMP_PATH

mv $TEMP_PATH $TARGET_PATH
