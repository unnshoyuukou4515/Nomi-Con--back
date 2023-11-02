// IMPORTING MODULES
const express = require("express");
const app = express();
const cors = require("cors")
const cookieParser = require('cookie-parser');


// IMPORTING DATABASE CONTROLLER
// const accountController = require("./src/account/account-controller");
// const scoreController = require("./src/score/score-controller");
// const pokemonController = require("./src/pokemon/pokemon-controller");

// USING MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(cors());


// INITIATE SERVER
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`server is listening on port ${PORT}`))