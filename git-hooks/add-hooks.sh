#!/bin/bash

# Define the source directory for hooks
HOOKS_DIR="./git-hooks"

echo "***** Updating Hooks *****"

cp -f "$HOOKS_DIR/commit-msg" .git/hooks/commit-msg

chmod ug+x .git/hooks/commit-msg

echo "***** Hooks Installed Successfully *****"
