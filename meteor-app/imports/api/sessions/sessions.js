import { Mongo } from 'meteor/mongo';

const Sessions = new Mongo.Collection('sessions');

Sessions.attachSchema(
  new SimpleSchema({
    memberId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      label: "Session Member id",
      optional: false
    },
    timeIn: {
      type: Date,
      label: "Visit start time",
      optional: false
    },
    timeOut: {
      type: Date,
      label: "Visit end time",
      optional: false
    },
    duration: {
      type: Number,
      label: "Duration in hours",
      optional: false
    },
  })
)

export default Sessions
