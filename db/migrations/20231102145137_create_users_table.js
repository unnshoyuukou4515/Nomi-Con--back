/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('users', table => {
        table.increments('user_id'); // 自動インクリメントのID
        table.string('username').notNullable(); // ユーザー名
        table.string('hash_salted_password').notNullable(); // ハッシュ化されたパスワード
        table.string('salt').notNullable(); // パスワードのソルト
        table.string('email').unique().notNullable(); // メールアドレス
        table.timestamps(true, true); // created_atとupdated_atのタイムスタンプ
      })
      .createTable('visited_restaurants', table => {
        table.increments('visited_id'); // 自動インクリメントの訪問ID
        table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE'); // ユーザーIDの外部キー
        table.string('restaurant_id').notNullable(); // HotPepper APIからのレストランID
        table.integer('rating').unsigned(); // 評価スコア
        table.datetime('visited_at').notNullable(); // 訪問日時
        table.timestamps(true, true); // レコード作成日時と更新日時
      });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    // 複数のテーブルを削除する場合は、作成の逆順で行う
    return knex.schema
      .dropTableIfExists('visited_restaurants')
      .dropTableIfExists('users');
  };
