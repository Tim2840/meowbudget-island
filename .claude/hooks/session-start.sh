#!/bin/bash
set -euo pipefail

# Only run in Claude Code on the web (remote) environments.
# Local sessions already have node_modules and skip this.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# Install dependencies. `npm install` (not `npm ci`) so the cached
# container state can be reused across sessions and it stays idempotent.
npm install
