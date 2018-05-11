import { Meteor } from 'meteor/meteor'; // base
import Roles from '/imports/api/roles/roles';
import casual from 'casual';            // casual random data generator

Meteor.startup(() => {

  if (Roles.find().count() === 0) {

    casual.define('role', function () {
      return {
        firstname: casual.first_name,
        lastname: casual.last_name,
        avatar: `${casual.integer(1, 10)}.jpg`,
      };
    });

    // number of seeds
    const ROLES = 10

    // seed ensures same data is generated
    casual.seed(123);

    const array_of = function (times, generator) {
      let result = [];
      for (let i = 0; i < times; ++i) {
        result.push(generator());
      }
      return result;
    };

    let rolesArray = array_of(ROLES, () => casual.role);

    rolesArray.forEach(r => Roles.insert(r))
  };
});
