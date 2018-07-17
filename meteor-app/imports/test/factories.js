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
import { RegExId } from '/imports/api/schema'

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
    part: "700c hybrid Wheel ME, eyeletted",
    price: 5000,
    qty: 1,
    partId: "frame",
    partNo: "sadasd",
    addedAt: new Date(),
    userId: "2ueueoaje",
  }],
  totalPrice: 9900,   // This is in cents

})

export default Factory
