const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const authenticate = require('./authenticate');
const app = express();

app.use(bodyParser.json());

app.post('/login', (req, res) => {
  const payload = {
    email: req.body.email
  };

  const token = jwt.sign(payload, config.jwt.secret, config.jwt.options);

  const body = {
    email: req.body.email,
    token: token,
  };
  res.status(200).json(body);
});

app.get('/private', authenticate, (req, res) => {
  res.status(200).json({
    message: 'Hello!',
    authEmail: req.jwtPayload.email,
  });
});

app.get('/public', (req, res) => {
  res.send('Hello ip');
});

app.listen(3000, () => console.log('Listening on port 3000...'));
