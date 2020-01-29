// methods that affect both collections

import moment from 'moment'

import Members from '/imports/api/members/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Purchases from '/imports/api/purchases/schema'
import Sessions from '/imports/api/sessions/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  memberRenew(memberId, code) {
    try {
      Carts.remove({ _id: memberId })
      const product = Products.findOne({ active: true, code })
      delete product.createdAt
      delete product.updatedAt
      product.qty = 1
      const cart = {
        _id: memberId,
        memberId,
        userId: Meteor.userId,
        price: product.price,
        totalqty: 1,
        prodqty: { [product._id]: 1 },
        products: [product]
      }
      const id = Carts.insert(cart)
    } catch (e) {
      debug(`Error [${e.message}] in memberRenew, product code ${product.code}`)
    }
  },

  migrateSessions(id) {
    //find Members with subscription type pass or null
    const members = Members.find({
      $and: [{ $or: [{ subsType: 'pass' }, { subsType: null }] }, { _id: id }]
    })
    members.forEach(member => {
      const purchases = Purchases.find({ memberId: member._id })
      const sessions = member.sessions
      //if they have a purchase
      if (purchases) {
        purchases.forEach(purchase => {
          //if purchase.sessions doesn't exist create empty array and set remaining to 10
          if (!purchase.sessions) {
            Purchases.update(purchase._id, { $set: { sessions: [] } })
            Purchases.update(purchase._id, { $set: { remaining: 10 } })
          }
          //fill the purchases with sessions
          sessions.forEach(session => {
            Purchases.update(purchase._id, { $addToSet: { sessions: session } })
            Purchases.update(purchase._id, { $inc: { remaining: -1 } })
          })
          //if there are leftovers then email them the leftover purchases
          debug(`sessions = ${purchase.sessions.length}, remaining = ${purchase.remaining}`)
        })
      }
      // else make a purchase and push the sessions
      else {
        const newPurchase = createNewPass(member)
        sessions.forEach(session => {
          Purchases.update(purchase._id, { $push: { sessions: session } })
        })
        sendPleasePayEmail(member, newPurchase)
      }
    })
  },

  arrive(memberId, event) {
    const { duration, name, price } = event
    const timeIn = new Date()
    const timeOut = moment(timeIn)
      .add(duration, 'h')
      .toDate()
    const member = Members.findOne(memberId)
    try {
      const id = Sessions.insert({
        memberId,
        eventId: event._id,
        // purchaseId,
        timeIn,
        timeOut,
        duration,
        memberName: member.name,
        name,
        price
      })
      const session = Sessions.findOne(id)
      const sessionCount = Sessions.find({ memberId }).count()

      Members.update(memberId, {
        $set: {
          isHere: true,
          lastIn: timeIn,
          sessionCount
        },
        $push: { sessions: session }
      })

      /* 
        1. Purchase is current with more than 1 remaining
            * add session
            * if(!paid) send please pay email
        2. Purchase sessions are 9/10
            * add session
            * new purchase
            * if (auto pay) make payment
            * else send please pay email
            * paymentStatus="notified"
        3. Purchase does not exist
            * create purchase
            * add session
            * send please pay email
      */
      const purchase = Purchases.findOne({ memberId, status: 'current' })
      if (purchase) {
        Purchases.update(purchase._id, {
          $push: { sessions: session }
        })
        const remaining = purchase.qty - purchase.sessions.length - 1
        if (remaining <= 0) {
          Purchases.update(purchase._id, {
            $set: { status: 'complete' }
          })
          if (member.autoPay) {
            const newPurchase = createNewPass(member)
            autoPay(member, newPurchase)
          } else {
            const newPurchase = createNewPass(member)
            sendPleasePayEmail(member, newPurchase)
          }
        } else {
          if (purchase.paymentStatus !== 'paid') {
            sendPleasePayEmail(member, purchase)
          }
        }
      } else {
        // 3. Purchase does not exist
        // * create purchase
        // * add session
        // * send please pay email
        const newPurchase = createNewPass(member)
        Purchases.update(newPurchase._id, {
          $push: { sessions: session }
        })
        sendPleasePayEmail(member, newPurchase)
      }
      debug('member arrive update', id, session, sessionCount, memberId, duration, timeOut)
    } catch (error) {
      log.error(error.message)
    }
  },

  // signing out _isn't_ mandatory.
  // at end of each day every member will be automatically signed out.
  // if member does sign out early though, lets update timeOut and duration
  depart(id) {
    //
    // member may have signed in multiple times that day,
    // so lets find the LAST session of theirs from 12am TODAY
    //
    const session = Sessions.find({
      memberId: id,
      timeIn: {
        $gte: moment()
          .startOf('day')
          .toDate()
      }
    })
      .fetch()
      .pop()

    debug(`Member ${id} is departing, session:`, session)

    if (session) {
      // lets recalculate the duration of session
      try {
        let timeIn = moment(session.timeIn)
        let timeOut = moment()

        // update the anticipated duration with actual visit duration
        let duration = moment.duration(timeOut.diff(timeIn)).get('hours')
        if (duration === 0) {
          duration = 1
        }
        const m = Sessions.update(
          {
            _id: session._id
          },
          {
            $set: {
              // convert timeOut from moment instance to native date object
              timeOut: timeOut.toDate(),
              duration
            }
          }
        )
        const n = Members.update(
          {
            _id: id
            // sessions: {
            //   $elemMatch: {
            //     "_id": session._id,
            //   }
            // }
          },
          {
            $set: {
              isHere: false,
              lastIn: new Date()
              // Removing the update of the embedded sessions, because this doesn't work
              // and trying to make it work may involve aggregation - too hard!
              // 'sessions.$.duration': duration
            }
          }
        )
        debug('m=' + m + ', n=' + n)
      } catch (error) {
        throw new Meteor.Error(error)
      }
    } else {
      Members.update(
        {
          _id: id
        },
        {
          $set: {
            isHere: false
          }
        }
      )
    }
  },
  // Code to help debug a time problem
  checkTimes() {
    let n = 0
    crew = Members.find({ isHere: true })
    crew.forEach(dude => {
      const stillHereQuery = {
        memberId: dude._id
      }
      console.log('stillHereQuery', stillHereQuery)
      const sessions = Sessions.find(stillHereQuery, {
        sort: { createdAt: -1 },
        limit: 1
      }).forEach(session => {
        console.log('session.timeOut', session.timeOut)
        console.log('now', moment().toDate(), moment().isAfter(session.timeOut))
        console.log(
          'now.utc2',
          moment(),
          moment()
            .utc()
            .isAfter(moment(session.timeOut).utc())
        )
        console.log(
          'now.utc',
          moment()
            .utc()
            .toDate()
        )
        if (
          moment()
            .utc()
            .isAfter(session.timeOut)
        ) {
          debug(`Automatically signed out ${dude.name}`)
          // n += Members.update(dude._id, { $set: { isHere: false } })
        } else {
          console.log(`${dude.name} is still there`)
        }
      })
    })
    if (n) {
      debug(`Would have signed out ${n} members`)
    }
  },

  // signing out _isn't_ mandatory. This is the one that happens automatically
  autoDepart(id) {
    // member may have signed in multiple times that day,
    // so lets find the LAST session of theirs from 12am TODAY
    const session = Sessions.find({
      memberId: id,
      timeIn: {
        $gte: moment()
          .startOf('day')
          .toDate()
      }
    })
      .fetch()
      .pop()

    // lets recalculate the duration of session
    let timeIn = moment(session.timeIn)
    let timeOut = moment()

    // update the anticipated duration with actual visit duration
    const duration = moment.duration(timeOut.diff(timeIn)).get('hours')

    Sessions.update(
      {
        _id: session._id
      },
      {
        $set: {
          // convert timeOut from moment instance to native date object
          timeOut: timeOut.toDate(),
          duration
        }
      }
    )

    Members.update(
      {
        _id: id,
        sessions: {
          $elemMatch: {
            _id: session._id
          }
        }
      },
      {
        $set: {
          isHere: false,
          lastIn: new Date(),
          'sessions.$.duration': duration
        }
      }
    )
  }
})

const createNewPass = member => {
  const code = 'PA-PASS-MULTI-10'
  const product = Products.findOne({ code, active: true })
  if (!product) {
    throw new Meteor.Error(`Could not find product ${code}`)
  }
  const defaultPurchase = {
    productName: product.name,
    productId: product._id,
    price: product.price,
    remaining: product.qty,
    expiry: moment()
      .add(product.duration, 'month')
      .toISOString(),
    memberId: member._id,
    purchaser: member.name,
    code,
    qty: 1,
    status: 'current',
    paymentMethod: 'pending'
  }
  const pid = Purchases.insert(defaultPurchase)
  const purchase = Purchases.findOne(pid)
  if (!purchase) {
    throw new Meteor.Error('Could not create new purchase record')
  }
  return purchase
}

const sendPleasePayEmail = (member, purchase) => {
  Meteor.call(
    'sendGenericActionEmail',
    member.email,
    {
      subject: 'Please pay for your pass',
      name: member.name,
      message: 'You did a session today, you need to pay for it ',
      headline: 'Payment required',
      link: Meteor.absoluteUrl('/shop'),
      action: 'Pay Now'
    },
    Meteor.settings.private.genericActionID
  )
}
