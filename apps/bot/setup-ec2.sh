#!/bin/bash

echo "[+] Updating system packages..."
sudo apt update -y

echo "[+] Installing curl and git..."
sudo apt install -y curl git

echo "[+] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

echo "[+] Installing system libraries and dependencies..."
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
sleep 2

echo "[+] Setting up virtual audio sink..."
pactl unload-module module-null-sink || true
pactl unload-module module-loopback || true
pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink
pactl load-module module-loopback source=virtual_sink.monitor

echo "[+] Cloning repo if not present..."
cd /home/ubuntu
if [ ! -d "bsa-2025-meetlytic" ]; then
	git clone --branch 44-feat-record-audio-from-ec2 https://github.com/BinaryStudioAcademy/bsa-2025-meetlytic.git
fi

echo "[+] Installing bot dependencies..."
cd /home/ubuntu/bsa-2025-meetlytic/apps/bot
npm install

echo "[+] Building shared package..."
cd ../../packages/shared
npm install
npm run build

echo "[+] Go back to apps/bot..."
cd ../../apps/bot

echo "[+] Installing Chromium for Puppeteer (as root)..."
sudo npx puppeteer browsers install chrome

echo "[+] Creating audio output directory..."
mkdir -p /home/ubuntu/audio
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

echo "[+] Starting ZoomBot as user ubuntu..."
sudo -u ubuntu nohup npm run start:dev > /home/ubuntu/bot.log 2>&1 &

echo "[\0_0/] Setup complete. Bot is running in background."
