# Use Node base image
FROM node:18

# Install ffmpeg and yt-dlp
RUN apt update && \
    apt install -y ffmpeg curl && \
    curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp && \
    chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy backend files
COPY . .

# Install npm packages
RUN npm install

# Create folder for downloaded files
RUN mkdir -p downloads

# Expose backend port
EXPOSE 6900

# Run backend
CMD ["node", "index.js"]
