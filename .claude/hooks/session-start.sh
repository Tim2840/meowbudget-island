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

# Install the Vercel plugin (skills + read-only Vercel MCP) so the agent can
# check deployments, read build logs and fetch preview URLs directly.
# Idempotent: skip if it's already present. Never fail the session on error.
if [ ! -d "$HOME/.claude/plugins/cache/claude-plugins-official/vercel" ]; then
  npx --yes plugins add vercel/vercel-plugin -y --scope user &>/dev/null || true
fi

# Ensure xdpyinfo is available (needed for the Xvfb idempotency check).
command -v xdpyinfo &>/dev/null || apt-get install -y -q x11-utils &>/dev/null

# Start a virtual display so headless Playwright screenshots work.
# Idempotent: skip if :99 is already running.
if ! xdpyinfo -display :99 &>/dev/null 2>&1; then
  Xvfb :99 -screen 0 1280x800x24 -ac &>/dev/null &
  disown
fi
export DISPLAY=:99
