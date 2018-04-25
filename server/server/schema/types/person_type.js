const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')
const GraphQLDate = require('graphql-custom-datetype')

const PersonType = new GraphQLObjectType({
  name: 'PersonType',
  fields: {
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    lastAttend: { type: GraphQLDate },
    // lastAttend: { type: GraphQLString },
    avatar: { type: GraphQLString },
    isCheckedIn: { type: GraphQLBoolean },
  }
})

module.exports = PersonType