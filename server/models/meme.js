const mongoose = require('mongoose');

const memeSchema = new mongoose.Schema({
   name:String,
   price:Number,
   timeStamp:{type:Date,default:Date.now()}
});

module.exports = mongoose.model('memes', memeSchema);
