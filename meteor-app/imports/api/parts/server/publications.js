import { Meteor } from 'meteor/meteor';
import Parts from '../parts';

Meteor.publish('all.parts', () => {
  return Parts.find({});
});