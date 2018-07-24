import { Meteor } from 'meteor/meteor'
import Parts from '/imports/api/parts/schema'
import log from '/imports/lib/server/log'
import XLSX from 'xlsx'
const debug = require('debug')('b2b:parts')

async function updatePromise(part) {
  return new Promise(async (resolve, reject) => {
    const { partNo, name, barcode, wholesalePrice } = part
    debug("updatePromise: Adding Part: ", partNo)
    await Parts.update(
      {
        partNo: partNo,
      },
      {
        $set: {
          barcode,
          name,
          wholesalePrice: parseInt(wholesalePrice) * 100,
          retailPrice: parseInt(wholesalePrice),
        },
      },
      {
        upsert: true,
      },
      (err, res) => {
        if (res) {
          resolve(res)
        } else {
          reject(err)
        }
      }
    )
  })
}

async function updateParts(parts) {
  let count = 0
  return new Promise(async (resolve, reject) => {
    for (const part of parts) {
      try {
        // if(barcode != ""){
          await updatePromise(part)
        // }
        count++
      } catch (e) {
        reject(`Couldnt add: Part: ${part.partNo} \n${part.name} \n${e}\n\n`)
      }
    }
    resolve(count)
  })
}

Meteor.methods({
  'parts.insert'(part) {
    try {
      return Parts.insert(part)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },

  async 'parts.load'(data) {
    let countTotal = 0
    if (Meteor.isClient) return
    try {
      const parse = XLSX.read(data, { type: 'binary' })
      const wb = parse.Sheets
      const sheets = Object.keys(wb)
      for (const s of sheets) {
        try {
          const parts = XLSX.utils.sheet_to_json(wb[s], {
            raw: true,
            header: ['partNo', 'name', 'wholesalePrice', 'barcode'],
          })
          const sheetTotal = await updateParts(parts)
          countTotal += sheetTotal
        }catch(e){
          debug('Couldnt add ' + s + " " + e)
        }
      }
      return countTotal
    } catch (e) {
      debug(e)
      throw new Meteor.Error(500, e)
    }
  },
})
