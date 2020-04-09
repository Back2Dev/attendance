import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Sessions from '/imports/api/sessions/schema'

Factory.define('session', Sessions, {
  memberId: Random.id(),
  memberName: 'Dave Smith',
  // eventId:
  name: 'Daily volunteering',
  timeIn: new Date(),
  timeOut: new Date(),
  duration: faker.random.number(6)
})
