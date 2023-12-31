/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('visited_restaurants').del()
    .then(function () {
      // Inserts seed entries
      return knex('visited_restaurants').insert([
        {user_id: 1, restaurant_id: 'J001127301', rating: 4, visited_at: new Date()},
        {user_id: 1, restaurant_id: 'J001170154', rating: 5, visited_at: new Date()},
       
      ]);
    });
};