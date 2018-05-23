import { Mongo } from 'meteor/mongo'
import { ValidatedMethod } from 'meteor/mdg:validated-method'

const Members = new Mongo.Collection('members')

Members.attachSchema(new SimpleSchema({
  name: {
    type: String,
    label: "Name",
    max: 128,
    optional: true,
  },
  avatar: {
    type: String,
    label: "Avatar file name",
    defaultValue: "default.jpg",
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
