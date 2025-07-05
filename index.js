
// // const express = require('express');
// // const cors = require('cors');
// // const helmet = require('helmet');
// // const compression = require('compression');
// // const morgan = require('morgan');
// // const rateLimit = require('express-rate-limit');
// // const { exec } = require('child_process');
// // const fs = require('fs');
// // const path = require('path');

// // const app = express();
// // app.set('trust proxy', 1);

// // // ✅ Basic middlewares
// // app.use(cors());
// // app.use(helmet());
// // app.use(compression());
// // app.use(express.json());
// // app.use(morgan('dev'));

// // // ✅ Rate limit to avoid abuse
// // app.use(
// //   rateLimit({
// //     windowMs: 15 * 60 * 1000,
// //     max: 100,
// //     standardHeaders: true,
// //     legacyHeaders: false,
// //   })
// // );

// // // ✅ Create downloads folder if not exists
// // const downloadDir = path.join(__dirname, 'downloads');
// // if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

// // // ✅ API to fetch video info
// // app.get('/api/get-video-info/:videoUrl', (req, res) => {
// //   const videoUrl = decodeURIComponent(req.params.videoUrl);
// //   const command = `yt-dlp -J "${videoUrl}"`;

// //   exec(command, (error, stdout) => {
// //     if (error) {
// //       console.error('Error fetching video info:', error);
// //       return res.status(500).json({ error: 'Failed to fetch video info' });
// //     }

// //     try {
// //       const info = JSON.parse(stdout);
// //       const formats = info.formats
// //         .filter(f =>
// //           f.ext === 'mp4' &&
// //           f.vcodec?.startsWith('avc1') &&
// //           f.acodec?.startsWith('mp4a') &&
// //           f.vcodec !== 'none' &&
// //           f.acodec !== 'none' &&
// //           f.url
// //         )
// //         .map(f => ({
// //           format: f.format_note || f.format_id,
// //           resolution: f.height || 'audio',
// //           filesize: f.filesize,
// //           url: f.url
// //         }))
// //         .sort((a, b) => b.resolution - a.resolution);

// //       res.json({
// //         title: info.title,
// //         thumbnail: info.thumbnail,
// //         formats
// //       });

// //     } catch (parseError) {
// //       console.error('Parse error:', parseError);
// //       res.status(500).json({ error: 'Failed to parse video info' });
// //     }
// //   });
// // });

// // // ✅ API to download video
// // app.get('/api/download/:videoUrl/:quality', (req, res) => {
// //   const videoUrl = decodeURIComponent(req.params.videoUrl);
// //   const quality = req.params.quality;
// //   const fileName = `video_${quality}p_${Date.now()}.mp4`;
// //   const outputPath = path.join(downloadDir, fileName);

// //   const command = `yt-dlp -f "bv*[vcodec^=avc1][height<=${quality}]+ba[acodec^=mp4a]" --merge-output-format mp4 "${videoUrl}" -o "${outputPath}"`;

// //   exec(command, (error) => {
// //     if (error) {
// //       console.error(`Download failed (${quality}p):`, error);
// //       return res.status(500).json({ error: `Download failed for ${quality}p` });
// //     }

// //     res.download(outputPath, fileName, (err) => {
// //       if (err) console.error('Send file error:', err);
// //       fs.unlink(outputPath, () => {});
// //     });
// //   });
// // });


// // // ✅ Health Check route (for Render or Netlify monitoring)
// // app.get('/', (req, res) => {
// //   res.send('🟢 Backend is running fine');
// // });

// // // ✅ Error fallback
// // app.use((req, res) => {
// //   res.status(404).json({ message: 'Route not found' });
// // });

// // // ✅ Start server
// // const PORT = process.env.PORT || 6900;

// // app.listen(PORT, () => {
// //   console.log(`✅ Server running at http://localhost:${PORT}`);
// // });





// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const compression = require('compression');
// const morgan = require('morgan');
// const rateLimit = require('express-rate-limit');
// const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');

// const app = express();
// app.set('trust proxy', 1); // For rate-limiting and real IP detection (Railway, Fly, etc.)

// // ✅ Middleware setup
// app.use(cors());
// app.use(helmet());
// app.use(compression());
// app.use(express.json());
// app.use(morgan('dev'));

// // ✅ Rate limiter to prevent abuse
// app.use(rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100, // Limit each IP to 100 requests per windowMs
//   standardHeaders: true,
//   legacyHeaders: false,
// }));

// // ✅ Create 'downloads' directory if not exists
// const downloadDir = path.join(__dirname, 'downloads');
// if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

// // ✅ GET: Fetch YouTube video info
// app.get('/api/get-video-info/:videoUrl', async (req, res) => {
//   const videoUrl = decodeURIComponent(req.params.videoUrl);

//   // Command to fetch metadata using yt-dlp
//   const command = `yt-dlp -J "${videoUrl}"`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error('❌ yt-dlp error:', stderr || error.message);
//       return res.status(500).json({ error: '❌ Failed to fetch video info' });
//     }

//     try {
//       const info = JSON.parse(stdout);

