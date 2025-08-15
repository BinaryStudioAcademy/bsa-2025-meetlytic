#!/bin/bash
# -----------------------------------------------------------------------------
#  Meetlytic ZoomBot – EC2 bootstrap
#
#  • This file is executed from the **UserData** block of
#    apps/backend/src/libs/modules/cloud-formation/libs/templates/ec2-instance-template.json
#
#  • The UserData script has already:
#        1) installed Git,
#        2) cloned the desired branch of this repository to /home/ubuntu/bsa-2025-meetlytic,
#        3) changed the working directory to that project root.
#        4) execute this script
#
#  • Everything that follows here finalises the setup:
#        – updates system packages,
#        – installs Node.js 22, headless-Chromium libraries and PulseAudio,
#        – configures a virtual audio sink,
#        – installs NPM dependencies & builds shared package,
#        – writes the .env file,
#        – launches the bot under Xvfb.
#
#  • What's special is that everything is done from root, not through "sudo -u ubuntu"
# -----------------------------------------------------------------------------

exec > /home/ubuntu/init.log 2>&1

# ────────────── Start ─────────────────────────────────────────
echo "[+] Script started at $(date)"
echo "[i] All output redirected to /home/ubuntu/init.log"
# ──────────────────────────────────────────────────────────────────────────────

# --- Update APT index so we get the latest package metadata
echo "[+] Updating system packages..."
apt update -y
echo "[+] Package index updated."

# --- Install curl (needed for fetching external setup scripts, etc.)
echo "[+] Installing curl"
apt install -y curl
echo "[+] curl installed."

# --- Install Node.js 22 (official NodeSource setup script + APT install) because our project use 22
echo "[+] Installing Node.js 22..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
apt install -y nodejs
echo "[+] Node.js 22 installed."

# --- Core run-time packages for headless Chromium, PulseAudio and build tools
echo "[+] Installing system libraries and dependencies..."
apt install -y \
	xvfb \
	jq \
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
	build-essential
echo "[+] Core libraries and tools installed."

# --- Install Google Chrome if not present ---
echo "[i] Checking for Google Chrome..."
if ! command -v google-chrome &> /dev/null; then
	echo "[+] Google Chrome not found. Installing..."
	apt install -y wget gnupg
	wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-signing-key.gpg
	echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-key.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
		> /etc/apt/sources.list.d/google-chrome.list
	apt update -y
	apt install -y google-chrome-stable
	echo "[+] Google Chrome installed successfully."
else
	echo "[✓] Google Chrome already installed."
fi


# ─── PulseAudio ─────────────────────────────────────────────────────────
# We run PulseAudio as *root* in system-style “per-user” mode so that it
# survives the session and is ready before the bot (Chromium) starts.
echo "[i] Preparing PulseAudio in root context…"
echo "[+] Starting PulseAudio (root user)…"
export HOME=/root
export XDG_RUNTIME_DIR=/run/user/0
mkdir -p "$XDG_RUNTIME_DIR"
pulseaudio --daemonize=yes --exit-idle-time=-1
echo "[+] PulseAudio daemon started."

# ─── Application setup ───────────────────────────────────────────────────────
# Fix ownership so npm can write node_modules in the repo cloned by root/CFN.
echo "[+] Give permission to /home/ubuntu/bsa-2025-meetlytic..."
sudo chown -R ubuntu:ubuntu /home/ubuntu/bsa-2025-meetlytic
echo "[+] Ownership adjusted."

# Install bot and shared dependencies
echo "[+] Installing bot dependencies..."
cd /home/ubuntu/bsa-2025-meetlytic/apps/bot
npm install
echo "[+] Bot dependencies installed."

echo "[+] Building shared package..."
cd ../../packages/shared
npm install
npm run build
echo "[+] Shared package built."


# Return to bot folder for runtime launch
echo "[+] Go back to apps/bot..."
cd ../../apps/bot
echo "[+] Returned to apps/bot directory."

# add permisions for node
echo "[+] Fixing permissions in bot..."
sudo chown -R $USER:$USER ../../node_modules
sudo chown -R $USER:$USER .

# Prepare the directory where FFmpeg will write audio chunks
echo "[+] Creating audio output directory..."
mkdir -p /home/ubuntu/audio
sudo chown -R ubuntu:ubuntu /home/ubuntu/audio
echo "[+] /home/ubuntu/audio prepared."

# Generate .env with runtime configuration (meeting IDs, etc.)
echo "[+] Parsing settings JSON..."
SETTINGS_JSON="$1"


if ! command -v jq &> /dev/null; then
echo "Error: jq is not installed. Please install jq to continue."
exit 1
fi

# Use jq to parse JSON into bash variables
BOT_NAME=$(echo "$SETTINGS_JSON" | jq -r '.botName')
MEETING_ID=$(echo "$SETTINGS_JSON" | jq -r '.id')
MEETING_LINK=$(echo "$SETTINGS_JSON" | jq -r '.meetingLink')
MEETING_PASSWORD=$(echo "$SETTINGS_JSON" | jq -r '.meetingPassword')
OPEN_AI_KEY=$(echo "$SETTINGS_JSON" | jq -r '.openAIKey')
ORIGIN=$(echo "$SETTINGS_JSON" | jq -r '.origin')
TEXT_GENERATION_MODEL=$(echo "$SETTINGS_JSON" | jq -r '.textGenerationModel')
TRANSCRIPTION_MODEL=$(echo "$SETTINGS_JSON" | jq -r '.transcriptionModel')

if [ -z "$BOT_NAME" ] || [ -z "$MEETING_LINK" ]; then
echo "Error: Missing required settings in JSON."
exit 1
fi

echo "[+] Writing environment variables..."
cat <<EOF > .env
# APP
NODE_ENV=production
PORT=3001
HOST=localhost
ORIGIN=$ORIGIN

# BOT
BOT_NAME="$BOT_NAME"

# ZOOM
MEETING_ID=$MEETING_ID
MEETING_LINK=$MEETING_LINK
MEETING_PASSWORD=$MEETING_PASSWORD

# OPEN_AI
OPEN_AI_KEY=$OPEN_AI_KEY
TEXT_GENERATION_MODEL=$TEXT_GENERATION_MODEL
TRANSCRIPTION_MODEL=$TRANSCRIPTION_MODEL

# AUDIO - RECORDER
CHUNK_DURATION=10
FFMPEG_PATH=/usr/bin/ffmpeg
OUTPUT_DIRECTORY=/home/ubuntu/audio
EOF

echo "[+] .env file created."

# Launch the bot inside Xvfb (headless virtual display) and detach
echo "[+] Starting ZoomBot with xvfb-run..."
xvfb-run --auto-servernum --server-num=99 --server-args="-screen 0 1200x700x24" \
	npm run start:dev > /home/ubuntu/bot.log 2>&1 &
echo "[+] ZoomBot launched (PID $!). Logs at /home/ubuntu/bot.log"

# ────────────── FINAL POINTS ──────────────────────────────────────────
echo "[\\0_0/] Setup complete. Bot is running with xvfb-run + Chromium:headless."
echo "[i] Script finished at $(date)"
# ──────────────────────────────────────────────────────────────────────────────
