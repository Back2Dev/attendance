import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Profiles from '/imports/api/profiles/schema'

Factory.define('profiles', Profiles, {})
