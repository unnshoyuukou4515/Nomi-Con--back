<<<<<<< HEAD
const knex = require("../knex")
=======
const knexConfig = require('../../knexfile');
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c

//
//for Log-In
module.exports ={
    //Search DB by Username 
    getDataByUsername(username){
<<<<<<< HEAD
        return knex('account').where({ username: username }).first()
=======
        return knex('users').where({ username: username }).first()
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
    },

    // Search DB by email
    getDataByEmail(email){
<<<<<<< HEAD
        return knex('account').where({ email: email }).first()
=======
        return knex('users').where({ email: email }).first()
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
    },

    //Create Account
    createNewAccount(newAccountData){
<<<<<<< HEAD
        return knex('account').insert({
=======
        return knex('users').insert({
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
            username: newAccountData.username,
            hash_salted_password: newAccountData.hashSaltedPassword,
            salt: newAccountData.salt,
            email: newAccountData.email,
<<<<<<< HEAD
            first_name: newAccountData.firstName,
            last_name: newAccountData.lastName,
=======
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
        });
    }
}