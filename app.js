const express = require('express')
const app = express()
const port = 3000

//首頁路由
app.get('/', (req, res) => {
  res.send('hello world')
})



app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})