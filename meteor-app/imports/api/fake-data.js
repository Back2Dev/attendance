import faker from 'faker'
import { JOB_STATUS_READABLE } from '/imports/api/constants'

export const fakeJob = () => {

  // search items
  const name = faker.name.findName()
  const make = faker.random.arrayElement(['Apollo', 'Giant', 'Malvern Star', 'Specialized'])
  const color = faker.commerce.color()
  const email = faker.internet.email()
  const phone = faker.phone.phoneNumberFormat()
  const model = faker.random.arrayElement(['Trail Breaker', 'Samurai', 'Katana', 'Yukon', 'Cypress', 'Defy', 'CX1']) 
  const comment = 'This bike is amazing'
  const itemName = faker.random.arrayElement(['Tube', 'Cable', 'Tyre'])
  const mechanic = faker.name.findName()
  const assessor = faker.name.findName()
  const baseService = faker.random.arrayElement(['Minor Service', 'Major Service', 'Custom Service'])
  const status = parseInt(faker.random.arrayElement(Object.keys(JOB_STATUS_READABLE)))

  return {
    customerDetails: {
      name,
      phone,
      email,
      refurbishment: faker.random.boolean(),
    },
    bikeDetails: {
      make,
      model,
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
      baseService,
      totalServiceCost: 300,
    },
    parts: {
      partsItem: [
        {
          name: itemName,
          price: 100,
          code: "F",
          category: "tyre",
          used: faker.random.boolean()
        },
        {
          name: itemName,
          price: 100,
          code: "F",
          category: "tyre",
          used: faker.random.boolean()
        },
        {
          name: itemName,
          price: 100,
          code: "F",
          category: "tyre",
          used: faker.random.boolean()
        },
      ],
      totalPartsCost: 300,
    },
    additionalFees: 100,
    totalCost: 700,
    dropoffDate: new Date(),
    pickupDate: new Date(),
    urgent: faker.random.boolean(),
    assessor,
    mechanic,
    comment,
    temporaryBike: faker.random.boolean(),
    status,
    search: `${name} ${phone} ${email} ${make} ${model} ${color} ${comment} ${itemName} ${mechanic} ${assessor} ${baseService}`,
  }
}
