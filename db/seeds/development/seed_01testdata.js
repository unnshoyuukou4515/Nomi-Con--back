/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {username: 'user1', hash_salted_password: 'password1', salt: 'salt1', email: 'user1@example.com'},
        {username: 'user2', hash_salted_password: 'password2', salt: 'salt2', email: 'user2@example.com'},
      ]);
    });
};
