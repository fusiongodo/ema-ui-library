#!/usr/bin/env bash
# Render one icon and composite it:  ./render.sh checkin_chat
# Optional env: CLAY_SAMPLES (default 128), CLAY_RES (default 1024).
set -euo pipefail
cd "$(dirname "$0")"
ICON="${1:?usage: ./render.sh <icon_script_name>   e.g. checkin_chat}"
SLUG="${ICON//_/-}"
BLENDER="${BLENDER:-/Applications/Blender.app/Contents/MacOS/Blender}"
OUT="out/$SLUG"
mkdir -p "$OUT"
"$BLENDER" -b --factory-startup --python "icons/$ICON.py" -- "$PWD/$OUT" 2>&1 \
  | grep -E "ENGINE|POLYS|RENDERED|TIMES|Error|Traceback|GPU setup" || true
test -f "$OUT/$SLUG.png" || { echo "render failed"; exit 1; }
PY="python3"
[ -x .venv/bin/python ] && PY=".venv/bin/python"
"$PY" composite.py "$SLUG"
