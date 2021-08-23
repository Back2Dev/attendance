import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import jobs from '/imports/api/jobs/schema'

Factory.define('job', Jobs, {})
