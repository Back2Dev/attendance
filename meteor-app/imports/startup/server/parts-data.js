import { Meteor } from 'meteor/meteor' // base
import Parts from '/imports/api/parts/schema'
import Orders from '/imports/api/orders/schema'
import casual from 'casual'

const path = require('path')
const fs = require('fs')
const debug = require('debug')('b2b:parts')
const partFile = require("./parts-seed.json")


Meteor.methods({
    async 'seed.parts'() {
      console.log('#seeding parts')
    for (part of partFile) {
      // deconstruct the part object
      console.log('#seeding parts, total numer: ',partFile.length)
      const {
        Barcode, PartNo, Description, DefaultPrice
      } = part
      function calcRetail(price){
        if (price <= 6000) {
          const retailPrice = (parseInt(price, 10) * 100) * 2
          return retailPrice
        }
        else if (price > 6000 && price <= 10000) {
          const retailPrice = (parseInt(price, 10) * 100) * 1.5
          return retailPrice
        }
        else if (price > 10000) {
          const retailPrice = (parseInt(price, 10) * 100) * 1.3
          return retailPrice
        }
        else {
          return console.error('Error, not a number')
        }
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
          imageUrl: '/images/logo-large.jpg'
        })
      } catch(e){
        console.log(e)


      }
    }
  },
  // this is an example of how we might update the parts data
  async 'update.parts'(streamFile) {
    for (part of partFile) {
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
