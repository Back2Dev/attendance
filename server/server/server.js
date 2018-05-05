const mongoose = require('mongoose')
const expressGraphQL = require('express-graphql')
const CORS = require('micro-cors')()

const models = require('./models')
const schema = require('./schema/schema')

// Replace with your mongoLab URI
// const MONGO_URI = 'mongodb://admin:admin@ds127260.mlab.com:27260/lyrics-db'
// const MONGO_URI = 'mongodb://dbadmin:dbadmin@ds145438.mlab.com:45438/b2bikes-db'
// console.log(process.env)
const db_uri = process.env.MONGO_URI || "mongodb://localhost:27017/attendance"
console.log("uri : " + db_uri)
// Mongoose's built in promise library is deprecated, replace it with ES2015 Promise
mongoose.Promise = global.Promise

// Connect to the mongoDB instance and log a message
// on success or failure
mongoose.connect(db_uri, {useMongoClient: true})
mongoose.connection
    .once('open', () => console.log('Connected to Mongo database.'))
    .on('error', error => console.log(`Error connecting to Mongo database at :${db_uri}`, error))

module.exports = 
CORS(expressGraphQL({
  schema,
  graphiql: true
}))