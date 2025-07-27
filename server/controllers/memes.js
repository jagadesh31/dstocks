const axios = require('axios');
require('dotenv').config();
const memesModel = require('../models/meme');
const { buyStocks } = require('./user');

const CLIENT_ID = 'TjpRmDwEvB4crNJ3GXVdcQ';
const CLIENT_SECRET = 'GwBrSR_H4l2FT5pScIOud0Z1KU-BpQ';

function priceCalculator(upVotes,noOfComments){
  let price = upVotes*0.05 + noOfComments*0.01
  return price.toFixed(2);
}

const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');


async function getAccessToken() {
  const response = await axios.post('https://www.reddit.com/api/v1/access_token',
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


async function fetchTopMemes(req,res) {
  let {memeType} = req.query


  const token = await getAccessToken();
  if(memeType == 'all'){
    memeType='memes'
  }
  const response = await axios.get(`https://oauth.reddit.com/r/${memeType}/top`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'myMemeApp/0.1 by yourRedditUsername'
    },
    params: {
      t: 'day',       
      limit: 25 
    }
  });

 
  const memes = response.data.data.children
    .map(post => post.data)
    .filter(post => post.post_hint === 'image' && !post.is_video);

  let finalData = memes.map(meme => ({
    title : meme.title,
    name : meme.name,
    post_hint:meme.post_hint,
    thumbnail:meme.thumbnail,
    upvotes:meme.ups,
    downVotes:meme.pwls,
    score:meme.score,
    author:meme.author,
    NOofComments : meme.num_comments,
    subreddit_subscribers:meme.subreddit_subscribers,
    price:priceCalculator(meme.ups,meme.num_comments)
  }));


  res.status(200).json(finalData)
}

async function saveTopMemes() {

  const token = await getAccessToken();

  const response = await axios.get(`https://oauth.reddit.com/r/memes/top`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'myMemeApp/0.1 by yourRedditUsername'
    },
    params: {
      t: 'day',
      limit: 50   
    }
  });

 
  const memes = response.data.data.children
    .map(post => post.data)
    .filter(post => post.post_hint === 'image' && !post.is_video);

    memes.forEach(meme => {
    let m = new memesModel({name : meme.name,
    price:priceCalculator(meme.ups,meme.num_comments)});
     m.save()
  });
}

setInterval(()=>saveTopMemes(),5*1000);

async function getMemeInfo(req,res) {
  try {
  let result = await memesModel.find({name:req.query.memeName}).sort({timeStamp:-1}).limit(25)
  res.status(200).json(result.reverse())
  }
  catch(err){
    console.log('not found')
  }
}


module.exports = {fetchTopMemes,getMemeInfo}