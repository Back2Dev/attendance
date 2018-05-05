/* global ValidatedMethod replaces>matb33:collection-hooks,
   SimpleSchema */

import { Mongo } from 'meteor/mongo';
import * as sg from 'sugar';              // sugar utility

// note: mc prefix = MongoCollection
const People = new Mongo.Collection('people');

People.attachSchema(new SimpleSchema({
  firstname: {
    type: String,
    label: "Name",
    max: 128,
    optional: false
  },
  surname: {
    type: String,
    label: "Surname",
    max: 128,
    optional: false
  },
  pplPhone: {
    type: String,
    label: "Phone",
    max: 128,
    optional: true
  },
  pplEmail: {
    type: String,
    label: "Email",
    max: 128,
    optional: true
  },
  pplIsVol: {
    type: Boolean,
    label: "Is a volunteer",
    defaultValue: true,
		optional: true
  },
  pplIsSuper: {
    type: Boolean,
    label: "Is a supervisor",
    defaultValue: false,
		optional: true
  },
  pplIsAdmin: {
    type: Boolean,
    label: "Is a sysADMIN",
    defaultValue: false,
		optional: true
  },
  lastIn: {
    type: Date,
    label: "Last Attended Date",
    optional: false
  },
  avatar: {
    type: String,
    label: "Avatar file name",
    optional: true
  },
}));

const insert = new ValidatedMethod({
  name: 'people.insert',
  validate: new SimpleSchema({
    firstname: { type: String },
    surname: { type: String },
    pplPhone: { type: String },
    pplEmail: { type: String },
    avatar: { type: String, optional: true },
  }).validator(),
  run(data) {
    const {
      firstname,
      surname,
      pplPhone,
      pplEmail,
      avatar,
    } = data;

    const doc = {
      firstname,
      surname,
      pplPhone,
      pplEmail,
      avatar,
      lastIn: sg.Date.create('yesterday'),
    };

    console.log("Here is the data:" , data);
    console.log("Here is the doc:", doc);
    // console.log(data, doc);

    People.insert(doc);
  },
});

const remove = new ValidatedMethod({
  name: 'people.remove',
  validate: new SimpleSchema({
    _id: { type: String },
  }).validator(),
  run({ _id }) {
    People.remove(_id);
  },
});

export default People;
export { insert, remove };
