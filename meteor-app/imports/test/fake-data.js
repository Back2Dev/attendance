import faker from 'faker'
import { LOG_EVENT_TYPES, JOB_STATUS, JOB_STATUS_READABLE } from '/imports/api/constants'

faker.seed(888)

export const fakeJob = (seed) => {

  // For snapshot testing, allow a seed to be passed in
  if (seed) {
    faker.seed(seed)
  }
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
  const additionalFees = faker.random.number(4000)
  const partsItem = [
    {
      name: faker.random.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: faker.random.number(6000),
      code: "O",
      category: "other",
      used: faker.random.boolean()
    },
    {
      name: faker.random.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: faker.random.number(6000),
      code: "O",
      category: "other",
      used: faker.random.boolean()
    },
    {
      name: faker.random.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: faker.random.number(6000),
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
      price: faker.random.number(2000),
    },
    {
      name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
      price: faker.random.number(2500),
    },
    {
      name: faker.random.arrayElement(['Check functionality/adjust brakes and gears', 'Remove, clean and oil chain', 'Check wheels are true']),
      price: faker.random.number(3000),
    },
  ]
  const totalServiceCost = serviceItem.map(item => {
    return item.price
  })
  .reduce((a, b) => a + b)

  return {
    customerDetails: {
      name,
      phone,
      email,
      isRefurbish: faker.random.boolean(),
    },
    bikeDetails: {
      make,
      model,
      color,
      bikeValue: faker.random.number(50000),
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
    dropoffDate: new Date('2018-09-21T09:10+10:00'),
    pickupDate: new Date('2018-09-26T09:00+10:00'),
    createdAt: new Date('2018-09-21T09:00+10:00'),
    urgent: faker.random.boolean(),
    assessor,
    mechanic,
    comment,
    temporaryBike: faker.random.boolean(),
    status,
    search: `${name} ${phone} ${email} ${make} ${model} ${color} ${comment} ${mechanic} ${assessor} ${baseService} ${JSON.stringify(partsItem)}`,
  }
}

    // generates all logs up to current status
    export const fakeLogs = (id, job) => {
      let logs = []
      for (let i = 1; i <= job.status; i++) {
        logs.push({
          aId: id,
          user: (i === JOB_STATUS.NEW) ? job.assessor : 'Anonymous',
          status: i,
          eventType: (i === JOB_STATUS.NEW) ? LOG_EVENT_TYPES.NEW_JOB : LOG_EVENT_TYPES.STATUS_UPDATE,
        })
      }
      return logs
    }