# Meetlytic ZoomBot

> Headless Chromium bot for joining Zoom meetings, monitoring participants, and recording audio via FFmpeg.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
  - [ZoomBot Lifecycle](#zoombot-lifecycle)
  - [Audio Recorder](#audio-recorder)
  - [Environment Variables](#environment-variables)
- [Cloud Infrastructure](#cloud-infrastructure)
- [Instructions](#instructions) ← _to be filled by teammate_
- [Debugging Tips](#debugging-tips)

---

## Overview

Meetlytic ZoomBot is a headless automation bot that:

- Joins a Zoom meeting via web.
- Mutes mic & camera before joining.
- Records audio using `ffmpeg` and PulseAudio virtual sink.
- Monitors participants, and auto-stops if only the bot remains.

---

## Architecture

### ZoomBot Lifecycle

**File:** `apps/bot/src/libs/modules/zoom/zoom-bot.ts`

The main bot logic is encapsulated in the `ZoomBot` class.
Key flow:

1. **Launch** headless Chromium via `puppeteer`.
2. **Navigate** to Zoom join URL (meeting ID + password).
3. **Accept** cookies and terms via DOM selectors.
4. **Join** with name from `.env` (`BOT_NAME`).
5. **Start** FFmpeg recording via `audioRecorder.start()`.
6. **Poll** participant count.
7. **Stop recording** & leave if only the bot is left.

---

### Audio Recorder

**File:** `apps/bot/src/libs/modules/audio-recorder/audio-recorder.ts`

Handles chunked audio recording:

- Uses `ffmpeg` with `pulse` input (`virtual_sink.monitor`).
- Saves chunks as `.mp3` (default).
- Each chunk logs volume level and duration.
- Restarts next chunk automatically after one finishes.

**Control API:**

- `start()` — begins recursive chunk recording.
- `stop()` — halts further chunk capture.

**Log sample:**

```
[+] New chunk - chunk-169169819.mp3 | type=MP3 | duration=10s
[VOL] -23.5 dB
[+] Chunk done | path=... | code=0 signal=null
```

---

### Environment Variables

The bot relies on the following `.env` file, written automatically in the EC2 setup script:

```
NODE_ENV=production
MEETING_ID=<...>
MEETING_PASSWORD=<...>
BOT_NAME=Meetlytic
OPEN_AI_KEY=
TRANSCRIPTION_MODEL=whisper-1
CHUNK_DURATION=10
FFMPEG_PATH=/usr/bin/ffmpeg
OUTPUT_DIRECTORY=/home/ubuntu/audio
```

**Key notes:**

- `MEETING_ID` & `MEETING_PASSWORD` are injected from CloudFormation.
- `CHUNK_DURATION` defines FFmpeg's `-t` per file.
- `virtual_sink.monitor` is the default FFmpeg input.

---

## Cloud Infrastructure

### Template: `ec2-instance-template.json`

AWS CloudFormation provisions:

- `SecurityGroup` (SSH open to all).
- `t3.micro` EC2 instance.
- AMI ID injected from backend.
- `UserData` block:
  - Installs Git + pulls correct branch.
  - Runs `setup-ec2.sh ${MeetingId} ${MeetingPassword}`.

### EC2 Launch Flow

Controlled via backend `MeetingService`:

```ts
await this.cloudFormation.create({ id, template });
```

1. Stack created with `MeetingId`, `MeetingPassword`.
2. EC2 instance is provisioned.
3. `setup-ec2.sh` installs Node.js, Chromium deps, PulseAudio, builds packages.
4. ZoomBot launches inside `xvfb-run`.

---

## Debugging Tips

| Component        | Tool/Command                                  | Purpose                                |
| ---------------- | --------------------------------------------- | -------------------------------------- |
| PulseAudio       | `pactl list sinks` / `sources`                | Check if `virtual_sink.monitor` exists |
| FFmpeg           | `tail -f /home/ubuntu/bot.log`                | View live recording output/logs        |
| Puppeteer        | Add logs in `zoom-bot.ts` (e.g. after clicks) | Verify interaction timing              |
| Audio quality    | `ffplay chunk-xxxx.mp3`                       | Listen to chunks manually              |
| EC2 connectivity | `ssh -i key.pem ubuntu@<ip>`                  | SSH into instance                      |

---

## Instructions to launch

> TODO
