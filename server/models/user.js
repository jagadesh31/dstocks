const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email:String,
  username: String,
  password: String,
  profileImageUrl:{type:String,default:'https://res.cloudinary.com/diizmtj04/image/upload/v1751293061/default-pic_kl5jwr.avif'},
  watchlist: {
  type: [String], 
  default: []
},
  coins: {
    type: Number,
    default: 1000 
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  holdings:[{}]
},{strict:false});

module.exports = mongoose.model('User', userSchema);
