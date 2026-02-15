import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const MessageTemplates = new Mongo.Collection('messageTemplates')

if (Meteor.isServer) {
  const MessageTemplatesSchema = require('./server/schema-def').MessageTemplatesSchema
  MessageTemplates.attachSchema(MessageTemplatesSchema)
}

export default MessageTemplates
