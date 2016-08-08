var mongoose = require('mongoose');

//Create post schema
var postSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  state: String,
  createdAt: { type: Date, default: Date.now },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

//Export post mongoose model
module.exports = mongoose.model('Post', postSchema);
