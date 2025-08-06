#!/bin/bash

echo "[+] Updating system packages..."
sudo apt update -y

echo "[+] Installing curl..."
sudo apt install -y curl

echo "[+] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

echo "[+] Installing system libraries and dependencies..."
sudo apt-get update -y
sudo apt-get install -y \
	ffmpeg \
	pulseaudio \
	pulseaudio-utils \
	libatk1.0-0 \
	libatk-bridge2.0-0 \
	libgtk-3-0 \
	libnss3 \
	libxss1 \
	libasound2 \
	libgbm1 \
	libx11-xcb1 \
	libxcomposite1 \
	libxkbcommon0 \
	libappindicator3-1

echo "[+] Starting PulseAudio..."
pulseaudio --start --exit-idle-time=-1

echo "[+] Waiting for PulseAudio to be ready..."
for i in {1..10}; do
	pactl info &> /dev/null && break
	sleep 1
done

echo "[+] Unloading existing null sinks (if any)..."
pactl unload-module module-null-sink &> /dev/null || true

echo "[+] Creating virtual sink..."
pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink

echo "[+] Loading loopback to monitor..."
pactl load-module module-loopback source=virtual_sink.monitor

echo "[+] Verifying virtual_sink.monitor exists..."
if pactl list sources short | grep -q virtual_sink.monitor; then
	echo "[✓] virtual_sink.monitor successfully created"
else
	echo "[◕︵◕] virtual_sink.monitor NOT FOUND. Recording will fail!"
	pactl list sources short
	exit 1
fi

echo "[+] Building shared package..."
cd ../../packages/shared
npm install
npm run build

echo "[+] Installing bot dependencies..."
cd /home/ubuntu/bsa-2025-meetlytic/apps/bot
npm install

echo "[+] Go back to apps/bot..."
cd ../../apps/bot

echo "[+] Installing Chromium for Puppeteer..."
npx puppeteer browsers install chrome

echo "[+] Creating audio output directory..."
mkdir -p /home/ubuntu/audio

echo "[+] Setting permissions for /home/ubuntu/audio..."
sudo chown -R ubuntu:ubuntu /home/ubuntu/audio

echo "[+] Writing environment variables..."
cat <<EOF > .env
NODE_ENV=production
MEETING_ID=${1}
MEETING_PASSWORD=${2}
BOT_NAME=Meetlytic
OPEN_AI_KEY=
TRANSCRIPTION_MODEL=whisper-1
CHUNK_DURATION=10
FFMPEG_PATH=/usr/bin/ffmpeg
OUTPUT_DIRECTORY=/home/ubuntu/audio
EOF

echo "[?] Verifying that PulseAudio is already running"
if pulseaudio --check; then
	echo "[+] PulseAudio is already running"
else
	echo "[*] PulseAudio not running. Starting..."
	pulseaudio --start --exit-idle-time=-1
	sleep 2
fi

echo "[+] Starting ZoomBot..."
nohup npm run start:dev > /home/ubuntu/bot.log 2>&1 &

echo "[\0_0/] Setup complete. Bot is running in background."
