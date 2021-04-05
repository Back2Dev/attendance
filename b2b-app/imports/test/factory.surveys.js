import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Surveys from '/imports/api/surveys/schema'

Factory.define('surveys', Surveys, {
  survey: {},
  version: '1.0',
  active: true,
  slug: Random.id(),
  steps: [],
  primary: [],
  secondary: [],
})
