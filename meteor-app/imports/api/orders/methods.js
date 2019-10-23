import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import log from '/imports/lib/server/log'
import CONSTANTS from '/imports/api/constants.js'
import OrderEmails from '/imports/api/orderemails/schema'
import { RegExId, createdAt, updatedAt } from '/imports/api/schema'

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
    var emails = mailbox.split('From ')
    var email = 'From ' + emails[1]

    //parse email box
    var fs = require('fs')
    var emlformat = require('eml-format')
    var parsedEmail
    emlformat.read(email, function(error, data) {
      if (error) return console.log(error)
      try {
        fs.writeFileSync('/Users/apple/Desktop/sample.json', JSON.stringify(data, ' ', 2))
      } catch (error) {
        console.log('error', error)
      }
      parsedEmail = data
    })

    //save order emails to the database
    try {
      var dateInDatabase = new Date(parsedEmail['date']).toString()
      var found = OrderEmails.findOne({ date: dateInDatabase, subject: parsedEmail['subject'] })

      if (found == null && parsedEmail.subject === 'BPW Order Confirmation') {
        OrderEmails.insert(parsedEmail)
        console.log('成功')
      }
    } catch (e) {
      log.error({ e })

      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },

  'orders.email.parse': function(singleEmail) {}
})
