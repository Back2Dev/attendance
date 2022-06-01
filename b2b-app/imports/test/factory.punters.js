import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Punters from '/imports/api/punters/schema'

Factory.define('punters', Punters, {})
