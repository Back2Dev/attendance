import { Meteor } from 'meteor/meteor'; // base
import Members from '/imports/api/members/members';
import casual from 'casual';            // casual random data generator

Meteor.methods({
  'remove.members'() {
    console.log('removing members....')
    Members.remove({})
  },
  'import.members'() {
    console.log('importing members....')
    const membersArray = JSON.parse(Assets.getText('members.json'))
    membersArray.forEach(member => {
      Members.insert(member)
    })
  },
  'seed.members'() {
    casual.define('member', function () {
      return {
        name: casual.first_name + ' ' + casual.last_name,
        avatar: `${casual.integer(1, 10)}.jpg`,
      };
    });

    // number of seeds
    const NUM_MEMBERS = 10

    // seed ensures same data is generated
    casual.seed(123);

    const array_of = function (times, generator) {
      let result = [];
      for (let i = 0; i < times; ++i) {
        result.push(generator());
      }
      return result;
    };

    let membersArray = array_of(NUM_MEMBERS, () => casual.member);

    membersArray.forEach(r => Members.insert(r))
  }
})
