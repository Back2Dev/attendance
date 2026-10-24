import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Standups from '/imports/api/standups/schema'

Factory.define('standups', Standups, {
  teamId: () => Random.id(),
  when: () => faker.date.recent(),
})
