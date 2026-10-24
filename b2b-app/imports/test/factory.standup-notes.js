import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import StandupNotes from '/imports/api/standup-notes/schema'

Factory.define('standupNotes', StandupNotes, {
  yesterday: () => faker.lorem.sentence(),
  today: () => faker.lorem.sentence(),
  blockers: () => faker.lorem.sentence(),
  userId: () => Random.id(),
  userName: () => faker.name.findName(),
})
