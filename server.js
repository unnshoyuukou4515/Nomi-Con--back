// IMPORTING MODULES
// IMPORTING MODULES
require('dotenv').config({ path: './.env.local' });
const express = require('express');
const knexConfig = require('./knexfile.js'); // knexfile.jsの設定を読み込む
const knex = require('knex')(knexConfig.development); // knexを初期化する
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// console.log("DB:", process.env.DEVELOPMENT_DB);
// console.log('knexConfig', knexConfig.development); // development設定を出力してみる


// CORS設定（必要に応じてオプションを設定）
app.use(cors({
  // 例: originを設定して、特定のドメインからのアクセスのみを許可する
  // origin: 'http://example.com'
}));

// USING MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// IMPORTING DATABASE CONTROLLER
const accountController = require("./src/account/accountController");

// VERIFIED END POINTS
// ACCOUNT CONTROLLER
app.post("/createNewAccount", accountController.createNewAccount);
  // to access: localhost:8080/createNewAccount
  // body, raw, json
  // ex: {"username": "usernametest1", "password": "passwordtest1", "email": "email@gmail.comtest1", "firstName": "firstnametest1", "lastName": "lastnametest1"}
app.post("/login", accountController.login);
  // to access: localhost:8080/login
  // body, raw, json
  // ex: {"username": "usernametest1", "password": "passwordtest1"}


//HotPepper API 
const HOTPEPPER_API_KEY = '54ff6a2bad6c6ffb';
const HOTPEPPER_API_URL = 'http://webservice.recruit.co.jp/hotpepper/gourmet/v1/';


// HotPepper APIにアクセスする関数
const fetchIzakayaRestaurants = async (latitude, longitude, range) => {
    const params = {
      key: HOTPEPPER_API_KEY,
      lat: latitude,
      lng: longitude,
      range: range,
      format: 'json'
    };
    
    // APIにリクエスト
    const response = await axios.get(HOTPEPPER_API_URL, { params });
  
    // 居酒屋のジャンルコード (G001) に一致するお店のみ
    const izakayas = response.data.results.shop.filter(shop => 
      shop.genre.code === 'G001'
    );

    return izakayas;
  };
  
  // 現在位置周辺の居酒屋を検索するエンドポイント
  app.get('/api/izakayas', async (req, res) => {
    const { latitude, longitude, range } = req.query;
    try {
      const izakayas = await fetchIzakayaRestaurants(latitude, longitude, range);
      res.json(izakayas);
    } catch (error) {
      res.status(500).json({ message: 'サーバーエラーが発生しました。', error: error.message });
    }
  });
  
  // 指定した駅の居酒屋を検索するエンドポイント
app.get('/api/izakayasByStation', async (req, res) => {
    const { station_name } = req.query;
    try {
      const params = {
        key: HOTPEPPER_API_KEY,
        format: 'json',
        // 他に必要な検索パラメータがあればここに追加します。
      };
  
      // HotPepper APIにリクエストを送ります
      const response = await axios.get(HOTPEPPER_API_URL, { params });
      const allRestaurants = response.data.results.shop;
  
      // `access`情報とジャンルコードに基づいてフィルタリング
      const izakayas = allRestaurants.filter(shop =>
        shop.access && shop.access.includes(station_name) && shop.genre.code === 'G001'
      );
  
      res.json(izakayas);
    } catch (error) {
      res.status(500).json({ message: 'サーバーエラーが発生しました。', error: error.message });
    }
  });






//レストラン履歴をセーブする
app.post('/api/markAsEaten', async (req, res) => {
    const { user_id, restaurant_id, rating, visited_at } = req.body;
    
    try {
      // ユーザーIDがデータベースに存在するかチェック
      const user = await knex('users').where({ user_id }).first();
      if (!user) {
        return res.status(404).json({ message: 'ユーザーが見つかりません。' });
      }
      await knex('visited_restaurants').insert({
        user_id: user_id,
        restaurant_id: restaurant_id,
        rating: rating,
        visited_at: visited_at
      });
      
      res.status(200).json({ message: 'レストランが「食べた」リストに追加されました。' });
    } catch (error) {
      res.status(500).json({ message: 'データの保存中にエラーが発生しました。', error: error.message });
    }
  });
  


  // エラーハンドリングミドルウェア
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });




// INITIATE SERVER
const port = process.env.PORT || 3000; // Herokuが割り当てるポート、またはローカルのポート3000
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
