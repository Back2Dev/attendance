import { Meteor } from 'meteor/meteor'
import Parts from '/imports/api/parts/schema'
import log from '/imports/lib/server/log'
import XLSX from 'xlsx'
const debug = require('debug')('b2b:parts')

export function calcRetail(price) {
  if (price <= 6000) {
    try {
      const retailPrice = parseInt(price, 10) * 1.8
      return Math.round(retailPrice)
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  } else if (price > 6000 && price <= 10000) {
    try {
      const retailPrice = parseInt(price, 10) * 1.4
      return Math.round(retailPrice)
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  } else if (price > 10000) {
    try {
      const retailPrice = parseInt(price, 10) * 1.2
      return Math.round(retailPrice)
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  } else {
    return console.error('Error, not a number')
  }
}

async function upsertPart(part) {
  const { partNo, name, barcode, wholesalePrice } = part

  debug('updatePromise: Adding Part: ', partNo)
  return Parts.updateAsync(
    {
      partNo: partNo
    },
    {
      $set: {
        barcode,
        name,
        wholesalePrice: parseInt(wholesalePrice) * 100,
        retailPrice: calcRetail(wholesalePrice),
        imageUrl: '/images/logo-large.jpg'
      }
    },
    {
      upsert: true
    }
  )
}
async function updateParts(parts) {
  let count = 0
  for (const part of parts) {
    if (part.barcode) {
      try {
        await upsertPart(part)
        count++
      } catch (e) {
        throw new Error(`Couldn't add: Part: ${part.partNo} \n${part.name} \n${e}\n\n`)
      }
    }
  }
  return count
}

Meteor.methods({
  'parts.insert': async (part) => {
    try {
      return await Parts.insertAsync(part)
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  'parts.load': async data => {
    let countTotal = 0
    if (Meteor.isClient) return
    try {
      debug('Loading parts from spreadsheet data')
      const parse = XLSX.read(data, { type: 'binary' })
      const wb = parse.Sheets
      const sheets = Object.keys(wb)
      for (const s of sheets) {
        try {
          const parts = XLSX.utils.sheet_to_json(wb[s], {
            raw: true,
            header: ['partNo', 'name', 'wholesalePrice', 'barcode']
          })
          const sheetTotal = await updateParts(parts)
          countTotal += sheetTotal
        } catch (e) {
          console.error(`Couldn't add parts from worksheet ${s}: `, e)
        }
      }
      return countTotal
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  'rm.Parts': async (id) => {
    await Parts.removeAsync(id)
  },

  'update.Parts': async (form) => {
    const id = form._id
    delete form._id
    await Parts.updateAsync(id, { $set: form })
  },

  'add.Parts': async (form) => {
    await Parts.insertAsync(form)
  }
})
