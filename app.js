const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose

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

//首頁路由
app.get('/', (req, res) => {
  res.send('hello world')
})


app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})