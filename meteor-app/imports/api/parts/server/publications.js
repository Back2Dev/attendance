import { Meteor } from 'meteor/meteor';
import Parts from '../schema';

Meteor.publish('all.parts', () => {
  return Parts.find({});
});
