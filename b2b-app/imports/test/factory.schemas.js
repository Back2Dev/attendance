import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Schemas from '/imports/api/schemas/schema'

Factory.define('schemas', Schemas, {})
