const jwt = require('jsonwebtoken');
const config = require('./config');

module.exports = function authenticate(req, res, next) {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, config.jwt.secret);
    req.jwtPayload = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Not authenticated'
    });
  }
};
