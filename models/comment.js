var mongoose = require('mongoose');

//create comment Schema
var commentSchema = new mongoose.Schema({
  author: String,
  body: String,
  date: { type: Date, default: Date.now }
});

//export comment model
module.exports = mongoose.model('Comment', commentSchema);
