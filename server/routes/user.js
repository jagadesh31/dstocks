const express = require('express');
const router = express.Router();
const { getWatchlist, buyStock, holdings,toggleWatchlist, removeWatchlist,leaderboard} = require('../controllers/user');

router.get('/watchlist', getWatchlist);
router.get('/getWatchlist', getWatchlist);
router.post('/buy', buyStock);
router.get('/holdings', holdings);
router.post('/watchlist/toggle', toggleWatchlist);
router.post('/removeWatchlist', removeWatchlist)
router.get('/leaderboard', leaderboard)


module.exports = router;
