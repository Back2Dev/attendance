import { Meteor } from 'meteor/meteor';
import Orders from '../schema'

Meteor.publish('all.orders', () => {
  return Orders.find({})
});
