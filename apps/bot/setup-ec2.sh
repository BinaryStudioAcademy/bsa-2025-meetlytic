#!/bin/bash
exec > /home/ubuntu/init.log 2>&1

echo "[+] Updating system packages..."
apt update -y

echo "[+] Installing curl"
apt install -y curl

echo "[+] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt install -y nodejs

echo "[+] Installing system libraries and dependencies..."
apt install -y \
	xvfb \
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
	libappindicator3-1 \
	libdrm2 \
	ca-certificates \
	build-essential \
	git


echo "[+] Starting PulseAudio (root user)…"
export HOME=/root
export XDG_RUNTIME_DIR=/run/user/0
mkdir -p "$XDG_RUNTIME_DIR"
pulseaudio --daemonize=yes --exit-idle-time=-1

echo "[+] Configuring virtual_sink…"
pactl unload-module module-null-sink &>/dev/null || true
SINK_ID=$(pactl load-module module-null-sink \
	sink_name=virtual_sink sink_properties=device.description=Virtual_Sink)
pactl set-default-sink virtual_sink
pactl list short sources | grep -q virtual_sink.monitor || {
	echo "[X] virtual_sink.monitor NOT FOUND"; exit 1; }
echo "[+] virtual_sink.monitor ready (module ID $SINK_ID)"

echo "[+] Give permission to /home/ubuntu/bsa-2025-meetlytic..."
sudo chown -R ubuntu:ubuntu /home/ubuntu/bsa-2025-meetlytic

echo "[+] Installing bot dependencies..."
cd /home/ubuntu/bsa-2025-meetlytic/apps/bot
npm install

echo "[+] Building shared package..."
cd ../../packages/shared
npm install
npm run build


echo "[+] Go back to apps/bot..."
cd ../../apps/bot

echo "[+] Creating audio output directory..."
mkdir -p /home/ubuntu/audio
sudo chown -R ubuntu:ubuntu /home/ubuntu/audio your module create folder

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

echo "[+] Starting ZoomBot with xvfb-run..."
xvfb-run --auto-servernum --server-num=99 --server-args="-screen 0 1200x700x24" \
	npm run start:dev > /home/ubuntu/bot.log 2>&1 &

echo "[\0_0/] Setup complete. Bot is running with xvfb-run + Chromium:headless."
