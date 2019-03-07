import { Meteor } from 'meteor/meteor';
import Members from '../schema';

Meteor.publish('all.members', () => {
  return Members.find({}, { sort: { joined: -1, lastIn: -1, name: 1 } });
});

Meteor.publish('members.names', () => {
  return Members.find({}, { fields: {name: 1}, sort: { joined: -1, lastIn: -1, name: 1 } });
});