import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Events from '/imports/api/events/schema'

Factory.define('events', Events, {
  name: 'something happened',
  slug: 'some-thing',
  notifications: [],
})
