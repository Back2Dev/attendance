import { Meteor } from 'meteor/meteor';
import Orders from '../orders';

Meteor.publish('all.orders', () => {
  return Orders.find({})
});
