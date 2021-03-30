import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Settings from '/imports/api/settings/schema'

Factory.define('settings', Settings, {
  name: 'Background colour',
  type: 'string',
  key: 'background',
  value: 'red'
})
