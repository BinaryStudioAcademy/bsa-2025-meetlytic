#!/bin/bash

# === Set working directory to repo root ===
echo "[+] Set working directory to repo root"
cd "$(dirname "$0")/../.." || {
	echo "[x] Failed to cd to repo root from setup-ec2.sh"
	exit 1
}

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
pactl list short modules | grep module-null-sink | cut -f1 | while read -r mod; do
	pactl unload-module "$mod"
done

echo "[+] Creating virtual sink..."
VIRTUAL_SINK_ID=$(pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink)
if [ -z "$VIRTUAL_SINK_ID" ]; then
	echo "[✗] Failed to create virtual_sink"
	exit 1
fi

echo "[+] Waiting for virtual_sink.monitor to appear..."
for i in {1..10}; do
	if pactl list sources short | grep -q virtual_sink.monitor; then
		echo "[✓] virtual_sink.monitor successfully created"
		break
	fi
	sleep 1
done

if ! pactl list sources short | grep -q virtual_sink.monitor; then
	echo "[◕︵◕] virtual_sink.monitor NOT FOUND. Recording will fail!"
	pactl list sources short
	exit 1
fi

echo "[+] Loading loopback from virtual_sink.monitor to default sink..."
pactl load-module module-loopback source=virtual_sink.monitor

echo "[+] Building shared package..."
# current: /home/ubuntu/bsa-2025-meetlytic/
cd packages/shared
npm install
npm run build

echo "[+] Installing bot dependencies..."
cd apps/bot
npm install

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
