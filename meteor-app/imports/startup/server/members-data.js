import { Meteor } from 'meteor/meteor'; // base
import Members from '/imports/api/members/members';
import casual from 'casual';            // casual random data generator
import moment from 'moment'

Meteor.methods({
  'import.members'() {
    console.log('importing members....')
    throw new Meteor.Error("Members import was moved to a private repo for security reasons")
    // const membersArray = JSON.parse(Assets.getText('members.json'))
    // membersArray.forEach(member => {
    //   Members.insert(member)
    // })
  },
  'seed.members'() {
    const n = 10
    // seed ensures same data is generated
    casual.seed(123);


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
        sessions: array_of(casual.integer(1, 10), () => ({ memberId: 'randomSession' })),
        lastIn: moment().subtract(casual.integer(1, 168), 'hours').toDate(),
        addressPostcode: casual.integer(3000, 4000),
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
  };
});