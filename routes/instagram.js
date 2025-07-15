// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const { fetchInstaVideo } = require('../helpers/instaHelper');

// // router.get('/download', async (req, res) => {
// //   const { url } = req.query;
// //   if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

// //   try {
// //     const videoUrl = await fetchInstaVideo(url);
// //     res.json({ success: true, videoUrl });
// //   } catch (err) {
// //     res.status(500).json({ success: false, error: err.message });
// //   }
// // });

// router.get('/download', async (req, res) => {
//   const { url } = req.query;
//   if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

//   try {
//     const { mediaUrl, is_video, thumbnail } = await fetchInstaVideo(url);
//     res.json({ success: true, mediaUrl, is_video, thumbnail });
//   } catch (err) {
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// router.get('/get-stories', async (req, res) => {
//   const username = req.query.username;
//   if (!username) return res.status(400).json({ success: false, error: 'Missing username' });

//   try {
//     const response = await axios.get('https://instagram-scraper-api2.p.rapidapi.com/v1/story', {
//       params: { username },
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//         'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
//       },
//     });

//     const mediaItems = response.data?.data;
//     if (!mediaItems || mediaItems.length === 0)
//       return res.status(404).json({ success: false, error: 'No stories found for this user.' });

//     const stories = mediaItems.map(item => ({
//       type: item.is_video ? 'video' : 'image',
//       thumbnail: item.thumbnail,
//       url: item.url || item.download,
//     }));

//     res.json({ success: true, stories });
//   } catch (error) {
//     console.error('🔥 Story Fetch Error:', error.response?.data || error.message);
//     res.status(500).json({ success: false, error: 'Failed to fetch stories.' });
//   }
// });

// router.get('/download-story', async (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

//   try {
//     const response = await axios.get('https://instagram-story-downloader.p.rapidapi.com/index', {
//       params: { url },
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//         'X-RapidAPI-Host': 'instagram-story-downloader.p.rapidapi.com',
//       },
//     });

//     const media = response.data?.data?.[0];
//     if (!media) return res.status(404).json({ success: false, error: 'Media not found in story.' });

//     const mediaUrl = media.download || media.url;
//     return res.json({ success: true, mediaUrl });

//   } catch (error) {
//     console.error('🔥 Story Download Error:', error.response?.data || error.message);
//     res.status(500).json({ success: false, error: 'Failed to fetch story media.' });
//   }
// });

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const axios = require('axios');
// const { fetchInstaVideo } = require('../helpers/instaHelper');

// // 📥 Download Instagram post (reel/photo)
// router.get('/download', async (req, res) => {
//   const { url } = req.query;
//   if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

//   try {
//     const { mediaUrl, is_video, thumbnail } = await fetchInstaVideo(url);
//     return res.json({ success: true, mediaUrl, is_video, thumbnail });
//   } catch (err) {
//     console.error('❌ /download error:', err.message);
//     return res.status(500).json({ success: false, error: err.message });
//   }
// });

// // 📸 Get all stories for a username
// router.get('/get-stories', async (req, res) => {
//   const username = req.query.username;
//   if (!username) return res.status(400).json({ success: false, error: 'Missing username' });

//   try {
//     const response = await axios.get('https://instagram-scraper-api2.p.rapidapi.com/v1/story', {
//       params: { username },
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//         'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
//       },
//     });

//     const mediaItems = response.data?.data;
//     if (!mediaItems || mediaItems.length === 0) {
//       return res.status(404).json({ success: false, error: 'No stories found for this user.' });
//     }

//     const stories = mediaItems.map(item => ({
//       url: item.url || item.download,
//       thumbnail: item.thumbnail,
//       is_video: item.is_video,
//     }));

//     return res.json({ success: true, stories });
//   } catch (error) {
//     console.error('🔥 /get-stories error:', error.response?.data || error.message);
//     return res.status(500).json({ success: false, error: 'Failed to fetch stories.' });
//   }
// });

// // 📥 Download single story media
// router.get('/download-story', async (req, res) => {
//   const url = req.query.url;
//   if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

//   try {
//     const response = await axios.get('https://instagram-story-downloader.p.rapidapi.com/index', {
//       params: { url },
//       headers: {
//         'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//         'X-RapidAPI-Host': 'instagram-story-downloader.p.rapidapi.com',
//       },
//     });

//     const media = response.data?.data?.[0];
//     if (!media) {
//       return res.status(404).json({ success: false, error: 'Media not found in story.' });
//     }

//     const mediaUrl = media.download || media.url;
//     return res.json({ success: true, mediaUrl });
//   } catch (error) {
//     console.error('🔥 /download-story error:', error.response?.data || error.message);
//     return res.status(500).json({ success: false, error: 'Failed to fetch story media.' });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const axios = require('axios');
const { fetchInstaVideo } = require('../helpers/instaHelper');

// 📥 Download Instagram post (reel/photo)
router.get('/download', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ success: false, error: 'No URL provided' });

  try {
    const { mediaUrl, is_video, thumbnail } = await fetchInstaVideo(url);
    return res.json({ success: true, mediaUrl, is_video, thumbnail });
  } catch (err) {
    console.error('❌ /download error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 📸 Get all stories for a username (fixed: using correct API you're subscribed to)
// ✅ Route to fetch stories using user_id
router.get('/get-stories', async (req, res) => {
  const user_id = req.query.user_id;

  if (!user_id) {
    return res.status(400).json({ success: false, error: 'Missing user_id in query' });
  }

  try {
    const response = await axios.get('https://instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com/stories_by_user_id', {
      params: { user_id },
      headers: {
        'x-rapidapi-key': process.env.RAPID_API_KEY,
        'x-rapidapi-host': 'instagram-scrapper-posts-reels-stories-downloader.p.rapidapi.com',
      },
    });

    const items = response.data?.data;
    if (!items || items.length === 0) {
      return res.status(404).json({ success: false, error: 'No stories found.' });
    }

    const stories = items.map((item) => ({
      type: item.is_video ? 'video' : 'image',
      url: item.url || item.download,
      thumbnail: item.thumbnail,
    }));

    return res.json({ success: true, stories });
  } catch (error) {
    console.error('🔥 /get-stories error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch stories from API.' });
  }
});

router.get('/get-user-id', async (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ success: false, error: 'Missing username' });

  try {
    const response = await axios.get('https://instagram-scraper-api2.p.rapidapi.com/v1/profile', {
      params: { username },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'instagram-scraper-api2.p.rapidapi.com',
      },
    });

    const user_id = response.data?.data?.user_id;
    if (!user_id) throw new Error('User ID not found in API response');

    res.json({ success: true, user_id });
  } catch (error) {
    console.error('🔥 /get-user-id error:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch user ID' });
  }
});



// 📥 Download single story media (optional fallback)
router.get('/download-story', async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ success: false, error: 'Missing URL' });

  try {
    const response = await axios.get('https://instagram-story-downloader.p.rapidapi.com/index', {
      params: { url },
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_API_KEY,
        'X-RapidAPI-Host': 'instagram-story-downloader.p.rapidapi.com',
      },
    });

    const media = response.data?.data?.[0];
    if (!media) {
      return res.status(404).json({ success: false, error: 'Media not found in story.' });
    }

    const mediaUrl = media.download || media.url;
    return res.json({ success: true, mediaUrl });
  } catch (error) {
    console.error('🔥 /download-story error:', error.response?.data || error.message);
    return res.status(500).json({ success: false, error: 'Failed to fetch story media.' });
  }
});

module.exports = router;
