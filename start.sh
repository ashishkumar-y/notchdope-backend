#!/bin/bash

# Install missing libraries for Puppeteer & Chrome
echo "🔧 Installing dependencies..."
apt-get update && apt-get install -y \
  wget \
  ca-certificates \
  fonts-liberation \
  libappindicator3-1 \
  libasound2 \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends

# Install yt-dlp
echo "⏳ Installing yt-dlp..."
pip install -U yt-dlp

# Start Node.js server
echo "🚀 Starting Node.js server"
node index.js
