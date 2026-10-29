#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
export WRANGLER_SEND_METRICS=false
mode="${1:-quick}"
case "$mode" in
  install)
    npm ci --no-audit --no-fund
    exit 0 ;;
  quick|full) ;;
  *) echo 'Usage: bash .github/check-local.sh install|quick|full' >&2; exit 2 ;;
esac
node cpa/model-checks.cjs
node cpa/launch-checks.cjs
node cpa/scenario-checks.cjs
python3 -m unittest discover -s scripts -p 'test_robots_parity.py'
python3 scripts/build_site.py
if [ "$mode" = full ]; then
  : # Quick already includes the complete source validation for this site.
fi
