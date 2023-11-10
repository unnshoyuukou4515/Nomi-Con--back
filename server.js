// IMPORTING MODULES
require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const knex = require("./db/knex.js");
const bodyParser = require("body-parser");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const crypto = require("crypto");
const app = express();

// USING MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());
// VERIFIED END POINTS
app.use(bodyParser.urlencoded({ extended: true })); 

// Helper functions
function generateSessionToken() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  return crypto
    .createHash("sha256")
    .update(salt + password)
    .digest("hex");
}
//endpoints
app.post("/createNewAccount", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await knex("users")
      .where({ username })
      .orWhere({ email })
      .first();
    if (existingUser) {
      return res.status(409).send("Username or Email already exists.");
    }

    // Hash password
    const salt = crypto.randomBytes(16).toString("hex");
    const hashedPassword = hashPassword(password, salt);

    // Insert the new user into the database
    await knex("users").insert({
      username,
      hash_salted_password: hashedPassword,
      salt,
      email,
    });
    res.status(201).send("Account created.");
  } catch (error) {
    res.status(500).send(`Server error: ${error.message}`);
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await knex("users").where({ username }).first();
    if (!user) {
      return res.status(401).send("Invalid Username or Password");
    }
    const hashedInputPassword = hashPassword(password, user.salt);
    if (hashedInputPassword !== user.hash_salted_password) {
      return res.status(401).send("Invalid Username or Password");
    }
    res.status(200).send({ userId: user.user_id, username: user.username });
  } catch (error) {
    res.status(500).send(`Server error: ${error.message}`);
    console.log(error);
  }
});

//HotPepper API
const HOTPEPPER_API_KEY = "54ff6a2bad6c6ffb";
const HOTPEPPER_API_URL = "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

// HotPepper APIにアクセスする関数
const fetchIzakaya = async (latitude, longitude) => {
  const params = {
    key: HOTPEPPER_API_KEY,
    lat: latitude,
    lng: longitude,
    range: "3",
    format: "json",
  };

  const response = await axios.get(HOTPEPPER_API_URL, { params });
  const izakayas = response.data.results.shop.filter(
    (shop) =>
      shop.genre.code === "G001" ||
      shop.genre.code === "G012" ||
      shop.genre.code === "G002"
  );
  return izakayas;
};

// 現在位置周辺の居酒屋を検索するエンドポイント
app.get("/izakayas", async (req, res) => {
  const { latitude, longitude } = req.query;
  try {
    const izakayas = await fetchIzakaya(latitude, longitude);
    res.json(izakayas);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
    console.log(error);
  }
});

//レストラン履歴をセーブする
app.post("/markAsEaten", async (req, res) => {
  const { user_id, restaurant_id, rating, visited_at } = req.body;
  try {
    const user = await knex("users").where({ user_id }).first();
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    await knex("visited_restaurants").insert({
      user_id: user_id,
      restaurant_id: restaurant_id,
      rating: rating,
      visited_at: visited_at,
    });
    res.status(200).json({ message: "add to the database。" });
  } catch (error) {
    res.status(500)
      .json({ message: "faild to add in database", error: error.message });
    console.log(error);
  }
});

// ユーザーの訪問済みレストランIDを取得するルート
app.get("/user/:userId/visited-izakayas", async (req, res) => {
  const userId = req.params.userId;
  try {
    const visitedRestaurantIdsandscore = await knex("visited_restaurants")
      .where("user_id", userId)
      .select("restaurant_id","rating");
    res.json(visitedRestaurantIdsandscore);
  } catch (error) {
    res.status(500).send("Internal Server Error", error);
    console.log(error)
  }
});

//ID + resutaurant(izakaya)ID => change rate
app.put("/user/:userId/restaurant/:restaurantId/rate", async (req, res) => {
  const { userId, restaurantId } = req.params;
  const { rating } = req.body; 
  try {
    await knex("visited_restaurants")
      .where({ user_id: userId, restaurant_id: restaurantId })
      .update({ rating: rating });
      res.json({ message: "updated successful." }); 
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Failed to update"});
    console.log(error)
  }
});

//delete hisoty
app.delete("/user/:userId/restaurant/:restaurantId", async (req, res) => {
  const { userId, restaurantId } = req.params; 
  try {
    await knex("visited_restaurants")
      .where({ user_id: userId, restaurant_id: restaurantId })
      .del(); 
    res.json({ message: "Visit record delete success." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete",});
    console.log(error);
  }
});

//get izakaya info by id
app.get("/search-by-id/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const url = `${HOTPEPPER_API_URL}?key=${HOTPEPPER_API_KEY}&id=${restaurantId}&format=json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching:", error);
    res.status(500).send("Internal Server Error");
  }
});

//for testing server endpoint
app.get("/test", async (req, res) => {
  res.status(200).json({ message: "add。" });
  console.log("test");
});

//testforDatabaseConnection
app.get("/testfordb", async (req, res) => {
  try {
    const listOfusers = await knex("users").select(username);
    res.json(listOfusers);
  } catch (error) {
    // エラー
    res.status(500).send("Internal Server Error");
    console.log(error);
  }
});

// INITIATE SERVER
const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
