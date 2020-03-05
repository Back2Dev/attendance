// methods that affect both collections

import moment from 'moment'
import { Accounts } from 'meteor/accounts-base'

import Members from '/imports/api/members/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Purchases from '/imports/api/purchases/schema'

import Sessions from '/imports/api/sessions/schema'
import log from '/imports/lib/server/log'
import { ProductTypes } from './products/schema'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  addNewMemberUser(email, password, memberId) {
    try {
      console.log(memberId)
      const id = Accounts.createUser({ email, username: email, password })
      Roles.addUsersToRoles(id, ['member'])
      Members.update(memberId, {
        $set: { userId: id }
      })
      return 'success'
    } catch (error) {
      return error.message
    }
  },

  memberRenew(memberId, code) {
    try {
      Carts.remove({ _id: memberId })
      const product = Products.findOne({ active: true, code })
      delete product.createdAt
      delete product.updatedAt
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
    const members = Members.find({ _id: id })
    members.forEach(member => {
      switch (member.subsType) {
        case 'pass':
          code = 'PA-PASS-MULTI-10'
          break
        case 'member':
          code = 'PA-MEMB-12'
          break
        case 'casual':
          code = 'PA-CASUAL'
          break
        default:
          code = 'PA-CASUAL'
      }
      Purchases.update({ memberId: member._id, code: code }, { $set: { status: 'current' } }, { multi: true })
      const existingSessions = Purchases.find({ memberId: member._id, code: code })
        .fetch()
        .filter(purchase => purchase.sessions)
        .map(purchase => purchase.sessions.map(session => session._id))
        .flat()
      const sessions = member.sessions
      sessions
        .filter(session => !existingSessions.includes(session._id))
        .forEach(session => {
          addSession2Purchase({ member, session, doAutoPay: false, sendEmailtrue: false })
        })
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

      if (member.subsType === 'pass') addSession2Purchase({ member, session, doAutoPay: true, sendEmail: true })

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
  switch (member.subsType) {
    case 'pass':
      code = 'PA-PASS-MULTI-10'
      break
    case 'member':
      code = 'PA-MEMB-12'
      break
    case 'casual':
      code = 'PA-CASUAL'
      break
    default:
      code = 'PA-CASUAL'
  }
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
    paymentMethod: 'pending',
    sessions: []
  }
  const purchaseId = Purchases.insert(defaultPurchase)
  const purchase = Purchases.findOne(purchaseId)
  if (!purchase) {
    throw new Meteor.Error('Could not create new purchase record')
  }

  const carts = Carts.find({ memberId: member._id, status: 'ready' }, { sort: { createdAt: 1 } }).fetch()
  if (carts.length) {
    const cart = carts[0]
    const newProdqty = {}
    cart.prodqty[product._id]
      ? (newProdqty[product._id] = cart.prodqty[product._id] + 1)
      : (newProdqty[product._id] = 1)
    const n = Carts.update(cart._id, {
      $set: { prodqty: newProdqty },
      $inc: { totalqty: 1, price: product.price },
      $push: { purchases: purchaseId }
    })
    if (!n) {
      throw new Meteor.Error('Could not update the cart')
    }
  } else {
    const newCart = {
      memberId: member._id,
      price: purchase.price,
      totalqty: 1,
      products: [product],
      purchases: [purchaseId],
      prodqty: {
        [product._id]: 1
      },
      status: 'ready'
    }
    const cartId = Carts.insert(newCart)
    if (!cartId) {
      throw new Meteor.Error('Could not insert a new cart')
    }
  }
  return purchase
}

const sendPleasePayEmail = (member, purchase) => {
  const carts = Carts.find({ purchases: purchase._id }).fetch()
  const cart = carts.length ? carts[0] : null
  Meteor.call(
    'sendGenericActionEmail',
    member.email,
    {
      subject: 'Please pay for your pass',
      name: member.name,
      message: 'You did a session today, you need to pay for it ',
      headline: 'Payment required',
      link: Meteor.absoluteUrl(`/shop/renew/${member._id}/${cart._id}`),
      action: 'Pay Now'
    },
    Meteor.settings.private.genericActionID
  )
}

const addSession2Purchase = ({ member, session, doAutoPay, sendEmail }) => {
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
  const purchases = Purchases.find({ memberId: member._id, status: 'current' }, { sort: { createdAt: 1 } }).fetch()
  const purchase = purchases.length ? purchases[0] : null
  if (purchase) {
    const product = Products.findOne({ code: purchase.code, active: true })
    if (!product) {
      throw new Meteor.Error(`Could not find product ${purchase.code}`)
    }
    let remaining = product.qty - 1
    if (purchase.sessions) {
      remaining = remaining - purchase.sessions.length
    }
    Purchases.update(purchase._id, {
      $push: { sessions: session },
      $set: { remaining }
    })
    if (remaining <= 0) {
      if (doAutoPay && member.autoPay) {
        //why not check if there are still current purchases
        const newPurchase = createNewPass(member)
        autoPay(member, newPurchase)
      } else {
        const purchases = Purchases.find(
          { memberId: member._id, status: 'current' },
          { sort: { createdAt: 1 } }
        ).fetch()
        if (purchases.length === 1) {
          const newPurchase = createNewPass(member)
          if (sendEmail) sendPleasePayEmail(member, newPurchase)
        }
      }
      Purchases.update(purchase._id, {
        $set: { status: 'complete' }
      })
    } else {
      if (purchase.paymentStatus !== 'paid') {
        if (sendEmail) sendPleasePayEmail(member, purchase)
      }
    }
  } else {
    // 3. Purchase does not exist
    // * create purchase
    // * add session
    // * send please pay email
    const newPurchase = createNewPass(member)
    if (newPurchase.remaining === 1 && newPurchase.code === 'PA-CASUAL') {
      Purchases.update(newPurchase._id, {
        $push: { sessions: session },
        $set: { remaining: newPurchase.remaining - 1, status: 'complete' }
      })
    } else {
      Purchases.update(newPurchase._id, {
        $push: { sessions: session },
        $set: { remaining: newPurchase.remaining - 1 }
      })
    }
    if (sendEmail) sendPleasePayEmail(member, newPurchase)
  }
}
