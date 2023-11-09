/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
      .createTable('users', table => {
        table.increments('user_id'); 
        table.string('username').notNullable(); 
        table.string('hash_salted_password').notNullable(); 
        table.string('salt').notNullable(); 
        table.string('email').unique().notNullable(); 
        table.timestamps(true, true); 
      })
      .createTable('visited_restaurants', table => {
        table.increments('visited_id'); 
        table.integer('user_id').unsigned().notNullable().references('user_id').inTable('users').onDelete('CASCADE'); 
        table.string('restaurant_id').notNullable(); 
        table.integer('rating').unsigned(); 
        table.datetime('visited_at').notNullable(); 
        table.timestamps(true, true); 
      });
  };

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

    return knex.schema
      .dropTableIfExists('visited_restaurants')
      .dropTableIfExists('users');
  };
