#!/bin/bash

set -e

SEMVER=$1

if [ -z "$1" ]; then
  SEMVER=minor
  echo "No argument given, starting work for default ($SEMVER) version"
fi

VERSION_NBR=$(node -e "console.log(require('./package.json').version);")
echo "Attempt to release version $VERSION_NBR"

BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [[ "$BRANCH" != "dev" ]]; then
  echo "ERROR: Checkout dev branch before tagging.";
  exit 1;
fi

if [ -z "$(git status --porcelain)" ]; then
  git pull origin dev

  VERSION=v$VERSION_NBR
  npm run test:lint
  CI=true npm test

  git tag -a $VERSION -m "Version $VERSION"
  git push origin dev --tags

  npm --no-git-tag-version version $SEMVER
  NEW_VERSION=$(node -e "console.log(require('./package.json').version);")
  git commit -a -m "Start dev for v$NEW_VERSION."
  git push origin dev
else 
  echo "ERROR: Working directory is not clean, commit or stash changes.";
fi
