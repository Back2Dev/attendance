import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import MyCollection from '/imports/api/my-collection/schema'

Factory.define('myCollection', MyCollection, {})
