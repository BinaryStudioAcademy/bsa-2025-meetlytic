#!/bin/bash

echo "[+] Updating system packages..."
sudo apt update -y

echo "[+] Installing curl"
sudo apt install -y curl

echo "[+] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

echo "[+] Installing system libraries and dependencies..."
sudo apt install -y \
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


echo "[+] Starting PulseAudio as ubuntu..."
sleep 1

sudo -u ubuntu pulseaudio --start --exit-idle-time=-1

if [ $? -eq 0 ]; then
	echo "[\0_0/] PulseAudio started"
else
	echo "[◕︵◕] Failed to start PulseAudio"
fi

echo "[+] Unloading existing sinks and loopbacks..."
sleep 1

sudo -u ubuntu pactl unload-module module-null-sink || echo "[i] No null-sink to unload"
sudo -u ubuntu pactl unload-module module-loopback || echo "[i] No loopback to unload"

echo "[+] Loading virtual_sink (module-null-sink)..."
sleep 1
sink_id=$(sudo -u ubuntu pactl load-module module-null-sink sink_name=virtual_sink sink_properties=device.description=Virtual_Sink)
if [ $? -eq 0 ]; then
	echo "[\0_0/] virtual_sink loaded: module ID = $sink_id"
else
	echo "[◕︵◕] Failed to load virtual_sink"
	exit 1
fi

#echo "[+] Loading loopback from virtual_sink.monitor..."
#sleep 1
#loopback_id=$(sudo -u ubuntu pactl load-module module-loopback source=virtual_sink.monitor)

#if [ $? -eq 0 ]; then
#	echo "[\0_0/] loopback loaded: module ID = $loopback_id"
#else
#	echo "[◕︵◕] Failed to load loopback"
#	exit 1
#fi

echo "[+] Setting virtual_sink as default by sudo...."
sleep 1
sudo -u ubuntu pactl set-default-sink virtual_sink

if [ $? -eq 0 ]; then
	echo "[\0_0/] virtual_sink set as default"
else
	echo "[◕︵◕] Failed to set default sink"
fi


echo "[+] Verifying that virtual_sink.monitor exists..."
sleep 1
sudo -u ubuntu pactl list short sources | grep virtual_sink.monitor > /dev/null
if [ $? -eq 0 ]; then
	echo "[\0_0/] virtual_sink.monitor found"
else
	echo "[◕︵◕] virtual_sink.monitor NOT FOUND!"
	exit 1
fi

echo "[+] Listing sink inputs (debug)..."
sudo -u ubuntu pactl list sink-inputs 2>&1 | tee /home/ubuntu/pactl_sink_inputs.log

echo "[+] Starting pactl subscribe in background for sink changes (debug)..."
sudo -u ubuntu bash -c "pactl subscribe > /home/ubuntu/pactl_subscribe.log 2>&1 &"


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

echo "[+] Starting ZoomBot with xvfb-run..."
sudo -u ubuntu xvfb-run --auto-servernum --server-num=99 --server-args="-screen 0 1200x700x24" \
	npm run start:dev > /home/ubuntu/bot.log 2>&1 &

echo "[\0_0/] Setup complete. Bot is running with xvfb-run + Chromium:headless."
