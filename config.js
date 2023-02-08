module.exports = {
  jwt: {
    secret: 'secret_key_goes_here',
    options: {
      algorithm: 'HS256',
      expiresIn: '10m'
    }
  },
  limit: {
    time: 10,
    ip: 5,
    token: 5,
  }
};
