import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const Triggers = new Mongo.Collection('triggers')

if (Meteor.isServer) {
  const TriggersSchema = require('./server/schema-def').TriggersSchema
  Triggers.attachSchema(TriggersSchema)
}

export default Triggers
