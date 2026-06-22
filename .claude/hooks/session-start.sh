#!/bin/bash
set -euo pipefail

# Surface the canonical Vercel deployment links every session so neither the
# user nor the agent has to re-derive them (no curl-probing / PR-comment digging).
# Printed in all sessions (local + remote). Details/caveats live in AGENTS.md.
cat <<'VERCEL_LINKS'
[Vercel] meowbudget-island deployment links (team: tim2840s-projects):
  • Deployments 後台（收藏這個）: https://vercel.com/tim2840s-projects/meowbudget-island/deployments
  • Production (main):           https://meowbudget-island.vercel.app
  • dev 分支預覽:                https://meowbudget-island-git-dev-tim2840s-projects.vercel.app
  注意: 部署開了 Deployment Protection，未登入請求一律 403（擁有者登入後可看）。
VERCEL_LINKS

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
