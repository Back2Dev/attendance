import { Mongo } from 'meteor/mongo'

const Diagrams = new Mongo.Collection('diagrams')

if (Meteor.isServer) {
  const DiagramsSchema = require('./server/schema-def').DiagramsSchema
  Diagrams.attachSchema(DiagramsSchema)
}

export default Diagrams
