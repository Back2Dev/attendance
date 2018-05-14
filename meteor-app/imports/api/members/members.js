import { Mongo } from 'meteor/mongo';

const Members = new Mongo.Collection('members');

Members.attachSchema(new SimpleSchema({
  firstname: {
    type: String,
    label: "Name",
    max: 128,
    optional: false
  },
  lastname: {
    type: String,
    label: "Surname",
    max: 128,
    optional: false
  },
  avatar: {
    type: String,
    label: "Avatar file name",
    optional: true
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
  }
}));

export default Members;
