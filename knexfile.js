// Update with your config settings.
require('dotenv').config({ path:'./.env.local'});

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {  
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } ,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/development',
    }
  },

  development: {
    client: 'pg', // PostgreSQLを指定
    connection: {
      database: "solo1",
      user:     process.env.DEVELOPMENT_USER,
      password: process.env.DEVELOPMENT_PASSWORD,
      host:     process.env.DEVELOPMENT_HOST,
      port:     process.env.DEVELOPMENT_PORT
    },
    migrations: {
      directory: __dirname + '/db/migrations'
    },
    seeds: {
      directory: __dirname + '/db/seeds/development'
    }
  },
};
