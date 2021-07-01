import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Jobs from '/imports/api/jobs/schema'

Factory.define('jobs', Jobs, {})
