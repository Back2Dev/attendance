const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Every b2b person has the following:
const TransactionSchema = new Schema({
//   name: String,
//   surname: String,
//   avatar: String,
//   lastAttend: Date,
//   isCheckedIn: Boolean,

  stripeId: String,
  timeStamp: Date, 




});

mongoose.model('transaction', TransactionSchema)