//       const formats = info.formats
//         .filter(f =>
//           f.ext === 'mp4' &&
//           f.vcodec?.startsWith('avc1') &&
//           f.acodec?.startsWith('mp4a') &&
//           f.vcodec !== 'none' &&
//           f.acodec !== 'none' &&
//           f.url
//         )
//         .map(f => ({
//           format: f.format_note || f.format_id,
//           resolution: f.height || 'audio',
//           filesize: f.filesize,
//           url: f.url
//         }))
//         .sort((a, b) => b.resolution - a.resolution); // High to low

//       res.json({
//         title: info.title,
//         thumbnail: info.thumbnail,
//         formats
//       });

//     } catch (parseError) {
//       console.error('❌ JSON parse error:', parseError.message);
//       res.status(500).json({ error: '❌ Failed to parse yt-dlp output' });
//     }
//   });
// });

// // ✅ GET: Download video in selected quality
// app.get('/api/download/:videoUrl/:quality', async (req, res) => {
//   const videoUrl = decodeURIComponent(req.params.videoUrl);
//   const quality = req.params.quality;
//   const fileName = `video_${quality}p_${Date.now()}.mp4`;
//   const outputPath = path.join(downloadDir, fileName);

//   const command = `yt-dlp -f "bv*[vcodec^=avc1][height<=${quality}]+ba[acodec^=mp4a]" --merge-output-format mp4 "${videoUrl}" -o "${outputPath}"`;

//   exec(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`❌ Download failed (${quality}p):`, stderr || error.message);
//       return res.status(500).json({ error: `❌ Download failed for ${quality}p` });
//     }

//     // Serve the file to user
//     res.download(outputPath, fileName, (err) => {
//       if (err) {
//         console.error('❌ Error sending file:', err.message);
//       }

//       // Clean up file after download
//       fs.unlink(outputPath, () => {});
//     });
//   });
// });

// // ✅ Health check
// app.get('/', (req, res) => {
//   res.send('✅ Notchdope backend is running fine');
// });

// // ✅ Catch-all 404
// app.use((req, res) => {
//   res.status(404).json({ error: '❌ Route not found' });
// });

// // ✅ Start the server
// const PORT = process.env.PORT || 6900;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
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
const tmp = require('tmp');
const simulateVisit = require('./utils/simulateVisit'); // 🧠 Puppeteer cookie injector

const app = express();
app.set('trust proxy', 1); // Required for proper rate limiting headers on Railway

// ✅ Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));

// ✅ Rate limit
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

// ✅ Ensure 'downloads' directory exists
const downloadDir = path.join(__dirname, 'downloads');
if (!fs.existsSync(downloadDir)) fs.mkdirSync(downloadDir);

// ✅ GET: YouTube video info
app.get('/api/get-video-info/:videoUrl', async (req, res) => {
  const videoUrl = decodeURIComponent(req.params.videoUrl);
  const cookieString = await simulateVisit(videoUrl);

  if (!cookieString) {
    return res.status(500).json({ error: '❌ Failed to simulate browser visit' });
  }

  // Write cookies to a temporary file
  const cookieFile = tmp.fileSync();
  fs.writeFileSync(cookieFile.name, `# Netscape HTTP Cookie File\n.youtube.com\tTRUE\t/\tFALSE\t0\tCONSENT\tYES+\n`);
  cookieString.split('; ').forEach(c => {
    const [name, value] = c.split('=');
    fs.appendFileSync(cookieFile.name, `.youtube.com\tTRUE\t/\tFALSE\t0\t${name}\t${value}\n`);
  });

  const command = `yt-dlp -J --cookies "${cookieFile.name}" "${videoUrl}"`;

  exec(command, (error, stdout, stderr) => {
    cookieFile.removeCallback(); // Clean temp file

    if (error) {
      console.error('❌ yt-dlp error:', stderr || error.message);
      return res.status(500).json({ error: '❌ Failed to fetch video info' });
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
      console.error('❌ JSON parse error:', parseError.message);
      res.status(500).json({ error: '❌ Failed to parse yt-dlp output' });
    }
  });
});

// ✅ GET: Download video at quality
app.get('/api/download/:videoUrl/:quality', async (req, res) => {
  const videoUrl = decodeURIComponent(req.params.videoUrl);
  const quality = req.params.quality;
  const fileName = `video_${quality}p_${Date.now()}.mp4`;
  const outputPath = path.join(downloadDir, fileName);

  const command = `yt-dlp -f "bv*[vcodec^=avc1][height<=${quality}]+ba[acodec^=mp4a]" --merge-output-format mp4 "${videoUrl}" -o "${outputPath}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Download failed (${quality}p):`, stderr || error.message);
      return res.status(500).json({ error: `❌ Download failed for ${quality}p` });
    }

    res.download(outputPath, fileName, (err) => {
      if (err) console.error('❌ File send error:', err.message);
      fs.unlink(outputPath, () => {});
    });
  });
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ Notchdope backend is running fine');
});

// ✅ 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: '❌ Route not found' });
});

// ✅ Start
const PORT = process.env.PORT || 6900;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
