#!/bin/sh

# Define ASSOCIATED_APPS as following:
# export ASSOCIATED_APPS='\"ABCDE12345.com.example.app\", \"ABCDE12345.com.example.app2\"'

# iOS
if [ -z "$ASSOCIATED_APPS" ]; then
  echo "Skipping ASSOCIATED APPS file generation as not defined."
  exit 0
fi

mkdir -p './public/.well-known'

TEMPLATE_PATH='./tools/well-known/apple-app-site-association'
TEMP_PATH='./public/.well-known/apple-app-site-association-temp'
TARGET_PATH='./public/.well-known/apple-app-site-association'

cp $TEMPLATE_PATH $TEMP_PATH

# replace app ids
sub_cmd='{gsub("\\[]","['$ASSOCIATED_APPS']")}1'
awk "$sub_cmd" "$TEMP_PATH" >"./$TEMP_PATH.tmp" && mv ./$TEMP_PATH.tmp $TEMP_PATH

mv $TEMP_PATH $TARGET_PATH

##################################################################################

# Android
# Define params as following:
# export ANDROID_PACKAGE_NAME='package.name'
# export ANDROID_PACKAGE_DOMAIN='https://example.com'
# export ANDROID_PACKAGE_FINGERPRINT='\"F8:90:4E...\"'

if [ -z "$ANDROID_PACKAGE_NAME" ]; then
  echo "Skipping assets links file generation as package name not defined."
  exit 0
fi

if [ -z "$ANDROID_PACKAGE_DOMAIN" ]; then
  echo "Skipping assets links file generation as package domain not defined."
  exit 0
fi

if [ -z "$ANDROID_PACKAGE_FINGERPRINT" ]; then
  echo "Skipping assets links file generation as package fingerprint not defined."
  exit 0
fi

TEMPLATE_PATH='./tools/well-known/assetlinks.json'
TEMP_PATH='./public/.well-known/assetlinks.json-temp'
TARGET_PATH='./public/.well-known/assetlinks.json'

cp $TEMPLATE_PATH $TEMP_PATH

# replace domain
sub_cmd='{gsub("\package_name\": \"","package_name\": \"'$ANDROID_PACKAGE_NAME'")}1'
awk "$sub_cmd" "$TEMP_PATH" >"./$TEMP_PATH.tmp" && mv ./$TEMP_PATH.tmp $TEMP_PATH

# replace domain
sub_cmd='{gsub("\site\": \"","site\": \"'$ANDROID_PACKAGE_DOMAIN'")}1'
awk "$sub_cmd" "$TEMP_PATH" >"./$TEMP_PATH.tmp" && mv ./$TEMP_PATH.tmp $TEMP_PATH

# replace fingerprint
sub_cmd='{gsub("\\[]","['$ANDROID_PACKAGE_FINGERPRINT']")}1'
awk "$sub_cmd" "$TEMP_PATH" >"./$TEMP_PATH.tmp" && mv ./$TEMP_PATH.tmp $TEMP_PATH

mv $TEMP_PATH $TARGET_PATH
