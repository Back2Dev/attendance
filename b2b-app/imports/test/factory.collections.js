import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Collections from '/imports/api/collections/schema'

Factory.define('collections', Collections, {})
