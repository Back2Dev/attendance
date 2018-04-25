const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean
} = require('graphql')
const GraphQLDate = require('graphql-custom-datetype')

const ResponseType = new GraphQLObjectType({
  name: 'ResponseType',
  fields: {
    response: { type: GraphQLString },
  }
})

module.exports = ResponseType