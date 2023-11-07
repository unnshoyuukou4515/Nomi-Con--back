// Update with your config settings.
require('dotenv').config({ path: './.env.local' });

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {  
  production: {
    client: 'pg',
    connection: {
      connectionString:"postgres://swqnoghdlppttp:2afd14ebe48147be2e449d2d481ca0b14f3a780863553ecf3b544186cdaf213a@ec2-3-216-4-251.compute-1.amazonaws.com:5432/d1atfk2el7k7ndprocess.env.DATABASE_URL", // Herokuの環境変数から接続URLを取得
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
