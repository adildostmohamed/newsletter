var mongoose = require('mongoose');

//create an event Schema
var eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: String,
  contact: { name: String, email: String},
  date: { start: Date, end: Date}
});

module.exports = mongoose.model("Event", eventSchema);
