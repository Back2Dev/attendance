import faker from 'faker'
import { JOB_STATUS_READABLE } from '/imports/api/constants'

export const fakeJob = () => {
  // faker.seed(123)
  const name = faker.name.findName()
  const make = faker.random.arrayElement(['Apollo', 'Giant', 'Malvern Star', 'Specialized'])
  const color = faker.commerce.color()

  return {
    customerDetails: {
      name,
      phone: faker.phone.phoneNumberFormat(),
      email: faker.internet.email(),
      refurbishment: faker.random.boolean(),
    },
    bikeDetails: {
      make,
      model: faker.random.arrayElement(['TZ1000', 'Fireball', 'Chicken Dance', 'Zoom2000']),
      color,
      bikeValue: faker.random.number({ min: 500, max: 100000 }),
      sentimentValue: faker.random.boolean(),
    },
    services: {
      serviceItem: [
        {
          name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
          price: 100,
        },
        {
          name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
          price: 100,
        },
        {
          name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
          price: 100,
        },
      ],
      baseService: faker.random.arrayElement(['Minor Service', 'Major Service', 'Custom Service']),
      totalServiceCost: 300,
    },
    parts: {
      partsItem: [
        {
          name: 'Tube',
          price: 100,
        },
        {
          name: 'Cable',
          price: 100,
        },
        {
          name: 'Tyre',
          price: 100,
        },
      ],
      totalPartsCost: 300,
    },
    additionalFees: 100,
    totalCost: 700,
    dropoffDate: new Date(),
    pickupDate: new Date(),
    urgent: faker.random.boolean(),
    assessor: faker.name.findName(),
    mechanic: faker.name.findName(),
    comment: 'This Bike Is Amazing', 
    temporaryBike: faker.random.boolean(),
    status: parseInt(faker.random.arrayElement(Object.keys(JOB_STATUS_READABLE))),
    search: `${name} ${make} ${color}`,
  }
}
