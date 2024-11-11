#!/bin/bash

HOOKS_DIR="./git-hooks"

if [ ! -d "$HOOKS_DIR" ]; then
  echo "Error: '$HOOKS_DIR' directory does not exist."
  exit 1
fi

if [ ! -f "$HOOKS_DIR/commit-msg" ]; then
  echo "Error: commit-msg hook file not found in '$HOOKS_DIR'."
  exit 1
fi

if [ ! -f "$HOOKS_DIR/pre-push" ]; then
  echo "Error: pre-push hook file not found in '$HOOKS_DIR'."
  exit 1
fi

echo "***** Updating Hooks *****"

echo "Copying commit-msg to .git/hooks/"
cp -f "$HOOKS_DIR/commit-msg" .git/hooks/commit-msg

echo "Copying pre-push to .git/hooks/"
cp -f "$HOOKS_DIR/pre-push" .git/hooks/pre-push

chmod ug+x .git/hooks/commit-msg
chmod ug+x .git/hooks/pre-push

echo "***** Hooks Installed Successfully *****"