const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Every b2b person has the following:
const PersonSchema = new Schema({
  name: String,
  surname: String,
  avatar: String,
  lastAttend: Date,
  isCheckedIn: Boolean
});

mongoose.model('person', PersonSchema)
