import { Meteor } from 'meteor/meteor' // base
import Parts from '/imports/api/parts/schema'
import casual from 'casual'

const imagesUrls = [
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/4f8065b290713ff3dbca44641f3a52b5882c5e21.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/b574ff4cedc436ba4185849b666179acfcb9f1b0.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/28e301c326d101dadbdf52cf28cdb8f3e6bb0a4e.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/ef76b6b5a5d1b9f30db8db6a3da8a7c01d523a5b.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/0d629cb4986dc2e298ee30afd3dd89431dc7beca.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/a1bd6d38c8f70b572f1c75814f260538371a6645.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/57e14cd56d743a41459b30251cbc0a14c74c1b73.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/cc3e94374ecfc00e82c1eafdf626c03c5f5bd11f.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/bb751cf61ae9acd5fd514c2491f1911d811e544f.jpg',
  'http://cdn2.webninjashops.com/bicycleparts/images/resized/917b18f1ea145ca30274450651c6411434e37046.jpg',
  'http://cdn.webninjashops.com/bicycleparts/images/resized/556176e6d76f32931cb7b97b59de8cbd4068b3aa.png',
]

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
      imageUrl: imagesUrls[Math.floor(Math.random() * imagesUrls.length)],
      wholesalePrice: casual.integer(10, 200000),
      retailPrice: casual.integer(10, 200000),
      partNo: casual.integer(600000, 1000000).toString(),
      desc: casual.short_description,
      barcode: casual.integer(600000, 1000000),
    }
  })

  const partsList =
    arrayOf(n, () => casual.part)
    .forEach(r => Parts.insert(r))
},
})

Meteor.startup(() => {
    if (Parts.find().count() === 0) {
      Meteor.call('seed.parts')
    }
})

