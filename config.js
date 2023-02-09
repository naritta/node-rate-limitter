module.exports = {
  jwt: {
    secret: 'secret_key_goes_here',
    options: {
      algorithm: 'HS256',
      expiresIn: '10m'
    }
  },
  limit: {
    time: 3600,
    ip: 100,
    token: 200,
  },
  redis: {
    url: "redis://redis:6379"
  }
};
