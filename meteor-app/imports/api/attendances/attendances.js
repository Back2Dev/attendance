import { Mongo } from 'meteor/mongo';

const Attendances = new Mongo.Collection('attendances');

Attendances.attachSchema(
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

export default Attendances;
