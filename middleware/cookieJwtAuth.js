const jwt = require('jsonwebtoken');

exports.cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY);

    if (user.role === 'admin') {
      req.isAdmin = true;
    }

    req.user = user;
    next();
  } catch (err) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
