import { faker } from '@faker-js/faker'
import { LOG_EVENT_TYPES, JOB_STATUS, JOB_STATUS_READABLE } from '/imports/api/constants'
import { randomId } from './util'

faker.seed(888)

export const fakeJob = seed => {
  // For snapshot testing, allow a seed to be passed in
  if (seed) {
    faker.seed(seed)
  }
  // search items
  const name = faker.person.fullName()
  const make = faker.helpers.arrayElement(['Apollo', 'Giant', 'Malvern Star', 'Specialized'])
  const color = faker.color.human()
  const email = faker.internet.email()
  const phone = faker.phone.number()
  const model = faker.helpers.arrayElement(['Trail Breaker', 'Samurai', 'Katana', 'Yukon', 'Cypress', 'Defy', 'CX1'])
  const comment = 'This bike is amazing'
  const mechanic = faker.person.fullName()
  const assessor = faker.person.fullName()
  const baseService = faker.helpers.arrayElement(['Minor Service', 'Major Service', 'Custom Service'])
  const status = parseInt(faker.helpers.arrayElement(Object.keys(JOB_STATUS_READABLE)))
  const additionalFees = faker.number.int({ max: 4000 })
  const discount = faker.number.int({ max: 2000 })
  const partsItem = [
    {
      name: faker.helpers.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: faker.number.int({ max: 6000 }),
      code: 'O',
      category: 'other',
      used: faker.datatype.boolean()
    },
    {
      name: faker.helpers.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: faker.number.int({ max: 6000 }),
      code: 'O',
      category: 'other',
      used: faker.datatype.boolean()
    },
    {
      name: faker.helpers.arrayElement(['Tube', 'Cable', 'Front Tyre', 'Bell', 'Back Tyre']),
      price: faker.number.int({ max: 6000 }),
      code: 'O',
      category: 'other',
      used: faker.datatype.boolean()
    }
  ]
  const totalPartsCost = partsItem
    .map(item => {
      return item.price
    })
    .reduce((a, b) => a + b)

  const serviceItem = [
    {
      name: faker.helpers.arrayElement([
        'Check functionality/adjust brakes and gears',
        'Remove, clean and oil chain',
        'Check wheels are true'
      ]),
      price: faker.number.int({ max: 2000 })
    },
    {
      name: faker.helpers.arrayElement([
        'Check functionality/adjust brakes and gears',
        'Remove, clean and oil chain',
        'Check wheels are true'
      ]),
      price: faker.number.int({ max: 2500 })
    },
    {
      name: faker.helpers.arrayElement([
        'Check functionality/adjust brakes and gears',
        'Remove, clean and oil chain',
        'Check wheels are true'
      ]),
      price: faker.number.int({ max: 3000 })
    }
  ]
  const totalServiceCost = serviceItem
    .map(item => {
      return item.price
    })
    .reduce((a, b) => a + b)

  return {
    customerDetails: {
      name,
      phone,
      email,
      isRefurbish: faker.datatype.boolean()
    },
    bikeDetails: {
      make,
      model,
      color,
      bikeValue: faker.number.int({ max: 50000 }),
      sentimentValue: faker.datatype.boolean()
    },
    services: {
      serviceItem,
      baseService,
      totalServiceCost
    },
    parts: {
      partsItem,
      totalPartsCost
    },
    _id: randomId(),
    additionalFees,
    discount,
    jobNo: 'JOB911',
    totalCost: totalServiceCost + totalPartsCost + additionalFees - discount,
    dropoffDate: new Date('2018-09-21T09:10+10:00'),
    pickupDate: new Date('2018-09-26T09:00+10:00'),
    createdAt: new Date('2018-09-21T09:00+10:00'),
    urgent: faker.datatype.boolean(),
    assessor,
    mechanic,
    comment,
    temporaryBike: faker.datatype.boolean(),
    status,
    search: `${name} ${phone} ${email} ${make} ${model} ${color} ${comment} ${mechanic} ${assessor} ${baseService} ${JSON.stringify(
      partsItem
    )}`
  }
}

// generates all logs up to current status
export const fakeLogs = (id, job) => {
  let logs = []
  for (let i = 1; i <= job.status; i++) {
    logs.push({
      aId: id,
      user: i === JOB_STATUS.NEW ? job.assessor : 'Anonymous',
      status: i,
      eventType: i === JOB_STATUS.NEW ? LOG_EVENT_TYPES.NEW_JOB : LOG_EVENT_TYPES.STATUS_UPDATE
    })
  }
  return logs
}
