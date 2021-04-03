import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Triggers from '/imports/api/triggers/schema'

Factory.define('triggers', Triggers, {
  name: 'something happened',
  slug: 'some-thing',
  notifications: [],
})
