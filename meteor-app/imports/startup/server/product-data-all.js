import { Meteor } from 'meteor/meteor' // base
import Products, { ProductTypes } from '/imports/api/products/schema'

import paProducts from './product-data-pa'
import paddleProducts from './product-data-paddle'
import b2bProducts from './product-data-b2b'
import b4hProducts from './product-data-b4h'
import Events from '/imports/api/events/schema'
import Promos from '/imports/api/promos/schema'

const config = [
  {
    collection: Products,
    element: 'products',
  },
  {
    collection: ProductTypes,
    element: 'productTypes',
  },
  {
    collection: Events,
    element: 'events',
  },
  {
    collection: Promos,
    element: 'promos',
  },
]

const fixtures = {
  pa: paProducts,
  b2b: b2bProducts,
  b4h: b4hProducts,
  paddle: paddleProducts,
}

Meteor.methods({
  'seed.products': async function (orgid, target) {
    try {
      if (!orgid) throw new Meteor.Error('Orgid not supplied')
      const data = fixtures[orgid]
      if (data && data[target]) {
        for (const item of config) {
          if (item.element === target) {
            for (const record of data[target]) {
              await item.collection.insertAsync(record)
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  },
  'update.products': async function (orgid, target) {
    try {
      if (!orgid) throw new Meteor.Error('Orgid not supplied')
      const data = fixtures[orgid]
      if (data && data[target]) {
        for (const item of config) {
          if (item.element === target) {
            for (const record of data[target]) {
              const rec = await item.collection.findOneAsync({
                code: record.code,
              })
              // console.log(`Checking ${target}`, rec)
              if (!rec) {
                console.warn(
                  `Could not find record for ${record.code}, adding now`
                )
                await item.collection.insertAsync(record)
              } else {
                if (!rec.subsType) {
                  await item.collection.updateAsync(
                    { code: record.code },
                    { $set: { subsType: record.subsType } }
                  )
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.log(e)
    }
  },
})

Meteor.startup(async () => {
  if (!Meteor.test) {
    for (const item of config) {
      if ((await item.collection.find().countAsync()) === 0) {
        await Meteor.callAsync(
          'seed.products',
          Meteor.settings.public.orgid,
          item.element
        )
      }
    }
    await Meteor.callAsync(
      'update.products',
      Meteor.settings.public.orgid,
      'products'
    )
  }
})
