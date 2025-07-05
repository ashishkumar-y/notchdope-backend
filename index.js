// const express = require('express');
// const cors = require('cors');
// const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.use(cors());

// // Route to fetch video info
// app.get('/api/get-video-info/:videoUrl', (req, res) => {
//     const videoUrl = decodeURIComponent(req.params.videoUrl);
//     const command = `yt-dlp -J "${videoUrl}"`;

//     exec(command, (error, stdout) => {
//         if (error) {
//             console.error('Error fetching video info:', error);
//             return res.status(500).json({ error: 'Failed to fetch video info' });
//         }

//         try {
//             const info = JSON.parse(stdout);

//             // Filter only formats that are mp4, with video+audio, and QuickTime compatible
//             const formats = info.formats
//                 .filter(f =>
//                     f.ext === 'mp4' &&
//                     f.vcodec.startsWith('avc1') &&
//                     f.acodec.startsWith('mp4a') &&
//                     f.vcodec !== 'none' &&
//                     f.acodec !== 'none' &&
//                     f.url
//                 )
//                 .map(f => ({
//                     format: f.format_note || f.format_id,
//                     resolution: f.height || 'audio',
//                     filesize: f.filesize,
//                     url: f.url
//                 }))
//                 .sort((a, b) => b.resolution - a.resolution); // Sort high to low

//             res.json({
//                 title: info.title,
//                 thumbnail: info.thumbnail,
//                 formats
//             });

//         } catch (parseError) {
//             console.error('Parse error:', parseError);
//             res.status(500).json({ error: 'Failed to parse video info' });
//         }
//     });
// });


// // Route to download specific quality merged video
// app.get('/api/download/:videoUrl/:quality', (req, res) => {
//     const videoUrl = decodeURIComponent(req.params.videoUrl);
//     const quality = req.params.quality;
//     const fileName = `video_${quality}p_${Date.now()}.mp4`;
//     const outputPath = path.join(__dirname, 'downloads', fileName);

//     // const command = `yt-dlp -f "bv*[height<=${quality}]+ba" --merge-output-format mp4 -o "${outputPath}" "${videoUrl}"`;
// const command = `yt-dlp -f "bv*[vcodec^=avc1][height<=${quality}]+ba[acodec^=mp4a]" --merge-output-format mp4 "${videoUrl}" -o "${outputPath}"`;


//     exec(command, (error) => {
//         if (error) {
//             console.error(`Download failed (${quality}p):`, error);
//             return res.status(500).json({ error: `Download failed for ${quality}p` });
//         }

//         res.download(outputPath, fileName, (err) => {
//             if (err) console.error('Send file error:', err);
//             fs.unlink(outputPath, () => {});
//         });
//     });
// });

// const PORT = 6900;
// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });


const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();

// ✅ Basic middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Rate limit to avoid abuse
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// ✅ Create downloads folder if not exists
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

// ✅ API to fetch video info
app.get('/api/get-video-info/:videoUrl', (req, res) => {
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

// ✅ API to download video
app.get('/api/download/:videoUrl/:quality', (req, res) => {
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
      fs.unlink(outputPath, () => {});
    });
  });
});


// ✅ Health Check route (for Render or Netlify monitoring)
app.get('/', (req, res) => {
  res.send('🟢 Backend is running fine');
});

// ✅ Error fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ✅ Start server
const PORT = process.env.PORT || 6900;

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
