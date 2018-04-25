const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Every b2b attendabce history tracked thusis :
const AttendHistorySchema = new Schema({
  attendee_id: String,
  name: String,
  surname: String,
  avatar: String,
  lastAttend: Date,
  duration: Number
})

mongoose.model('attend-history', AttendHistorySchema)
