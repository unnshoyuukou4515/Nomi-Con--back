// Update with your config settings.
require('dotenv').config({ path: './.env.local' });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {  
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL, // Herokuの環境変数から接続URLを取得
      ssl: { rejectUnauthorized: false } // HerokuのSSL設定を無効化
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/production',
    }
  },


};
