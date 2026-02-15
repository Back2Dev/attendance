import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

const Surveys = new Mongo.Collection('surveys')

if (Meteor.isServer) {
  const SurveysSchema = require('./server/schema-def').SurveysSchema
  Surveys.attachSchema(SurveysSchema)
}

export default Surveys
