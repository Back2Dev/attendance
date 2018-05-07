/* global ValidatedMethod replaces>matb33:collection-hooks, 
   SimpleSchema */

import { Mongo } from 'meteor/mongo';

// note: mc prefix = MongoCollection
const Attendances = new Mongo.Collection('attendances');

Attendances.attachSchema(
  new SimpleSchema({
    atnPersonID: {
      type: String,
      label: "Attending Person ID",
      optional: false
    },
    atnDate: {
      type: Date,
      label: "Attendance Date",
      optional: false
    },
    atnHours: {
      type: Number,
      label: "Attended hours",
      min: 1,
      max: 6,
      optional: false
    }
  })
);


/* The key difference between insert and
   checkIn is checkIn defaults the attendance Date
   to today's Date
*/
/*
const insert = new ValidatedMethod({
  name: 'attendances.insert',
  validate: new SimpleSchema({
    text: { type: String },
  }).validator(),
  run({ text }) {
    Items.insert({
      createdAt: new Date(),
      text,
      isChecked: false,
    });
  },
});
*/

export default Attendances;
// export { insert, checkIn };
