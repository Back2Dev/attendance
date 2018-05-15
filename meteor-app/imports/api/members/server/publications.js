import { Meteor } from 'meteor/meteor';
import Members from '../members';

Meteor.publish('all.members', function () {
  return Members.find({}, { sort: { lastIn: -1, lastname: 1 } });
});
