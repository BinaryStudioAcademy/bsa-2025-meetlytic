#!/bin/bash

set -e

echo "====================================="
echo "[0] STARTING SETUP FOR MEETLYTIC BOT"
echo "====================================="

echo "[+] 1. Updating system packages..."
sudo apt update -y

echo "[+] 2. Installing curl..."
sudo apt install -y curl
which curl && echo "[✓] curl installed." || echo "[x] curl not found after install"

echo "[+] 3. Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v && echo "[✓] Node.js installed: $(node -v)" || echo "[x] Node.js not found"
npm -v && echo "[✓] npm installed: $(npm -v)" || echo "[x] npm not found"

echo "[+] 4. Installing system libraries and dependencies..."
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

echo "[✓] System libraries installed."

echo "[+] 5. Starting PulseAudio..."
pulseaudio --start --exit-idle-time=-1
sleep 2
pactl info && echo "[✓] PulseAudio is running" || echo "[x] PulseAudio not responding"

echo "[+] 6. Setting up virtual audio sink..."
pactl unload-module module-null-sink || true
pactl unload-module module-loopback || true
pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink
pactl load-module module-loopback source=virtual_sink.monitor
pactl list short sources | grep virtual_sink && echo "[✓] Virtual sink set up" || echo "[x] Virtual sink not found"

echo "[+] 7. Building shared package..."
cd /home/ubuntu/bsa-2025-meetlytic/packages/shared || {
	echo "[x] Shared package directory not found!"
	exit 1
}
echo "[i] Installing dependencies for shared..."
sudo -u ubuntu npm install
echo "[i] Building shared..."
sudo -u ubuntu npm run build
test -f build/index.js && echo "[✓] Shared package built" || echo "[x] Shared package not built"

echo "[+] 8. Installing bot dependencies..."
cd /home/ubuntu/bsa-2025-meetlytic/apps/bot || {
	echo "[x] Bot package directory not found!"
	exit 1
}
sudo -u ubuntu npm install
echo "[✓] Bot dependencies installed."

echo "[+] 9. Installing Chromium for Puppeteer (as ubuntu)..."
sudo -u ubuntu npx puppeteer browsers install chrome
CHROME_PATH="/home/ubuntu/.cache/puppeteer/chrome"
ls "$CHROME_PATH" && echo "[✓] Chromium installed at $CHROME_PATH" || echo "[x] Chromium not found at $CHROME_PATH"

echo "[+] 10. Creating audio output directory..."
mkdir -p /home/ubuntu/audio
sudo chown -R ubuntu:ubuntu /home/ubuntu/audio
echo "[✓] /home/ubuntu/audio ready."

echo "[+] 11. Writing environment variables..."
sudo -u ubuntu tee .env > /dev/null <<EOF
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

echo "[✓] .env created:"
cat .env

echo "[+] 12. Starting ZoomBot as user ubuntu..."
sudo -u ubuntu nohup npm run start:dev > /home/ubuntu/bot.log 2>&1 &
sleep 3

echo "[+] 13. Checking bot status..."
pgrep -af "start:dev" && echo "[✓] ZoomBot is running" || echo "[x] ZoomBot failed to start"

echo "====================================="
echo "[✓] Setup complete. ZoomBot is running in background."
echo "====================================="
