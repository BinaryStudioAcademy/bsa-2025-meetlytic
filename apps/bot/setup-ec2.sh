#!/bin/bash

# === Download and install all dependencies ===
sudo apt update -y
sudo apt install -y git ffmpeg pulseaudio pulseaudio-utils curl nodejs npm
\ libatk-bridge2.0-0 libgtk-3-0 libappindicator3-1 libnss3 libxss1
\ libasound2 libgbm1 libx11-xcb1 libxcomposite1 libxkbcommon0

# === Setup Pulse Audio with virtual mic ===
pulseaudio --start
pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink
pactl load-module module-loopback source=virtual_sink.monitor

# === Install bot dependencies and Chromium ===
cd /home/ubuntu/bsa-2025-meetlytic/apps/bot
npm install
npx puppeteer browsers install chrome

# === Prepare audio output directory ===
mkdir -p /home/ubuntu/audio

# === Write env variables ===
cat <<EOF > .env
NODE_ENV=production
MEETING_ID=${1}
MEETING_PASSWORD=${2}
BOT_NAME=Meetlytic
OPEN_AI_KEY=
TRANSCRIPTION_MODEL=whisper-1
CHUNK_DURATION=10
FFMPEG_PATH=/usr/bin/ffmpeg
OUTPUT_DIR=/home/ubuntu/audio
EOF

# === Start bot ===
nohup npm run start:dev > /home/ubuntu/bot.log 2>&1 &
