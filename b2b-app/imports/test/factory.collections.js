import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Collections from '/imports/api/collections/schema'

Factory.define('collections', Collections, {
  name: () => faker.lorem.word(),
  active: true,
  views: [{ slug: 'default', name: 'Default' }],
})
