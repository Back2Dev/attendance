import { Meteor } from 'meteor/meteor';
import People from '/imports/collections/People';
import Attendances from '/imports/collections/Attendances';
import * as sg from 'sugar';              // sugar utility

// Pubs of People data
Meteor.publish('everyone', function() {
  return People.find({}, { sort: { lastIn: 1, surname: 1 } });
});

Meteor.publish("ready.for.checkin", function () {
  return People.find({lastIn: {$ne: sg.Date.create('today')}}, { sort: { lastIn: -1, surname: 1 }} );
});

Meteor.publish("checked.in", function () {
  return People.find({lastIn: {$eq: sg.Date.create('today')}} , { sort: { lastIn: -1, surname: 1 }} );
});

// Pubs of Attendance data
Meteor.publish("all.attendances", function () {
  return Attendances.find({}, { sort: { atnDate: 0, surname: 1 }} );
});

Meteor.publish("volunteers", function(search) {

  let query = {},
  projection = {limit: 10, sort: {firstname: 1}};
  
  if(search){
    let regex = new RegExp(search, 'i');

    query = {
      $or: [
        {firstname: regex},
        {surname: regex}
      ]
    };

    projection.limit = 100;
  }

  return volunteer.find(query, projection)
  
});
