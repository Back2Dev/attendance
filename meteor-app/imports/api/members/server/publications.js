import { Meteor } from 'meteor/meteor';
import Members from '../members';

Meteor.publish('all.members', () => {
  return Members.find({}, { sort: { lastIn: -1, lastname: 1 } });
});

Meteor.publish('members.search', (query) => {
  return Members.find({
    $or: [
      { name: { $regex: new RegExp(query), $options: 'i' } },
      { email: { $regex: new RegExp(query), $options: 'i' } },
    ],
    isHere: false
  })

})