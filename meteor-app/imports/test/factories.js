/**
 * test factories.
 * configure our factories here and return the Factory module.
 */
import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';
import _ from 'lodash';

// publications
import Members from '/imports/api/members/members'
import Sessions from '/imports/api/sessions/sessions'


Factory.define('member', Members, {
  name: () => faker.name.findName(),
  email: () => faker.internet.email(),
})

export default Factory
