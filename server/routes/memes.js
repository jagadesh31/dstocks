const express = require('express');
const router = express.Router();
const { fetchTopMemes,getMemeInfo } = require('../controllers/memes');

router.get('/fetch', fetchTopMemes);
router.get('/info', getMemeInfo);
module.exports = router;