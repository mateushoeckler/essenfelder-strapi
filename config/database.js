module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME', 'cursoessenfelder_db'),
      user: env('DATABASE_USERNAME', 'cursoessenfelder_user'),
      password: env('DATABASE_PASSWORD', 'hLGpUZ6N7KwQSvqd'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
