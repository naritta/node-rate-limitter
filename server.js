const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');
const authenticate = require('./authenticate');
const redis = require('redis')
const redisClient = redis.createClient({url: config.redis.url});
const moment = require('moment')
const { v4: uuidv4 } = require('uuid');
const app = express();

const LIMIT_TOKEN = config.limit.token
const LIMIT_IP = config.limit.ip
const LIMIT_TIME = config.limit.time

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
  const token = req.headers.authorization;
  limiter(req, res, token, LIMIT_TOKEN);
});

app.get('/public', (req, res) => {
  limiter(req, res, req.ip, LIMIT_IP);
});

app.get('/weight1', (req, res) => {
  limiter(req, res, "weight:"+req.ip, LIMIT_IP);
});

app.get('/weight2', (req, res) => {
  limiter(req, res, "weight:"+req.ip, LIMIT_IP, 2);
});

app.get('/weight5', (req, res) => {
  limiter(req, res, "weight:"+req.ip, LIMIT_IP, 5);
});

function limiter(req, res, key, limit, weight=1) {
  const current = moment().unix();

  redisClient.zremrangebyscore([
    key, 0, current-LIMIT_TIME
  ], function (e, r) {
    if (e) {
      log.error(e);
      res.status(500).send('An internal error occurs(Redis connection for zremrangebyscore).');
    }
  })

  redisClient.zcount([
    key, 0, '+inf'
  ], function (e, total) {
    if (e) {
      log.error(e);
      res.status(500).send('An internal error occurs(Redis connection for zcount).');
    }

    // add one for current request
    if (total+1 > limit) {
      redisClient.zrange([key, 0, 0, 'withscores'], function (e, oldests) {
        if (e) {
          log.error(e);
          res.status(500).send('An internal error occurs(Redis connection for zrange).');
        }

        const oldest = oldests[1]
        // currenttime - oldesttime = how many seconds passed from oldest request
        // limittime - it = how many seconds it should wait for next.
        return res.status(429).setHeader('Retry-After', LIMIT_TIME-(current-oldest)).json({
          message: `It exceeds limit. Please retry after ${LIMIT_TIME-(current-oldest)}s.`
        });
      })
    } else {
      let appending = [key];
      for (let i = 0; i < weight; i++) {
        appending.push(current, uuidv4());
      }
      redisClient.zadd(appending, function (e, r) {
        if (e) {
          log.error(e);
          res.status(500).send('An internal error occurs(Redis connection for zadd).');
        }
      })

      res.send('OK.');
    }
  })
}

app.listen(3000, () => console.log('Listening on port 3000...'));
