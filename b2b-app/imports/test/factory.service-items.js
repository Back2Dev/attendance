import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import ServiceItems from '/imports/api/service-items/schema'

Factory.define('serviceItems', ServiceItems, {})
