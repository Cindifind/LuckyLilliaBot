#!/usr/bin/env bash
set -euo pipefail

# OneBot owns the API suite; the Bot workflow also runs it against this host checkout.
BOT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)
export BOT_DIR
ONEBOT_PLUGIN_DIR=${ONEBOT_PLUGIN_DIR:-"$BOT_DIR/../LuckyLillia.Plugins/lucky-lillia-plugin-onebot11"}
export NTQQ_PLUGIN_DIR=${NTQQ_PLUGIN_DIR:-"$BOT_DIR/../LuckyLillia.Plugins/lucky-lillia-plugin-ntqq-protocol"}
export FFMPEG_PLUGIN_DIR=${FFMPEG_PLUGIN_DIR:-"$BOT_DIR/../LuckyLillia.Plugins/lucky-lillia-plugin-ffmpeg"}
if [ ! -f "$ONEBOT_PLUGIN_DIR/scripts/native-e2e.sh" ]; then
  echo 'Set ONEBOT_PLUGIN_DIR to a OneBot plugin checkout containing scripts/native-e2e.sh' >&2
  exit 1
fi
exec bash "$ONEBOT_PLUGIN_DIR/scripts/native-e2e.sh" "$@"
