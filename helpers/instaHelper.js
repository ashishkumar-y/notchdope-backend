// const axios = require('axios');

// const fetchInstaVideo = async (instaUrl) => {
//   if (!instaUrl) throw new Error('No URL provided');

//   const options = {
//     method: 'GET',
//     url: 'https://instagram-downloader-download-instagram-reels-videos.p.rapidapi.com/post.php',
//     params: { url: instaUrl },
//     headers: {
//       'X-RapidAPI-Key': process.env.RAPID_API_KEY,
//       'X-RapidAPI-Host': 'instagram-downloader-download-instagram-reels-videos.p.rapidapi.com',
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     const item = response.data?.data?.[0];

//     if (!item) throw new Error('No media found in response');

//     const isVideo = item.is_video === true;
//     const mediaUrl = isVideo ? item.download : item.url;
//     const thumbnail = item.thumbnail || item.thumb || '';

//     if (!mediaUrl) throw new Error('Media URL not found in the item data');

//     return {
//       mediaUrl,
//       is_video: isVideo,
//       thumbnail,
//     };
//   } catch (error) {
//     console.error('❌ RapidAPI Error:', error.response?.data || error.message);
//     throw new Error('Failed to fetch Instagram media');
//   }
// };

// module.exports = { fetchInstaVideo };


const axios = require('axios');

const fetchInstaVideo = async (instaUrl) => {
  if (!instaUrl) throw new Error('No URL provided');

  const options = {
    method: 'GET',
    url: 'https://instagram-downloader-download-instagram-reels-videos.p.rapidapi.com/post.php',
    params: { url: instaUrl },
    headers: {
      'X-RapidAPI-Key': process.env.RAPID_API_KEY,
      'X-RapidAPI-Host': 'instagram-downloader-download-instagram-reels-videos.p.rapidapi.com',
    },
  };

  try {
    const response = await axios.request(options);
    const item = response.data?.data?.[0];

    if (!item) throw new Error('No media found in response');

    const isVideo = item.is_video === true;
    const mediaUrl = isVideo ? item.download : item.url;
    const thumbnail = item.thumbnail || item.thumb || '';

    if (!mediaUrl) throw new Error('Media URL not found in response');

    return {
      mediaUrl,
      is_video: isVideo,
      thumbnail,
    };
  } catch (error) {
    console.error('❌ [fetchInstaVideo] RapidAPI Error:', error.response?.data || error.message);
    throw new Error('Failed to fetch Instagram media');
  }
};

module.exports = { fetchInstaVideo };
