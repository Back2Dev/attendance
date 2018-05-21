import { Mongo } from 'meteor/mongo'
import { ValidatedMethod } from 'meteor/mdg:validated-method'
import * as _ from 'lodash'

class Member {
  constructor(doc) {
    _.extend(this, doc)
    this.name = `${this.firstname} ${this.lastname}`
  }
}

const Members = new Mongo.Collection('members', {
  transform: (doc) => new Member(doc)
})

// 
// Members.search = function(query){
//   console.log('searching method... ', query)
//   return Members.find({
//     firstname: { $regex: RegExp(query), $options: 'i' }
//   }, {
//     limit: 20
//   })
// }

Members.attachSchema(new SimpleSchema({
  firstname: {
    type: String,
    label: "Name",
    max: 128,
    defaultValue: "Firstname",
    optional: true,
  },
  lastname: {
    type: String,
    label: "Lastname",
    max: 128,
    defaultValue: "Lastname",
    optional: true,
  },
  avatar: {
    type: String,
    label: "Avatar file name",
    defaultValue: "1.jpg",
  },
  isHere: {
    type: Boolean,
    label: "Is signed in",
    defaultValue: false,
  },
  lastIn: {
    type: Date,
    label: "Date of last session",
    optional: true
  },
  sessions: {
    type: [Object],
    label: "Array of sessions attended",
    optional: false,
    defaultValue: [],
    blackbox: true,
  },
}));

export default Members;
