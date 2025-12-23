require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();


const PORT = process.env.PORT || 5100;



app.use(cors({
  origin: 'https://dstocks.jagadesh31.tech',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/auth', require('./routes/auth'));
app.use('/memes', require('./routes/memes'));
app.use('/user', require('./routes/user'));


// const verifyJWT = require('./middleware/verifyJWT');


// app.get('/admin', verifyJWT, verifyRoles('Admin'), (req, res) => {
//   res.json({ message: 'Welcome Admin!' });
// });


mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch ((err)=>{
    console.error(err);
  })


