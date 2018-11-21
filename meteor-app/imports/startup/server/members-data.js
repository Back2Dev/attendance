import { Meteor } from 'meteor/meteor' // base
import Members from '/imports/api/members/members'
import Rejects from '/imports/api/members/rejects'
import casual from 'casual'            // casual random data generator
import moment from 'moment'
const debug = require('debug')('b2b:members')

// A little deviousness on allowing bulk import of member data
//
// 1) The server needs to be run with DEBUG=b2b:members
// 2) The /private/members.json folder must exist (won't happen in prod)
// 3) You can do a Meteor.call('import.members','Special member')
//
casual.seed(+new Date()) // Just use the current time as a seed
const specialMember = casual.full_name
// const specialMember='Jayne Rutherford'
debug(`Special member = ${specialMember}`)

Meteor.methods({
  'import.members'(secret) {
    if (secret === specialMember) {
      //
      // Clean up
      //
      Rejects.remove({})
      Members.remove({})

      debug('importing members....')
      const membersArray = JSON.parse(Assets.getText('members.json'))
      membersArray.forEach(member => {
        try {
          member.name = `${member.firstname} ${member.lastname}`
          const existing = Members.findOne({ email: member.email })
          if (existing) {
            debug(`${member.name} exists already`)
            member.reason = "Duplicate"
            Rejects.insert(member)
          } else {
            debug("+ " + member.name)
            Members.insert(member)
          }
        } catch (error) {
          debug(`Error [${error.message}], Failed to import `, member)
          member.reason = error.message
          Rejects.insert(member)
        }
      })
    } else {
      throw new Meteor.Error(`Members import was moved to a private repo 
        for security reasons (unless you know a secret code)`)
    }
  },
  'seed.members'() {
    const n = 10
    // seed ensures same data is generated
    casual.seed(123)

    const array_of = function (times, generator) {
      let result = [];
      for (let i = 0; i < times; ++i) {
        result.push(generator());
      }
      return result;
    };

    casual.define('member', function () {
      return {
        avatar: `${casual.integer(1, 10)}.jpg`,
        sessionCount: casual.integer(1, 10),
        sessions: array_of(casual.integer(1, 16), () => ({ memberId: 'randomSession' })),
        lastIn: moment().subtract(casual.integer(1, 168), 'hours').toDate(),
        addressPostcode: casual.integer(3000, 4000).toString(),
        addressState: "VIC",
        addressStreet: casual.address1,
        addressSuburb: casual.random_element(["Melbourne", "St Kilda", "Middle Park", "South Melbourne"]),
        bikesHousehold: casual.integer(1, 10),
        email: casual.email,
        emergencyContact: casual.full_name,
        emergencyEmail: casual.email,
        emergencyMobile: casual.phone,
        emergencyPhone: casual.phone,
        mobile: casual.phone,
        name: casual.full_name,
        phone: casual.phone,
        workStatus: casual.random_element(["Full Time", "Part Time", "Pension/Disability", "Unemployed", "Student", "Retired"]),
        reasons: casual.sentences(3),
        primaryBike: casual.random_element(["Road/racer", "Hybrid", "Mountain", "Cruiser", "Ladies", "Gents", "Fixie/Single Speed"]),
      }
    })

    const membersArray =
      array_of(n, () => casual.member)
        .forEach(r => Members.insert(r))
  }
})

Meteor.startup(() => {
  if (Members.find().count() === 0) {
    Meteor.call('seed.members')
  }

  // Migration script, give all records an isSuper field
  Members.update(
    { "isSuper": { $exists: false } },
    { $set: { isSuper: false } },
    { multi: true },
  )

  // Migration script, Set Mark to isSuper
  Members.update(
    { name: "Mark Bradley" },
    { $set: { isSuper: true } },
  )
  // Migration script, give all records a default pin
  // Members.update(
  //   { "pin": { $exists: false } },
  //   { $set: { pin: '12         34' } },
  //   { multi: true }
  // )
})