import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Forms from '/imports/api/forms/schema'

Factory.define('forms', Forms, {})
