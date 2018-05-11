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
    label: "checked in",
    optional: true
  }
}));

export default Roles;
