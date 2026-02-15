import { Mongo } from 'meteor/mongo'

const Projects = new Mongo.Collection('projects')

if (Meteor.isServer) {
  const ProjectsSchema = require('./server/schema-def').ProjectsSchema
  Projects.attachSchema(ProjectsSchema)
}

export default Projects
