import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import log from '/imports/lib/server/log'
import CONSTANTS from '/imports/api/constants.js'
import OrderEmails from '/imports/api/orderemails/schema'
import Parts from '/imports/api/parts/schema'
import { calcRetail } from '/imports/api/parts/methods'
import testData from '/imports/test/bpw-emails'
import extractors from './order-extractors'

const emlformat = require('eml-format')
const debug = require('debug')('b2b:orders')

const toCents = amount => parseInt(Math.round(100 * parseFloat(amount)))
//
// Utility routine to unpack the order into an object
// @params: text
// @returns: order object
const unpackOrder = (text, extractors) => {
  // debug('Unpacking orders from', text)
  const order = {
    orderedParts: [],
    status: CONSTANTS.ORDER_STATUS_SENT
  }
  // const tmp = ''
  text.split('\r\n').forEach((line, ix) => {
    // console.log(`${ix + 1} ${line}`)
    extractors.forEach(extractor => {
      const matches = line.match(extractor.regex)
      if (matches) {
        if (extractor.target) {
          if (extractor.unpacker) {
            order[extractor.target] = extractor.unpacker(order.orderedParts, matches)
          } else {
            switch (extractor.type) {
              case 'cents':
                order[extractor.target] = toCents(matches[1])
                break
              case 'float':
                order[extractor.target] = parseFloat(matches[1])
                break
              case 'int':
                order[extractor.target] = parseInt(matches[1])
                break
              default:
                order[extractor.target] = matches[1]
            }
          }
        }
      }
    })
  })

  debug('Order', order)
  return order
}

const readEmail = (raw) =>
  new Promise((resolve, reject) => {
    emlformat.read(raw, (error, data) => {
      if (error) return reject(error)
      resolve(data)
    })
  })

