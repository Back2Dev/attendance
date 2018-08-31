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
  const mechanic = faker.name.findName()
  const assessor = faker.name.findName()
  const baseService = faker.random.arrayElement(['Minor Service', 'Major Service', 'Custom Service'])
  const status = parseInt(faker.random.arrayElement(Object.keys(JOB_STATUS_READABLE)))
  const additionalFees = Math.round((Math.random()*(20000-1000)+1000) / 500)*500
  const partsItem = [
    {
      name: faker.random.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: Math.round((Math.random()*(9000-500)+500) / 500)*500,
      code: "O",
      category: "other",
      used: faker.random.boolean()
    },
    {
      name: faker.random.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: Math.round((Math.random()*(9000-500)+500) / 500)*500,
      code: "O",
      category: "other",
      used: faker.random.boolean()
    },
    {
      name: faker.random.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: Math.round((Math.random()*(9000-500)+500) / 500)*500,
      code: "O",
      category: "other",
      used: faker.random.boolean()
    },
  ]
  const totalPartsCost = partsItem.map(item => {
    return item.price
  })
  .reduce((a, b) => a + b)
  
  const serviceItem = [
    {
      name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
      price: Math.round((Math.random()*(2000-500)+500) / 500)*500,
    },
    {
      name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
      price: Math.round((Math.random()*(2000-500)+500) / 500)*500,
    },
    {
      name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
      price: Math.round((Math.random()*(2000-500)+500) / 500)*500,
    },
  ]
  const totalServiceCost = serviceItem.map(item => {
    return item.price
  })
  .reduce((a, b) => a + b)

  return {
    _id: Math.round((Math.random()*200)*500),
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
      bikeValue: Math.round((Math.random()*(50000-10000)+10000) / 5000)*5000,
      sentimentValue: faker.random.boolean(),
    },
    services: {
      serviceItem,
      baseService,
      totalServiceCost,
    },
    parts: {
      partsItem,
      totalPartsCost,
    },
    additionalFees,
    totalCost: totalServiceCost + totalPartsCost + additionalFees,
    dropoffDate: new Date(),
    pickupDate: new Date(),
    urgent: faker.random.boolean(),
    assessor,
    mechanic,
    comment,
    temporaryBike: faker.random.boolean(),
    status,
    search: `${name} ${phone} ${email} ${make} ${model} ${color} ${comment} ${mechanic} ${assessor} ${baseService} ${JSON.stringify(partsItem)}`,
  }
}
