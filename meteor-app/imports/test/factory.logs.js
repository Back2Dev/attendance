import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Logs from '/imports/api/logs/schema'

Factory.define('logs', Logs, {
  userId: Random.id(),
  status: 'success',
  type: 'event',
  description: 'Something happened',
  eventTime: new Date(),
})
