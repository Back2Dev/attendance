import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Audits from '/imports/api/audits/schema'

Factory.define('audits', Audits, {
  event: 'An event occurred',
  user: 'A user id',
  data: { status: 'ok' },
})
