<<<<<<< HEAD
const accountModel = require("./account-model");
=======
const accountModel = require("./accountModel");
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
const crypto = require("crypto");
const session = require("express-session")
const express = require("express")
const app = express()



// Access the session as req.session
app.get('/', function(req, res, next) {
<<<<<<< HEAD
=======
	console.log(req.session)
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
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
<<<<<<< HEAD
      
=======
        console.log("username wrong");
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
        throw new Error ();
      }
  
      // Create hash password
      const saltedInputPassword = accountData.salt + inputPassword ;
<<<<<<< HEAD
   
=======
      // console.log(saltedInputPassword);
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
      const hash = crypto.createHash("sha256");
      const hashSaltedInputPassword = hash.update(saltedInputPassword).digest("hex");
  
      // Throw error if password is wrong
      if (hashSaltedInputPassword !== accountData.hash_salted_password) {
<<<<<<< HEAD
=======
        // console.log(hashSaltedInputPassword);
        // console.log(accountData.hash_salted_password);
        console.log("wrong password");
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
        throw new Error ();
      }

      // If password match, 
      const sentAccountData = {
        accountID: accountData.id,
        username: accountData.username,
      }
<<<<<<< HEAD
   
      res.status(200).send(JSON.stringify(sentAccountData));

      // const sessionToken = generateSessionToken();
    
=======
      console.log("log in success");
      res.status(200).send(JSON.stringify(sentAccountData));

      // const sessionToken = generateSessionToken();
      // console.log(sessionToken);
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c

    // const oneDay = 1000 * 60 * 60 * 24;
    // app.use(session({
    //   secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    //   saveUninitialized:true,
    //   cookie: { maxAge: oneDay },
    //   resave: false 
    // }));

<<<<<<< HEAD

    // const sessionToken = generateSessionToken();
    
=======
    // console.log(req.session);
    // const sessionToken = generateSessionToken();
    // console.log(sessionToken);
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
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
<<<<<<< HEAD
     
=======
      // console.log(username, password, email, firstName, lastName);
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
      

      // Check if username and email is unique, if either already exist, throw error
      const accountDataByUsername = await accountModel.getDataByUsername(username);
      const accountDataByEmail = await accountModel.getDataByEmail(email);

      if (accountDataByUsername) {
<<<<<<< HEAD
        
=======
        console.log(accountDataByUsername);
        console.log("Username already exist");
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
        throw new Error ("username already exist");
      }

      if (accountDataByEmail) {
<<<<<<< HEAD
      
=======
        console.log(accountDataByEmail);
        console.log("Email already exist");
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
        throw new Error ("email already exist");
      }

      // Create salt
      const salt = crypto.randomBytes(6).toString("hex");
      const saltedPassword = salt + password;
<<<<<<< HEAD
      
      // Hash-ing password
      const hash = crypto.createHash("sha256");
      const hashSaltedPassword = hash.update(saltedPassword).digest("hex");
      
=======
      // console.log(saltedPassword);

      // Hash-ing password
      const hash = crypto.createHash("sha256");
      const hashSaltedPassword = hash.update(saltedPassword).digest("hex");
      // console.log(hashSaltedPassword);

>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
      // Create new account data
      const newAccountData = {
        username: username,
        hashSaltedPassword: hashSaltedPassword,
        salt: salt,
        email: email,
<<<<<<< HEAD
        firstName: firstName,
        lastName: lastName,
      };
     
=======
      };
      // console.log(newAccountData);
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c

      await accountModel.createNewAccount(newAccountData);
      res.status(201).send("Account created");
    } catch (error) {
      res.status(409).send(`Failed to create account: ${error.message}`);
    }
  },
<<<<<<< HEAD
};
=======
};
>>>>>>> 0ceacbc380742c7cf255d3ba800ced378e76de5c
