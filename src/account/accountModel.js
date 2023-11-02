const knex = require("../knex")

//
//for Log-In
module.exports ={
    //Search DB by Username 
    getDataByUsername(username){
        return knex('account').where({ username: username }).first()
    },

    // Search DB by email
    getDataByEmail(email){
        return knex('account').where({ email: email }).first()
    },

    //Create Account
    createNewAccount(newAccountData){
        return knex('account').insert({
            username: newAccountData.username,
            hash_salted_password: newAccountData.hashSaltedPassword,
            salt: newAccountData.salt,
            email: newAccountData.email,
            first_name: newAccountData.firstName,
            last_name: newAccountData.lastName,
        });
    }
}