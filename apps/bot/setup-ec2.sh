#!/bin/bash

# === Dowload all system dependencies ===
sudo apt update -y
sudo apt install -y git ffmpeg pulseaudio curl nodejs npm
\ libatk-bridge2.0-0 libgtk-3-0 libappindicator3-1 libnss3 libxss1
\ libasound2 libgbm1 libx11-xcb1 libxcomposite1 libxkbcommon0

# === Setup Pulse Audio with virtual mic ===
pulseaudio --start

pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink
pactl load-module module-loopback source=virtual_sink.monitor

# === Clone project ===
cd /home/ubuntu
git clone --branch 44-feat-record-audio-from-ec2 https://github.com/BinaryStudioAcademy/bsa-2025-meetlytic.git

cd bsa-2025-meetlytic
npm install
npx puppeteer browsers install chrome

# === Start bot ===
cd apps/bot

cat <<EOF > .env
NODE_ENV=production
MEETING_ID=${1}
MEETING_PASSWORD=${2}
BOT_NAME=Meetlytic
OPEN_AI_KEY=
TRANSCRIPTION_MODEL=whisper-1
EOF

nohup npm run start:dev > /home/ubuntu/bot.log 2>&1 &
