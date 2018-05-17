import { Meteor } from 'meteor/meteor';
import Members from '../members';

Meteor.publish('all.members', function () {
  return Members.find({}, { sort: { lastIn: -1, lastname: 1 } });
});

Meteor.publish('members.search', function(query){
  check(query, String)

  if(query == '')
    return this.ready()

  return Members.search(query)
})