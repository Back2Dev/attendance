import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Teams from '/imports/api/teams/schema'

Factory.define('teams', Teams, {})
