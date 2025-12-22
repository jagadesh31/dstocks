const axios = require('axios');
require('dotenv').config();

const CLIENT_ID = 'TjpRmDwEvB4crNJ3GXVdcQ';
const CLIENT_SECRET = 'GwBrSR_H4l2FT5pScIOud0Z1KU-BpQ';

// Simple price calculator
function priceCalculator(upVotes, noOfComments) {
  const price = upVotes * 0.05 + noOfComments * 0.01;
  return price.toFixed(2);
}

// Reddit API authentication header
const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

// Fetch Reddit OAuth token
async function getAccessToken() {
  const response = await axios.post(
    'https://www.reddit.com/api/v1/access_token',
    'grant_type=client_credentials',
    {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'myMemeApp/0.1 by yourRedditUsername'
      }
    }
  );
  return response.data.access_token;
}

// Fetch top memes from subreddit
async function fetchTopMemes(req, res) {
  try {
    let { memeType } = req.query;
    if (!memeType || memeType === 'all') memeType = 'memes';

    const token = await getAccessToken();

    const response = await axios.get(`https://oauth.reddit.com/r/${memeType}/top`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'myMemeApp/0.1 by yourRedditUsername'
      },
      params: {
        t: 'day',
        limit: 10
      }
    });

    const memes = response.data.data.children
      .map(post => post.data)
      .filter(post => post.post_hint === 'image' && !post.is_video);

    const finalData = memes.map(meme => ({
      title: meme.title,
      name: meme.name,
      thumbnail: meme.thumbnail,
      image: meme.url,
      upvotes: meme.ups,
      downVotes: meme.downs,
      score: meme.score,
      author: meme.author,
      comments: meme.num_comments,
      subreddit: meme.subreddit,
      subscribers: meme.subreddit_subscribers,
      price: priceCalculator(meme.ups, meme.num_comments)
    }));

    res.status(200).json(finalData);
  } catch (err) {
    console.error("❌ Error fetching memes:", err.message);
    res.status(500).json({ error: "Failed to fetch memes" });
  }
}

async function getMemeInfo(req, res) {
  try {
    const { memeName } = req.query; 

    if (!memeName) {
      return res.status(400).json({ error: "Missing memeName query param" });
    }

    const token = await getAccessToken();

    const response = await axios.get(`https://oauth.reddit.com/by_id/${memeName}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'myMemeApp/0.1 by yourRedditUsername'
      }
    });

    const post = response.data.data.children[0]?.data;
    if (!post) {
      return res.status(404).json({ error: "Meme not found" });
    }

    if (post.post_hint !== 'image') {
      return res.status(400).json({ error: "Not an image post" });
    }



    const memeInfo = {
      title: post.title,
      name: post.name,
      image: post.url,
      author: post.author,
      upvotes: post.ups,
      comments: post.num_comments,
      subreddit: post.subreddit,
      price: priceCalculator(post.ups, post.num_comments)
    };



    res.status(200).json(memeInfo);
  } catch (err) {
    console.error("❌ Error fetching meme info:", err.message);
    res.status(500).json({ error: "Failed to fetch meme info" });
  }
}

module.exports = { fetchTopMemes, getMemeInfo ,getAccessToken};
