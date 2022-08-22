import { Mongo } from 'meteor/mongo'

const Counters = new Mongo.Collection('counters')

export default Counters
