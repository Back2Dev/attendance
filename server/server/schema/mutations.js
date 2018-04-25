const graphql = require('graphql')
const PersonType = require('./types/person_type')
const AttendHistroyType = require('./types/attend_history_type')
const ResponseType = require('./types/response_type')
const suga = require('sugar')

const mongoose = require('mongoose')
const Person = mongoose.model('person')
const AttendHistory = mongoose.model('attend-history')
 
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLID,
  GraphQLBoolean
} = graphql
const GraphQLDate = require('graphql-custom-datetype')

const mutation = new GraphQLObjectType({
  name: 'Mutation', 
  fields: {
    addPerson: {
      type: PersonType,
      args: {
        name: {type: GraphQLString},
        surname: {type: GraphQLString},
        avatar: {type: GraphQLString},
      },
      resolve(parentValue, {name, surname, avatar} , req) {
        return (new Person({name, surname, avatar, lastAttend: suga.Date.create('yesterday'), isCheckedIn: false} ).save() )
      }
    },
    removePerson: {
      type: PersonType,
      args: {
        id: {type: GraphQLID}
      },
      resolve(parentValue, {id} , req) {
        return Person.remove({_id: id})
      }
    },
    updatePerson: {
      type: PersonType,
      args: {
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        surname: {type: GraphQLString},
        avatar: {type: GraphQLString},
        isCheckedIn: {type: GraphQLBoolean}
      },
      resolve(parentValue, args , req) {
        return Person.findById(args.id).then(p => {
          p.name = (args.name) ? args.name : p.name
          p.surname = (args.surname) ? args.surname : p.surname
          p.avatar = (args.avatar) ? args.avatar : p.avatar
          p.isCheckedIn = (args.isCheckedIn) ? args.isCheckedIn : p.isCheckedIn
          return p.save()
        })
      }
    },    
    checkIn: {
      type: PersonType,
      args: {
        id: {type: GraphQLID}
      },
      resolve(parentValue, args, req) {
        return Person.findById(args.id).then(p => {
          p.lastAttend = suga.Date.create('today')
          p.isCheckedIn = true

          new AttendHistory(
            {attendee_id: p.id, name: p.name, surname: p.surname, avatar: p.avatar, lastAttend: p.lastAttend, duration: 1}
          ).save()

          return p.save()
        })
      }
    },
    checkOut: {
      type: PersonType,
      args: {
        id: {type: GraphQLID}
      },
      resolve(parentValue, args, req) {
        return Person.findById(args.id).then(p => {
          p.isCheckedIn = false
          return p.save()
        })
      }
    },
    resetCheckIns: {
      type: ResponseType,
      args: {},
      resolve(parentValue, args, req) {
        // Comment.update({ _id: id }, { $set: { text: 'changed' }}).exec()
        Person.update({isCheckedIn: true}, { $set: { isCheckedIn: false}}).exec()
        return {response: 'done'}
      }
    },
  },
})

module.exports = mutation