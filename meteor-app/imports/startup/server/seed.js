//import '/imports/startup/server';
import Roles from '/imports/api/roles/roles';

import { Meteor } from 'meteor/meteor'; // base
import sugar from 'sugar';              // sugar utility
import casual from 'casual';            // casual random data generator

Meteor.startup(() => {

  // seed ensures same data is generated
  casual.seed(1066);

  if (Roles.find().count() === 0) {
    var dftDate = sugar.Date.create('yesterday');
    var u = [
      {n: "Joseph",s: "Szili", lad: sugar.Date.create('today'), avatar: "1.jpg", isHere: true},
      {n: "Mikkel",s: "King", lad: sugar.Date.create('today'), avatar: "2.jpg", isHere: true},
    ];

    let i = 0;
    do {
      let randomInt = casual.integer(1,11)
      u.push({n: casual.first_name, s: casual.last_name, c: casual.boolean, lad: dftDate, avatar: randomInt+".jpg"})
      ++i;
    } while (i<10)

// Commenting in the next line will stop autopopulation of random volunteers
    // u = [];

    for (let p of u) {
      Roles.insert({
        firstname: p.n,
        isHere: p.c,
        lastname: p.s,
        lastIn: p.lad,
        avatar: p.avatar,
      });
    }
  };

});
