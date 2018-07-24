import { Meteor } from 'meteor/meteor' // base
import Parts from '/imports/api/parts/schema'
import Orders from '/imports/api/orders/schema'
import casual from 'casual'

const path = require('path')
const fs = require('fs')
const debug = require('debug')('b2b:parts')


const partSeedJSON = require("./parts-seed.json")

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
  async 'seed.parts'() {
    for (part of partSeedJSON) {
      // deconstruct the part object
      const {
        Barcode, PartNo, Description, DefaultPrice
      } = part
      function calcRetail(price){
        const wholesalePrice = (parseInt(price, 10) * 100) * 1.5
        return parseInt(wholesalePrice, 10)
      }
      try {
        // insert them one by one
         await Parts.insert({
          partNo: PartNo,
          barcode: Barcode,
          // parts data doesnt have name, lets use description
          name: Description,
          // price given is in dollars, lets convert to cents
          wholesalePrice: parseInt(DefaultPrice * 100),
          // we need to put retail function in here once its done
          retailPrice: calcRetail(DefaultPrice),
        })
      } catch(e){
        // log error
        debug("Error seeding parts: ", e)
      }
    }
  },
  // this is an example of how we might update the parts data
  async 'update.parts'(streamFile) {
    for (part of partSeedJSON) {
      // deconstruct the part object
      const {
        Barcode, PartNo, Description, DefaultPrice
      } = part
      try {
        // insert them one by one
        await Parts.update({
          // find parts by partNo
          partNo: PartNo,
        }, {
          // update these keys
          barcode: Barcode,
          name: Description,
          wholesalePrice: DefaultPrice * 100,
          // retail function here please
          retailPrice: DefaultPrice * 100 + 500
        }, {
          // if not found, create a whole new record
          upsert: true
        })
      } catch(e){
        debug(e)
        // log parts that didnt insert
      }
    }
  },
  async 'seed.orders'() {
    try {
      await Orders.insert ({
        status: 1,
        additionalNotes: null,
        orderedParts: [],
        totalPrice: 0,
      })
    
    } catch(e) {
      console.log(e)
    }
    

  },
})

Meteor.startup(() => {
  if (Parts.find().count() === 0) {
    Meteor.call('seed.parts')
  }
  if (Orders.find().count() === 0) {
    Meteor.call('seed.orders')
  }
})

