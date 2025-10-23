#!/usr/bin/env sh
set -euo pipefail

# Always run from this script's directory (your service root)
cd "$(dirname "$0")"

# Ensure Bun is installed and on PATH
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"
if ! command -v bun >/dev/null 2>&1; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Install deps, build, then start (Next.js must bind $PORT)
bun --version
bun install --frozen-lockfile
bun run build
bun run start