var mongoose = require('mongoose');

//Create post schema
var postSchema = new mongoose.Schema({
  content: {
    title: String,
    body: String,
    state: String
  },
  template: { type: Number, default: 3 },
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
