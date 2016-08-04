var mongoose = require('mongoose');

//create an event Schema
var eventSchema = new mongoose.Schema({
  title: String,
  description: String
});

module.exports = mongoose.model("Event", eventSchema);
