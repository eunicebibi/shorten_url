const express = require('express')
const mongoose = require('mongoose') // 載入 mongoose
const exphbs = require('express-handlebars')
const Url = require('./models/url') 


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
  res.render('index')
})

// 產生短網址亂碼的函數
function generateShortUrl() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let shortUrl = ''

// 產生 5 碼的短網址亂碼
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    const randomChar = chars.charAt(randomIndex)
    shortUrl += randomChar
  }

  return shortUrl;
}

// 在 /shorten 路由中使用 generateShortUrl 函數來產生短網址亂碼
app.post('/shorten', (req, res) => {
  const originalUrl = req.body.url
  if (!originalUrl) {
    res.status(400).send('Please enter a valid URL')
    return
  }

  let url;
//讓同樣網站只會出現同樣短網址
  Url.findOne({ originalUrl })
    .then((foundUrl) => {
      url = foundUrl
      if (url) {
        res.render('shorten', { shortUrl: url.shortUrl })
        return
      }

      const _id = new mongoose.Types.ObjectId()
      const shortUrl = generateShortUrl()

      url = new Url({
        _id,
        shortUrl,
        originalUrl,
      })

      return url.save()
    })
    .then(() => {
      res.render('shorten', { shortUrl: url.shortUrl })
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Server error')
    })
})

// 按下縮短網址可傳送到原網址
app.get('/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl

  Url.findOne({ shortUrl })
    .then((url) => {
      if (!url) {
        res.status(404).send('URL not found')
        return
      }

      res.redirect(url.originalUrl)
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Server error')
    })
})


app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})
