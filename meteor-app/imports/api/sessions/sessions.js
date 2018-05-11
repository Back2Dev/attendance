import { Mongo } from 'meteor/mongo';

const Sessions = new Mongo.Collection('sessions');

Sessions.attachSchema(
  new SimpleSchema({
    roleId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "Attending Person ID",
      optional: false
    },
    timeIn: {
      type: Number,
      label: "Attendance Check In Time",
      optional: false
    },
    timeOut: {
      type: Number,
      label: "Attendance Check Out Time",
      optional: false
    },
  })
);

export default Sessions;
