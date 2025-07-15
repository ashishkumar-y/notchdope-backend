const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const downloadDir = path.join(__dirname, '..', 'downloads');

// GET: Fetch video info
router.get('/get-video-info/:videoUrl', (req, res) => {
  const videoUrl = decodeURIComponent(req.params.videoUrl);
  const command = `yt-dlp -J "${videoUrl}"`;

  exec(command, (error, stdout) => {
    if (error) {
      console.error('Error fetching video info:', error);
      return res.status(500).json({ error: 'Failed to fetch video info' });
    }

    try {
      const info = JSON.parse(stdout);
      const formats = info.formats
        .filter(f =>
          f.ext === 'mp4' &&
          f.vcodec?.startsWith('avc1') &&
          f.acodec?.startsWith('mp4a') &&
          f.vcodec !== 'none' &&
          f.acodec !== 'none' &&
          f.url
        )
        .map(f => ({
          format: f.format_note || f.format_id,
          resolution: f.height || 'audio',
          filesize: f.filesize,
          url: f.url
        }))
        .sort((a, b) => b.resolution - a.resolution);

      res.json({
        title: info.title,
        thumbnail: info.thumbnail,
        formats
      });

    } catch (parseError) {
      console.error('Parse error:', parseError);
      res.status(500).json({ error: 'Failed to parse video info' });
    }
  });
});

// GET: Download video
router.get('/download/:videoUrl/:quality', (req, res) => {
  const videoUrl = decodeURIComponent(req.params.videoUrl);
  const quality = req.params.quality;
  const fileName = `video_${quality}p_${Date.now()}.mp4`;
  const outputPath = path.join(downloadDir, fileName);

  const command = `yt-dlp -f "bv*[vcodec^=avc1][height<=${quality}]+ba[acodec^=mp4a]" --merge-output-format mp4 "${videoUrl}" -o "${outputPath}"`;

  exec(command, (error) => {
    if (error) {
      console.error(`Download failed (${quality}p):`, error);
      return res.status(500).json({ error: `Download failed for ${quality}p` });
    }

    res.download(outputPath, fileName, (err) => {
      if (err) console.error('Send file error:', err);
      fs.unlink(outputPath, () => { });
    });
  });
});

module.exports = router;
