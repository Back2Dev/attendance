import { Meteor } from 'meteor/meteor';
import Roles from '../roles';

Meteor.publish('all.roles', function () {
  return Roles.find({}, { sort: { lastIn: 1, lastname: 1 } });
});
