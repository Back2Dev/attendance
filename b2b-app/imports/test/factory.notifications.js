import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Notifications from '/imports/api/notifications/schema'

Factory.define('notifications', Notifications, {})
