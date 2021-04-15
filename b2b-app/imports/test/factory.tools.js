import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Tools from '/imports/api/tools/schema'

Factory.define('tools', Tools, {})
