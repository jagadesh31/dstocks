const User = require('../models/user');
const memesModel = require('../models/meme');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {getAccessToken} = require('../controllers/memes');
const axios = require('axios');

const removeWatchlist = async (req, res) => {
  const { userId, memeName } = req.body;

  if (!userId || !memeName) {
    return res.status(400).json({ message: "Missing userId or memeName" });
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { watchlist: memeName } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Meme removed from watchlist", watchlist: updatedUser.watchlist });
  } catch (error) {
    console.error("Remove watchlist error:", error);
    res.status(500).json({ message: "Server error" });
  }
}

function priceCalculator(upVotes, noOfComments) {
  const price = upVotes * 0.05 + noOfComments * 0.01;
  return price.toFixed(2);
}

const getWatchlist = async (req, res) => {
  const { userId } = req.query;

  try {
    const user = await User.findById(userId, 'watchlist');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = await getAccessToken();
    
    const enrichedWatchlist = await Promise.all(
      user.watchlist.map(async (memeName) => {
        try {
          const response = await axios.get(`https://oauth.reddit.com/by_id/${memeName}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'User-Agent': 'myMemeApp/0.1 by yourRedditUsername'
            }
          });

          const post = response.data.data.children[0]?.data;
          if (!post) {
            throw new Error("Meme not found");
          }

          if (post.post_hint !== 'image') {
            throw new Error("Not an image post");
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

          return memeInfo;
        } catch (err) {
          console.error(`❌ Error fetching meme ${memeName}:`, err.message);
          
         // Return fallback data for failed requests
          return {
            title: 'Unknown Title',
            name: memeName,
            image: `https://via.placeholder.com/200x300?text=${memeName}`,
            author: 'Unknown Author',
            upvotes: 0,
            comments: 0,
            subreddit: 'Unknown',
            price: 0
          };
        }
      })
    );

    res.status(200).json(enrichedWatchlist);
  } catch (err) {
    console.error("❌ Error in getWatchlist:", err.message);
    res.status(500).json({ error: "Failed to fetch watchlist data" });
  }
};


const toggleWatchlist = async (req, res) => {
  const { userId, name } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user.watchlist) user.watchlist = [];

    const index = user.watchlist.indexOf(name);
    let message;
    if (index === -1) {
      user.watchlist.push(name);
      message = 'Added';
    } else {
      user.watchlist.splice(index, 1);
      message = 'Removed';
    }

    await user.save();
    res.json({ status: message, watchlist: user.watchlist });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};


const holdings = async (req, res) => {
  try {
    const user = await User.findById(req.query.userId).lean();

    if (!user) return res.status(404).json({ message: 'User not found' });

    const holdings = await Promise.all(
      user.holdings.map(async (stock) => {
        const latestMeme = await memesModel.findOne({ name: stock.name })
          .sort({ timeStamp: -1 })
          .lean();

        const currentPrice = latestMeme?.price ?? 0;
        const quantity = parseFloat(stock.quantity || 0);
        const buyPrice = parseFloat(stock.price || 0);
        const valueThen = (buyPrice * quantity).toFixed(2);
        const valueNow = (currentPrice * quantity).toFixed(2);
        const profit = (valueNow - valueThen).toFixed(2);

        return {
          name: stock.name,
          quantity,
          buyPrice,
          currentPrice,
          valueThen,
          valueNow,
          profit,
          date: stock.date,
        };
      })
    );

    res.json({ username: user.username, holdings });
  } catch (err) {
    console.error('Error in /portfolio/:userId:', err);
    res.status(500).json({ message: 'Server error' });
  }
}

const buyStock = async (req, res) => {
  const { userId, name, quantity, price, } = req.query;
  const qty = parseInt(quantity);
  const pricePerUnit = parseFloat(price);
  const totalCost = qty * pricePerUnit;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.coins < totalCost) {
      return res.status(400).json({ error: "Insufficient coins" });
    }

    user.coins -= totalCost;

    const existing = user.holdings.find(h => h.name === name);
    if (existing) {
      const totalQty = existing.quantity + qty;
      existing.buyPrice = ((existing.buyPrice * existing.quantity) + (pricePerUnit * qty)) / totalQty;
      existing.quantity = totalQty;
    } else {
      user.holdings.push({
        name,
        quantity: qty,
        buyPrice: pricePerUnit
      });
    }

    await user.save();
    res.json({ message: "Stock bought!", coins: user.coins, holdings: user.holdings });
  } catch (err) {
    res.status(500).json({ error: "Error buying stock" });
  }
};

const leaderboard = async (req, res) => {
  try {
    const users = await User.find();
    const leaderboard = await Promise.all(users.map(async (user) => {
      let profit = 0;

      for (const holding of user.holdings) {
        const currentPrice = await getCurrentPrice(holding.name);
        if (currentPrice) {
          profit += (currentPrice - holding.buyPrice) * holding.quantity;
        }
      }

      return {
        username: user.username,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        profit: profit.toFixed(2),
      };
    }));

    leaderboard.sort((a, b) => b.profit - a.profit);
    res.json(leaderboard.slice(0, 10));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
};

const getCurrentPrice = async (name) => {
  const res = await memesModel.findOne({ name }).sort({ timeStamp: -1 });
  return res?.price || 0;
};





module.exports = { getWatchlist,buyStock,holdings,toggleWatchlist,removeWatchlist,buyStock,leaderboard};