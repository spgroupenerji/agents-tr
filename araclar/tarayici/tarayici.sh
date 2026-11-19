#!/usr/bin/env bash
set -euo pipefail

dizin="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "$dizin/tarayici.mjs" "$@"
