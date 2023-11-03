const knexConfig = require('../../knexfile');

//
//for Log-In
module.exports ={
    //Search DB by Username 
    getDataByUsername(username){
        return knex('users').where({ username: username }).first()
    },

    // Search DB by email
    getDataByEmail(email){
        return knex('users').where({ email: email }).first()
    },

    //Create Account
    createNewAccount(newAccountData){
        return knex('users').insert({
            username: newAccountData.username,
            hash_salted_password: newAccountData.hashSaltedPassword,
            salt: newAccountData.salt,
            email: newAccountData.email,
        });
    }
}