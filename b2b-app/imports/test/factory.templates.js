import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Templates from '/imports/api/templates/schema'

Factory.define('templates', Templates, {})
