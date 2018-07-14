import { Meteor } from 'meteor/meteor' // base
import Parts from '/imports/api/parts/parts'
import casual from 'casual' 


Meteor.methods({
'seed.parts'() {
  const n = 10
// seed ensures same data is generated
  casual.seed(123)

  const arrayOf = function (times, generator) {
    let result = [];
    for (let i = 0; i < times; ++i) {
      result.push(generator());
    }
    return result;
  };

  casual.define('part', function () {
    return {
      imageUrl: '/public/images/logo-large.jpg',
      wholesalePrice: casual.integer(0, 20),
      retailPrice: casual.integer(0, 20),
      number: casual.integer(600000, 1000000),
      desc: casual.short_description,
      barcode: casual.integer(600000, 1000000),
    }
  })

  const partArray =
    arrayOf(n, () => casual.part)
    .forEach(r => Parts.insert(r))
},
})

Meteor.startup(() => {
    if (Parts.find().count() === 0) {
      Meteor.call('seed.parts')
    }
})