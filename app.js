const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars');
const Shorten_url = require('./models/shorten_url') 


// 加入這段 code, 僅在非正式環境時, 使用 dotenv
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
mongoose.connect(process.env.MONGODB_URI) // 設定連線到 mongoDB

const app = express()
const port = 3000

// 取得資料庫連線狀態
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')
app.use(express.urlencoded({ extended: true }))

//首頁路由
app.get('/', (req, res) => {
  Shorten_url.find() // 取出  model 裡的所有資料
    .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
    .then(shortenurls => res.render('index', { shortenurls })) // 將資料傳給 index 樣板
    .catch(error => console.error(error)) // 錯誤處理
})

app.post('/', (req, res) => {
  console.log('req.body', req.body)
  res.render('index')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})