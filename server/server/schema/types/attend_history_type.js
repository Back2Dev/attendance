const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')
const GraphQLDate = require('graphql-custom-datetype')

const AttendHistoryType = new GraphQLObjectType({
  name: 'AttendHistoryType',
  fields: {
    attendee_id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    lastAttend: { type: GraphQLDate },
    avatar: { type: GraphQLString },
    duration: { type: GraphQLInt },
  }
})

module.exports = AttendHistoryType