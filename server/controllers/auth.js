const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const handleRegister = async (req, res) => {
  const { username, email,password } = req.body;

  if (!username ||!email|| !password)
    return res.status(400).json({ message: 'Username and password are required.' });


  const duplicate = await User.findOne({ email }).exec();
  if (duplicate) return res.status(409).json({ message: 'Username already taken' });

  try {
    const hashedPwd = await bcrypt.hash(password, 10);

    const result = await User.create({
      email,
      username,
      password: hashedPwd,
    });

      const accessToken = jwt.sign(
    { userId : result._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId : result._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

res.cookie('jwt', refreshToken, {
  httpOnly: true,
  secure: false,     
  sameSite: 'Lax',      
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 30 // 30 days
})


  res.json({ accessToken,user:result});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
};

const handleLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)
  if (!email || !password) return res.sendStatus(400);

  const user = await User.findOne({ email });
  if (!user) return res.sendStatus(401);

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.sendStatus(403);

  const accessToken = jwt.sign(
    { userId : user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId : user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

res.cookie('jwt', refreshToken, {
  httpOnly: true,
  secure: false,       
  sameSite: 'Lax',      
  path: '/',
  maxAge: 1000 * 60 * 60 * 24 * 30
});


  res.json({ accessToken,user});
};


const handleRefreshToken = async (req, res) => {
  console.log('Cookies:', req.cookies); 
  const cookies = req.cookies;
  console.log(cookies)
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;

  console.log(refreshToken)

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
     const user = await User.findOne({ _id:decoded.userId });
      if (!user) return res.sendStatus(404);

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken,user});
  });
};


const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  
  res.clearCookie('jwt', { httpOnly: true, secure: false });
  res.sendStatus(204);
}

module.exports = { handleRegister,handleLogin,handleRefreshToken,handleLogout };