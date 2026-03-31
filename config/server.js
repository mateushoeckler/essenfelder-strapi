module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: 'http://137.131.218.195:1337',
  app: {
    keys: env.array('APP_KEYS'),
  },
});
