import faker from 'faker'
import { Factory } from 'meteor/dburles:factory'
import { Random } from 'meteor/random'
import CONSTANTS from '/imports/api/constants'
import Jobs from '/imports/api/jobs/schema'

console.log('Job Factory')

Factory.define('jobs', Jobs, {})

Factory.define('job', Jobs, {
  make: faker.lorem.words(2),
  model: faker.lorem.word(),
  color: faker.lorem.word(),
  bikeType: faker.lorem.words(2),
  budget: 333,
  serviceItems: [
    {
      _id: 'KRXYB5n2AgjzYsLmk',
      name: 'Bottom Bracket - Octalink, Hollowtech etc',
      price: 2200,
      code: 'O',
      category: 'other',
      used: false,
    },
  ],
  note: faker.lorem.words(5),
  totalCost: 2200,
  dropoffDate: faker.date.recent(),
  pickupDate: faker.date.future(),
  urgent: false,
  isRefurbish: false,
  status: 'new',
  paid: false,
  history: [],
  createdAt: faker.date.recent(),
  updatedAt: faker.date.recent(),
})
