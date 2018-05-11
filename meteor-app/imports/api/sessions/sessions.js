import { Mongo } from 'meteor/mongo';

const Sessions = new Mongo.Collection('sessions');

Sessions.attachSchema(
  new SimpleSchema({
    roleId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "Session Person ID",
      optional: false
    },
    timeIn: {
      type: Date,
      label: "Session check in time",
      optional: false
    },
    timeOut: {
      type: Date,
      label: "Session check out time",
      optional: false
    },
    duration: {
      type: Number,
      label: "Session duration in hours",
      optional: false
    }
  })
);

export default Sessions;
