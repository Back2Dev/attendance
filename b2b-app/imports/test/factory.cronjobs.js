import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Cronjobs from '/imports/api/cronjobs/schema'

Factory.define('cronjobs', Cronjobs, {
  name: 'Cronus',
  frequency: '1 h',
  type: 'Cronjob test',
})
