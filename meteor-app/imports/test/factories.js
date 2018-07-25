/**
 * test factories.
 * configure our factories here and return the Factory module.
 */
import { Meteor } from 'meteor/meteor';
import faker from 'faker';
import { Factory } from 'meteor/dburles:factory';
import { Random } from 'meteor/random';

import CONSTANTS from '/imports/api/constants'
// publications
import Members from '/imports/api/members/members'
import Sessions from '/imports/api/sessions/sessions'
import Orders from '/imports/api/orders/schema'
import Parts from '/imports/api/parts/schema'
import { RegExId } from '/imports/api/schema'

import Assessment from '/imports/api/assessments/assessment'
import Services from '/imports/api/assessments/services'
import ServiceItems from '/imports/api/assessments/serviceItems'
import Logger from '/imports/api/assessments/logger'

Factory.define('member', Members, {
  name: () => faker.name.findName(),
  email: () => faker.internet.email(),
  // TODO - the rest of these
  // isHere: true,
  // avatar: '7.jpg',
  // sessions:
  //   [{ memberId: 'randomSession' },
  //   { memberId: 'randomSession' }],
  // lastIn: new Date(),
  // joined: new Date(),
  // addressPostcode: "3428",
  // addressState: 'VIC',
  // addressStreet: '199 Henderson Spur',
  // addressSuburb: 'South Melbourne',
  // bikesHousehold: 5,
  // email: 'Jelly.Belly@smells.nasty.com',
  // emergencyContact: 'Everett Mosciski',
  // emergencyEmail: 'Ibrahim.Flatley@gmail.com',
  // emergencyMobile: '848-220-5422',
  // emergencyPhone: '848-924-0182',
  // mobile: '352-485-4816',
  // name: 'Orie Kautzer',
  // phone: '144-467-2060',
  // workStatus: 'Student',
  // reasons: `My love of bikes started as a child. It was my transport growing up, 
  //   I had no money to pay for repairs, so I had to fix it myself. My best bike 
  //   was a white Sun 10 speed racer. I saved up for months to buy it. I saved
  //   money from my paper round, and my dad threw some money in too.
  // `,
  // primaryBike: 'Racer',
})

Factory.define('session', Sessions, {
  memberId: Random.id(),
  timeIn: new Date(),
  timeOut: new Date(),
  duration: faker.random.number(6),
})

Factory.define('order', Orders, {
  status: CONSTANTS.ORDER_STATUS_NEW,
  orderedParts: [{
    name: '700c hybrid Wheel ME, eyeletted',
    price: 5000,
    qty: 1,
    partId: 'frame',
    partNo: 'sadasd',
    addedAt: new Date(),
    userId: '2ueueoaje',
  }],
  totalPrice: 9900,   // This is in cents
})

Factory.define('assessment', Assessment, {
  customerDetails: {
    name: faker.name.findName(),
    phone: faker.phone.phoneNumber(),
    email: faker.internet.email(),
    refurbishment: faker.random.boolean(),
  },
  bikeDetails: {
    make: faker.commerce.productName(),
    model: 'TX-1234',
    color: faker.commerce.color(),
    bikeValue: Math.round(faker.finance.amount()),
    sentimentValue: faker.random.boolean(),
  },
  services: {
    serviceItem: [
      {
        name: 'Fix tyre',
        price: 5000,
      },
      {
        name: 'Fix handle bar',
        price: 3000,
      }
    ],
    baseService: 'Minor Service',
    totalServiceCost: 8000,
  },
  parts: {
    partsItem: [
      {
        name: 'Handle Bar',
        price: 2000,
      }
    ],
    totalPartsCost: 2000,
  },
  additionalFees: 1500,
  totalCost: 11500,
  dropoffDate: faker.date.future(),
  pickupDate: faker.date.future(),
  urgent: faker.random.boolean(),
  assessor: faker.name.findName(),
  mechanic: faker.name.findName(),
  comment: 'Thorough cleaning of the bike is required',
  temporaryBike: faker.random.boolean(),
  status: 2,
  search: faker.name.findName(),
})

Factory.define('logs', Logger, {
  user: faker.name.findName(),
  requestType: 'Update form',
  requestBody: faker.random.words()
})

Factory.define('parts', ServiceItems, {
  name: faker.commerce.productName(),
  price: Math.round(faker.commerce.price() * 100)
})

Factory.define('services', Services, {
  name: faker.commerce.productName(),
  price: Math.round(faker.commerce.price()),
  package: 'Minor'
})

Factory.define('part', Parts, {
  imageUrl: '/public/images/logo-large.jpg',
  retailPrice: 6666, // This is in cents
  wholesalePrice: 3333,
  partNo: 'pt-123',
  name: 'carbonfibre frame',
  barcode: '22413000022413',
  status: CONSTANTS.ORDER_STATUS_NEW,
})

export default Factory