Meteor.methods({
  'import.emails': async function () {
    await OrderEmails.removeAsync({})
    // Parts.remove({})
    await Orders.removeAsync({})
    await Meteor.callAsync('orders.email.read.mike', testData.mailbox, 'bpw')
  },
  'orders.insert': async function (order) {
    try {
      return await Orders.insertAsync(order)
    } catch (e) {
      log.error(e)
      throw new Meteor.Error(500, e.message)
    }
  },

  'orders.remove': async function (id) {
    try {
      log.info('removing order: ', id)
      return await Orders.removeAsync({ _id: id })
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'orders.removePart': async function (order, part, totalPrice) {
    totalPrice = totalPrice - part.price * part.qty
    const id = order._id
    try {
      log.info('removing part from current order', part)
      return await Orders.updateAsync(
        { _id: id },
        { $pull: { orderedParts: { partId: part.partId } }, $set: { totalPrice } }
      )
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'orders.addPart': async function (id, orderedPart, totalPrice) {
    try {
      log.info('updating order: ', orderedPart)
      return await Orders.updateAsync(
        { _id: id },
        { $push: { orderedParts: { ...orderedPart } }, $set: { totalPrice } }
      )
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },
  'order.updateQty': async function (id, orderedParts, totalPrice) {
    try {
      log.info('updating quantity to or der ')
      return await Orders.updateAsync(
        { _id: id },
        {
          $set: {
            orderedParts,
            totalPrice
          }
        }
      )
    } catch (e) {
      debug(`Error`, e.message)
      throw new Meteor.Error(500, e.message)
    }
  },

  'orders.email.read': async function (mailbox) {
    // Extract emails from Thunderbird into OrderEmails
    let emails = mailbox.split('From ')

    for (let num = 1; num < emails.length; num++) {
      let email = 'From ' + emails[num]

      // Parse the email
      let parsedEmail
      try {
        parsedEmail = await readEmail(email)
      } catch (error) {
        console.log(error)
        continue
      }

      // Save the email to the collection
      let found = 'Unknown'
      try {
        parsedEmail.date = parsedEmail.date.toString()
        found = await OrderEmails.findOneAsync({ date: parsedEmail.date })

        if (found == null && parsedEmail.subject === 'BPW Order Confirmation') {
          parsedEmail['status'] = 'unknown'
          let _id = await OrderEmails.insertAsync(parsedEmail)
          parsedEmail['_id'] = _id
        }
      } catch (e) {
        debug(`Error`, e.message)
        throw new Meteor.Error(500, e.message)
      }
      if (found == null) {
        //Parse the text portion of the email
        const text = parsedEmail.text
        let partOfText = text.split('Order Number:')
        const orderNumber = partOfText[1].split('\r\n')[0].trim()

        partOfText = text.split('Date Ordered:')
        const dateOrdered = partOfText[1].split('\r\n')[0].trim()

        partOfText = text.split('Products')
        partOfText = partOfText[1].split('\r\n\r\n')
        partOfText = partOfText[0].split('\r\n')
        let partsOrdered = []
        let parts = []
        let totalPrice = 0
        let totalQty = 0
        for (let number = 2; number < partOfText.length; number++) {
          const qty = partOfText[number].split('x')[0].trim()
          totalQty += parseInt(qty)

          let partOfText1 = partOfText[number].split('(')
          const partNo = partOfText1[partOfText1.length - 1].split(')')[0].trim()

          partOfText1 = partOfText[number].split('$')
          const price = partOfText1[partOfText1.length - 1].trim()
          totalPrice += parseFloat(price)

          const pricePerItem = price / qty

          let position = partOfText[number].indexOf('x')
          partOfText1 = partOfText[number].substring(position + 1)
          position = partOfText1.lastIndexOf('(')
          const description = partOfText1.substring(0, position).trim()

          partsOrdered[number - 2] = {
            name: description,
            partNo: partNo,
            partId: partNo,
            addedAt: new Date(),
            price: (parseFloat(price) * 100).toFixed(0),
            qty: qty,
            userId: 'Yunfeng Song'
          }

          parts[number - 2] = {
            retailPrice: (parseFloat(pricePerItem) * 100).toFixed(0),
            wholesalePrice: (parseFloat(pricePerItem) * 100).toFixed(0),
            partNo: partNo,
            name: description
          }
        }

        partOfText = text.split('Sub-Total: $')
        const subtotal = partOfText[1].split('\r\n')[0].trim()

        partOfText = text.split('GST: $')
        const gst = partOfText[1].split('\r\n')[0].trim()

        partOfText = text.split('Total: $')
        const total = partOfText[1].split('\r\n\r\n')[0].trim()

        partOfText = text.split('Purchase Order No:')
        const purchaseOrderNo = partOfText[1].trim()

        const order = {
          totalPrice: (parseFloat(total) * 100).toFixed(0),
          orderedParts: partsOrdered,
          status: CONSTANTS.ORDER_STATUS_NEW
        }

        if (subtotal === totalPrice.toFixed(2) && totalQty >= 1) {
          //update good in orderemails
          await OrderEmails.updateAsync(parsedEmail, { $set: { status: 'good' } })

          //add a new order to the database
          order['additionalNotes'] = parsedEmail['_id']
          await Orders.insertAsync(order)
          //find parts
          for (let number = 0; number < parts.length; number++) {
            const foundPart = await Parts.findOneAsync({ partNo: parts[number]['partNo'] })
            // TODO: put partId in partsOrdered
            if (foundPart == null) {
              //update status
              parts[number]['status'] = CONSTANTS.PART_STATUS_AUTO_CREATED
              await Parts.insertAsync(parts[number])
              log.info('A new part has been created: ', parts[number]['partNo'])
            }
          }
        } else {
          //update broken in orderemail
          await OrderEmails.updateAsync(parsedEmail, { $set: { status: 'broken' } })
        }
      }
    }
  },

  'orders.email.read.mike': async function (mailbox, supplierCode) {
    // Extract emails from Thunderbird into OrderEmails
    let emails = mailbox.split('From ')

    for (const msg of emails) {
      // Parse the email
      // let parsedEmail

      try {
        const parsedEmail = await readEmail(`From ${msg}`)

        // Save the email to the collection
        if (parsedEmail.date) {
          parsedEmail.date = parsedEmail.date.toString()
          const found = await OrderEmails.findOneAsync({ date: parsedEmail.date })

          if (!found && parsedEmail.subject === 'BPW Order Confirmation') {
            parsedEmail.status = 'unknown'
            parsedEmail._id = await OrderEmails.insertAsync(parsedEmail)

            // Unpack the text portion of the email into a raw order object
            const order = unpackOrder(parsedEmail.text, extractors[supplierCode])

            //
            // Now we do a little post-processing to:
            //   1) Check for consistency
            //   2) Add more info
            //
            const total = order.orderedParts.reduce((acc, part) => (acc = acc + part.price * part.qty), 0)
            if (total !== order.subTotal) {
              await OrderEmails.updateAsync(parsedEmail, { $set: { status: 'broken' } })
            } else {
              // Find partIds from DB
              for (const part of order.orderedParts) {
                const foundPart = await Parts.findOneAsync({ partNo: part.partNo })
                if (foundPart) {
                  part.partId = foundPart._id
                  part.userId = 'system'
                  log.info(`Found part ${part.partNo} ${foundPart.wholesalePrice}/${foundPart.retailPrice}`)
                } else {
                  // Create a new part with status 'auto-created'
                  const newPart = {
                    status: CONSTANTS.PART_STATUS_AUTO_CREATED,
                    retailPrice: calcRetail(part.price),
                    wholesalePrice: part.price,
                    partNo: part.partNo,
                    userId: 'system'
                  }
                  part.partId = await Parts.insertAsync(newPart)
                  part.addedAt = new Date()
                  part.userId = 'system'

                  // name: {
                  // partId: {
                  // partNo: {
                  // addedAt: {
                  // price: {
                  // qty: {
                  // userId: {

                  log.info(`A new part has been created: ${part.partNo}`)
                }
              }
              //TODO: MOdify the orders schema to have an optional orderEmailId
              order['additionalNotes'] = parsedEmail._id
              await Orders.insertAsync(order)
            }
          }
        }
      } catch (e) {
        log.error(e.message)
        // throw new Meteor.  Error(500, e.message)
      }
    }
  }
})
