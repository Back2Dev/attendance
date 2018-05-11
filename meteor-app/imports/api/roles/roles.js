import { Mongo } from 'meteor/mongo';

const Roles = new Mongo.Collection('roles');

Roles.attachSchema(new SimpleSchema({
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
    type: [String],
    label: "Array of session ids attended",
    optional: false,
    defaultValue: [],
  }
}));

export default Roles;
