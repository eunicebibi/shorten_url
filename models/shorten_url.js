const mongoose = require('mongoose')
const Schema = mongoose.Schema
const shortenUrlSchema = new Schema({
  originalUrl: String,
  shortUrl: String,
})
module.exports = mongoose.model('Shorten_url', shortenUrlSchema)