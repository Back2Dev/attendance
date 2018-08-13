import faker from 'faker'
import { JOB_STATUS_READABLE } from '/imports/api/constants'

export const fakeJob = () => {
  faker.seed(123)
  return {
    _id: '1234',
    customerDetails: {
      name: faker.name.findName(),
      phone: faker.phone.phoneNumberFormat(),
      email: faker.internet.email(),
      refurbishment: faker.random.boolean(),
    },
    bikeDetails: {
      make: faker.random.arrayElement(['Apollo', 'Giant', 'Malvern Star', 'Specialized']),
      model: 'bike model',
      color: 'red',
      bikeValue: faker.random.number({ min: 500, max: 100000 }),
      sentimentValue: faker.random.boolean(),
    },
    services: {
      serviceItem: [
        {
          name: 'item1',
          price: 3400,
        },
        {
          name: 'item2',
          price: 4500,
        },
        {
          name: 'item3',
          price: 6400,
        },
      ],
      baseService: 'Minor Service',
      totalServiceCost: 6700,
    },
    parts: {
      partsItem: [
        {
          name: 'item1',
          price: 3400,
        },
        {
          name: 'item2',
          price: 4500,
        },
        {
          name: 'item3',
          price: 6400,
        },
      ],
      totalPartsCost: 100,
      additionalFees: 4500,
      totalCost: 100,
    },
    totalCost: 12000,
    dropoffDate: new Date(),
    pickupDate: new Date(),
    urgent: faker.random.boolean(),
    assessor: 'Bob',
    mechanic: 'Mark',
    comment: 'This Bike Is Amazing',
    temporaryBike: faker.random.boolean(),
    status: faker.random.arrayElement([Object.keys(JOB_STATUS_READABLE)]),
    search: 'name bike make colour',
  }
}
