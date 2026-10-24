import { Mongo } from 'meteor/mongo'
import { Meteor } from 'meteor/meteor'
import 'meteor/aldeed:collection2/static'

const PdfTemplates = new Mongo.Collection('pdfTemplates')

if (Meteor.isServer) {
  const PdfTemplatesSchema = require('./server/schema-def').PdfTemplatesSchema
  PdfTemplates.attachSchema(PdfTemplatesSchema)
}

export default PdfTemplates
