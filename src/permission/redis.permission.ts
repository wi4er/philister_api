const session = require('express-session');
const redis = require('redis');

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
    url: process.env.CACHE_HOST || 'redis://localhost:3000',
});

redisClient.connect()
  .then(
    conn => {
      // console.log('Redis connection successful!');
    },
    err => {
      console.log('Redis error!!!');
      console.log(err);
    }
  );

export default function redisPermission() {
  return session({
    store: new RedisStore({ client: redisClient }),
    secret: 'secret$%^134',
    resave: true,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 60 * 24,
    }
  });
}