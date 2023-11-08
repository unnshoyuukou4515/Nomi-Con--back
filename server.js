// IMPORTING MODULES
require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const knexConfig = require("./knexfile.js");
const knex = require("knex")(knexConfig.development);
const bodyParser = require("body-parser");
const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const crypto = require("crypto");
const app = express();

// console.log("DB:", process.env.DEVELOPMENT_DB);
// console.log('knexConfig', knexConfig.development); // development設定を出力してみる
console.log(process.env.DATABASE_URL); 
console.log(process.env.POSTGRES_PASSWORD)
console.log(process.env.POSTGRES_USER)
console.log(process.env.POSTGRES_DB)


app.use(
  cors({
    origin: [
      "https://solo-pj-front-n23wqu793-unnshoyuukou4515s-projects.vercel.app",
      "https://nomi-con-backend.onrender.com/createNewAccount",
      "https://nomi-con-backend.onrender.com/login",
      "https://solo-pj-front.vercel.app",
      "https://solo-pj-front.vercel.app/register",
      "https://nomi-con-backend.onrender.com",
      "http://localhost:3000",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//  '' '' '' '' ''
// USING MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// VERIFIED END POINTS
// ACCOUNT CONTROLLER
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

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

// Routes
app.post("/createNewAccount", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    // Check if the username or email already exists
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
    // Retrieve user from the database
    const user = await knex("users").where({ username }).first();
    if (!user) {
      return res.status(401).send("Invalid Username or Password");
    }

    // Check password
    const hashedInputPassword = hashPassword(password, user.salt);
    if (hashedInputPassword !== user.hash_salted_password) {
      return res.status(401).send("Invalid Username or Password");
    }

    res.status(200).send({ userId: user.user_id, username: user.username });
  } catch (error) {
    res.status(500).send(`Server error: ${error.message}`);
  }
});

//HotPepper API
const HOTPEPPER_API_KEY = "54ff6a2bad6c6ffb";
const HOTPEPPER_API_URL =
  "http://webservice.recruit.co.jp/hotpepper/gourmet/v1/";

// HotPepper APIにアクセスする関数
const fetchIzakayaRestaurants = async (latitude, longitude) => {
  const params = {
    key: HOTPEPPER_API_KEY,
    lat: latitude,
    lng: longitude,
    range: "3",
    format: "json",
  };

  const response = await axios.get(HOTPEPPER_API_URL, { params });
  // 居酒屋のコード はG001 barはG012
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
    const izakayas = await fetchIzakayaRestaurants(latitude, longitude);
    res.json(izakayas);
    // console.log(izakayas)
  } catch (error) {
    res.status(500).json({ message: "servererro", error: error.message });
  }
});

//レストラン履歴をセーブする
app.post("/markAsEaten", async (req, res) => {
  const { user_id, restaurant_id, rating, visited_at } = req.body;

  try {
    // ユーザーIDがデータベースに存在するかチェック
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
    res
      .status(500)
      .json({ message: "faild to add in database", error: error.message });
  }
});

// ユーザーの訪問済みレストランIDを取得するルート
app.get("/user/:userId/visited-izakayas", async (req, res) => {
  const userId = req.params.userId;

  try {
    // 'visited_restaurants'テーブルから'user_id'に一致する'restaurant_id'のみを取得
    const visitedRestaurantIds = await knex("visited_restaurants")
      .where("user_id", userId)
      .select("restaurant_id");
    // 結果を返す
    res.json(visitedRestaurantIds);
  } catch (err) {
    // エラー
    res.status(500).send("Internal Server Error");
  }
});

app.get("/search-by-id/:restaurantId", async (req, res) => {
  const { restaurantId } = req.params;

  try {
    const url = `${HOTPEPPER_API_URL}?key=${HOTPEPPER_API_KEY}&id=${restaurantId}&format=json`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching restaurant data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/test", async (req, res) => {
  res.status(200).json({ message: "add。" });
  console.log("test");
});

app.get("/test2", async (req, res) => {
  try {
    const visitedRestaurantIds = await knex("visited_restaurants").select(
      "restaurant_id"
    );
    res.json(visitedRestaurantIds);
  } catch (err) {
    // エラー
    res.status(500).send("Internal Server Error");
  }
});

// INITIATE SERVER
const port = process.env.PORT || 3000; //ローカルのポート3000
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
