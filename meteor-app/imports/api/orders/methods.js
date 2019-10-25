import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import log from '/imports/lib/server/log'
import CONSTANTS from '/imports/api/constants.js'
import OrderEmails from '/imports/api/orderemails/schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'
import Parts from '/imports/api/parts/schema'

const debug = require('debug')('b2b:orders')
Meteor.methods({
  'orders.insert'(order) {
    try {
      return Orders.insert(order)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },

  'orders.remove'(id) {
    try {
      log.info('removing order: ', id)
      return Orders.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.removePart'(order, part, totalPrice) {
    totalPrice = totalPrice - part.price * part.qty
    const id = order._id
    try {
      log.info('removing part from current order', part)
      return Orders.update({ _id: id }, { $pull: { orderedParts: { partId: part.partId } }, $set: { totalPrice } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.addPart'(id, orderedPart, totalPrice) {
    try {
      log.info('updating order: ', orderedPart)
      return Orders.update({ _id: id }, { $push: { orderedParts: { ...orderedPart } }, $set: { totalPrice } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'order.updateQty'(id, orderedParts, totalPrice) {
    try {
      log.info('updating quantity to or der ')
      return Orders.update(
        { _id: id },
        {
          $set: {
            orderedParts,
            totalPrice
          }
        }
      )
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },

  'orders.email.read': function(mailbox) {
    //Extract emails from Thunderbird into OrderEmails
    let emails = mailbox.split('From ')

    for (let num = 1; num < emails.length; num++) {
      let email = 'From ' + emails[num]

      //Parse the email
      let fs = require('fs')
      let emlformat = require('eml-format')
      let parsedEmail
      emlformat.read(email, function(error, data) {
        if (error) return console.log(error)
        parsedEmail = data
      })

      //Save the email to the collection
      let found = 'Unknown'
      try {
        // console.log(OrderEmails.find({}).fetch().)
        //let dateInDatabase = new Date(parsedEmail['date']).toString()
        parsedEmail.date = parsedEmail.date.toString()
        found = OrderEmails.findOne({ date: parsedEmail.date })

        if (found == null && parsedEmail.subject === 'BPW Order Confirmation') {
          parsedEmail['status'] = 'unknown'
          let _id = OrderEmails.insert(parsedEmail)
          parsedEmail['_id'] = _id
        }
      } catch (e) {
        log.error({ e })
        throw new Meteor.Error(500, e.sanitizedError.reason)
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
          OrderEmails.update(parsedEmail, { $set: { status: 'good' } })

          //add a new order to the database
          order['additionalNotes'] = parsedEmail['_id']
          Orders.insert(order)
          //find parts
          for (let number = 0; number < parts.length; number++) {
            const foundPart = Parts.findOne({ partNo: parts[number]['partNo'] })
            if (foundPart == null) {
              //update status
              parts[number]['status'] = CONSTANTS.PART_STATUS_AUTO_CREATED
              Parts.insert(parts[number])
              log.info('A new part has been created: ', parts[number]['partNo'])
            }
          }
        } else {
          //update broken in orderemail
          OrderEmails.update(parsedEmail, { $set: { status: 'broken' } })
        }
      }
    }
  }
})
