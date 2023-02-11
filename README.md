
Used node.js and redis to implement a rate limiter.

1. how to build up
```
cd node-rate
docker-compose build
docker compose up
```

2. send request from client side
```
# request with ip (100 req/hour)
curl -i localhost:3000/public


# request with token (200 req/hour)
# 1. get token
curl -s -X POST -H 'Content-Type: application/json' -d '{"email":"hoge"}' http://localhost:3000/login

{"email":"hoge","token":"eyJhbGciOiJIUzI...qjaEjCL0"}%

# 2. request with token
curl -X GET http://localhost:3000/private -H "Authorization: eyJhbGciOiJIUzI...qjaEjCL0"


# request with ip using weight (1/2/5)
(It just zadd as many as wight number.)
curl -i localhost:3000/weight1
curl -i localhost:3000/weight2
curl -i localhost:3000/weight5
```
