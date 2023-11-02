const accountModel = require("./account-model");
const crypto = require("crypto");
const session = require("express-session")
const express = require("express")
const app = express()



// Access the session as req.session
app.get('/', function(req, res, next) {
  res.send('Hello World!')
})
//helperFunction
function generateSessionToken() {
  return crypto.randomBytes(16).toString("hex");
}

module.exports = {
  // LOG IN
  async login(req, res) {
    try {
      // Destructuring req.body data
      const { username: inputUsername, password: inputPassword } = req.body;
  
      // Retrive account data based on username
      const accountData = await accountModel.getDataByUsername(inputUsername);
      
      // Throw error if username is wrong
      if (!accountData) {
      
        throw new Error ();
      }
  
      // Create hash password
      const saltedInputPassword = accountData.salt + inputPassword ;
   
      const hash = crypto.createHash("sha256");
      const hashSaltedInputPassword = hash.update(saltedInputPassword).digest("hex");
  
      // Throw error if password is wrong
      if (hashSaltedInputPassword !== accountData.hash_salted_password) {
        throw new Error ();
      }

      // If password match, 
      const sentAccountData = {
        accountID: accountData.id,
        username: accountData.username,
      }
   
      res.status(200).send(JSON.stringify(sentAccountData));

      // const sessionToken = generateSessionToken();
    

    // const oneDay = 1000 * 60 * 60 * 24;
    // app.use(session({
    //   secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    //   saveUninitialized:true,
    //   cookie: { maxAge: oneDay },
    //   resave: false 
    // }));


    // const sessionToken = generateSessionToken();
    
    // res.cookie("testtoken", sessionToken, {maxAge: 360000}).status(200).send('Cookie added!');
    

    } catch (err) {
      res.status(401).send("Invalid Username or Password");
    }
  },

  // CREATE ACCOUNT
  async createNewAccount(req, res) {
    try {
      // Destructuring req.body data
      const { username, password, email, firstName, lastName } = req.body;
     
      

      // Check if username and email is unique, if either already exist, throw error
      const accountDataByUsername = await accountModel.getDataByUsername(username);
      const accountDataByEmail = await accountModel.getDataByEmail(email);

      if (accountDataByUsername) {
        
        throw new Error ("username already exist");
      }

      if (accountDataByEmail) {
      
        throw new Error ("email already exist");
      }

      // Create salt
      const salt = crypto.randomBytes(6).toString("hex");
      const saltedPassword = salt + password;
      
      // Hash-ing password
      const hash = crypto.createHash("sha256");
      const hashSaltedPassword = hash.update(saltedPassword).digest("hex");
      
      // Create new account data
      const newAccountData = {
        username: username,
        hashSaltedPassword: hashSaltedPassword,
        salt: salt,
        email: email,
        firstName: firstName,
        lastName: lastName,
      };
     

      await accountModel.createNewAccount(newAccountData);
      res.status(201).send("Account created");
    } catch (error) {
      res.status(409).send(`Failed to create account: ${error.message}`);
    }
  },
};