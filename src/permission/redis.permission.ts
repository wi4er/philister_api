const session = require('express-session');
const redis = require('redis');

const RedisStore = require('connect-redis')(session);
const redisClient = redis.createClient({
    host: 'localhost',
    port: 6379,
    legacyMode: true,
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

      secure: false, // if true only transmit cookie over https
      httpOnly: false, // if true prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 60 * 24 // session max age in miliseconds
    }
  });
}