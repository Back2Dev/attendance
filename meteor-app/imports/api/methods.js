// methods that affect both collections

import moment from 'moment'
import Members from '/imports/api/members/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Purchases from '/imports/api/purchases/schema'
import Sessions from '/imports/api/sessions/schema'
import log from '/imports/lib/server/log'
import { ProductTypes } from './products/schema'

const debug = require('debug')('b2b:server-methods')

Meteor.methods({
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
      Purchases.update(
        { memberId: member._id, status: { $exists: false } },
        { $set: { status: 'current', sessions: [] } },
        { multi: true }
      )
      let existingSessions = Purchases.find({ memberId: member._id })
        .fetch()
        .filter(purchase => purchase.sessions)
        .map(purchase => purchase.sessions.map(session => session._id))
        .flat()
      let sessions = Sessions.find({ memberId: member._id }).fetch()
      sessions
        .filter(session => !existingSessions.includes(session._id))
        .forEach(session => {
          addSession2Purchase({ member, session, doAutoPay: false, sendEmailtrue: false })
        })
      handleUnpaidSessions(id)
      setPurchaseStatus(member)
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
      Meteor.call('migrateSessions', memberId)
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

    // debug(`Member ${id} is departing, session:`, session)

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
        // debug('m=' + m + ', n=' + n)
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

const createNewPass = (member, code, startDate = 'current') => {
  const product = Products.findOne({ code: code })
  if (!product) {
    throw new Meteor.Error(`Could not find product ${code}`)
  }
  const defaultPurchase = {
    productName: product.name,
    productId: product._id,
    price: product.price,
    remaining: product.qty ? product.qty : -1,
    expiry:
      startDate === 'current'
        ? moment()
            .add(product.duration, 'month')
            .toISOString()
        : moment(startDate)
            .startOf('day')
            .add(product.duration, 'month')
            .toISOString(),
    memberId: member._id,
    purchaser: member.name,
    code: product.code,
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
    let newProdqty = cart.prodqty ? cart.prodqty : {}
    let newProducts = cart.products.length ? cart.products : []
    newProdqty[product._id] = cart.prodqty[product._id] ? cart.prodqty[product._id] + 1 : 1
    let found = false
    newProducts.forEach(newProduct => {
      newProduct._id === product._id && (found = true)
    })
    found || newProducts.push(product)
    const n = Carts.update(cart._id, {
      $set: { prodqty: newProdqty, products: newProducts },
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
  const purchases = Purchases.find({ memberId: member._id, status: 'current' }, { sort: { createdAt: 1 } }).fetch()
  if (purchases.length) {
    let findPurchases = []
    purchases.forEach(purchase => {
      const product = Products.findOne({ code: purchase.code })
      if (
        product &&
        moment(session.timeIn).isBetween(moment(purchase.createdAt), moment(purchase.expiry), null, '[]')
      ) {
        findPurchases.push(purchase)
      }
    })

    switch (findPurchases.length) {
      case 0: {
        //couldn't find any purchases
        break
      }
      case 1: {
        const purchase = findPurchases[0]
        const product = Products.findOne({ code: purchase.code })
        switch (product.subsType) {
          case 'member':
            debug(`member ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
            Purchases.update(purchase._id, {
              $push: { sessions: session }
            })
            break
          case 'pass': {
            let remaining = product.qty
            purchase.sessions && (remaining = remaining - purchase.sessions.length)
            if (remaining > 0) {
              debug(`pass ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
              Purchases.update(purchase._id, {
                $push: { sessions: session },
                $set: { remaining: remaining - 1 }
              })
            }
            break
          }
          case 'casual':
            if (product.duration) {
              //1 casual session
              let remaining = product.qty
              purchase.sessions && (remaining = remaining - purchase.sessions.length)
              if (remaining > 0) {
                debug(`casual ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
                Purchases.update(purchase._id, {
                  $push: { sessions: session },
                  $set: { remaining: remaining - 1 }
                })
              }
            } else {
              // casual signup
              Purchases.update(purchase._id, {
                $push: { sessions: session }
              })
            }
            break
        }
        break
      }

      default: {
        //there are overlapping purchases.

        findPurchases.sort((a, b) => {
          const productA = Products.findOne({ code: a.code })
          const productB = Products.findOne({ code: b.code })

          if (productA.subsType === productB.subsType) {
            if (moment(a.expiry) < moment(b.expiry)) {
              return -1
            } else {
              return 1
            }
          } else if (productA.subsType === 'member') {
            return -1
          } else if (productB.subsType === 'member') {
            return 1
          } else if (productA.subsType === 'pass') {
            return -1
          } else if (productB.subsType === 'pass') {
            return 1
          } else if (productA.duration && productA.subsType === 'casual') {
            return -1
          } else if (productB.duration && productB.subsType === 'casual') {
            return 1
          } else {
            return 0
          }
        })

        findValidPurchase: for (let i = 0; i < findPurchases.length; i++) {
          const product = Products.findOne({ code: findPurchases[i].code })
          if (!product) {
            throw new Meteor.Error(`Could not find product ${findPurchases[i].code}`)
          }
          switch (product.subsType) {
            case 'member':
              debug(`member ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
              Purchases.update(findPurchases[i]._id, {
                $push: { sessions: session }
              })
              break findValidPurchase
            case 'pass': {
              let remaining = product.qty
              findPurchases[i].sessions && (remaining = remaining - findPurchases[i].sessions.length)
              if (remaining > 0) {
                debug(`pass ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
                Purchases.update(findPurchases[i]._id, {
                  $push: { sessions: session },
                  $set: { remaining: remaining - 1 }
                })
              }
              break findValidPurchase
            }
            case 'casual': {
              if (product.duration) {
                let remaining = product.qty
                findPurchases[i].sessions && (remaining = remaining - findPurchases[i].sessions.length)
                if (remaining > 0) {
                  debug(`casual ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
                  Purchases.update(findPurchases[i]._id, {
                    $push: { sessions: session },
                    $set: { remaining: remaining - 1 }
                  })
                }
              } else {
                debug(`casual signup ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
                Purchases.update(findPurchases[i]._id, {
                  $push: { sessions: session }
                })
              }
              break findValidPurchase
            }
          }
        }
        break
      }
    }
  }
}

const handleUnpaidSessions = id => {
  let members = Members.find(id).fetch()
  if (members.length !== 1) {
    throw new Meteor.Error(`The number of members found is ${members.length}`)
  }
  const member = members[0]
  existingSessions = Purchases.find({ memberId: id })
    .fetch()
    .filter(purchase => purchase.sessions)
    .map(purchase => purchase.sessions.map(session => session._id))
    .flat()
  sessions = Sessions.find({ memberId: member._id }).fetch()
  let unpaidSessions = sessions.filter(session => !existingSessions.includes(session._id))
  unpaidSessions.sort((a, b) => {
    return moment(a.timeIn) > moment(b.timeIn) ? -1 : 1
  })
  if (unpaidSessions && unpaidSessions.length) {
    const purchasesAsc = Purchases.find({ memberId: id, remaining: { $gt: 0 } }, { sort: { createdAt: 1 } }).fetch()

    const purchasesDes = Purchases.find({ memberId: id }, { sort: { createdAt: -1 } }).fetch()
    const lastPurchase = purchasesDes.length ? purchasesDes[0] : null
    const lastProduct = lastPurchase
      ? Products.findOne({ code: lastPurchase.code })
      : Products.findOne({ code: 'PA-CASUAL' })
    switch (lastProduct.subsType) {
      case 'casual': {
        unpaidSessions.forEach(unpaidSession => {
          debug(
            `create new casual purchase ${member._id} pushing session ${moment(unpaidSession.timeIn).format(
              'DD/MM/YY'
            )}`
          )
          const newPurchase = createNewPass(member, lastProduct.code)
          Purchases.update(newPurchase._id, {
            $push: { sessions: unpaidSession },
            $inc: { remaining: -1 }
          })
        })
        break
      }
      case 'pass': {
        let newPurchase = createNewPass(member, lastProduct.code)
        while (unpaidSessions.length) {
          let session = unpaidSessions.pop()
          let purchase = Purchases.findOne(newPurchase._id)
          if (purchase && purchase.remaining > 0) {
            debug(`create new pass purchase ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
            Purchases.update(newPurchase._id, {
              $push: { sessions: session },
              $inc: { remaining: -1 }
            })
          } else {
            newPurchase = createNewPass(member, lastProduct.code)
          }
        }
        break
      }
      case 'member': {
        let newPurchase
        while (unpaidSessions.length) {
          const session = unpaidSessions.pop()
          if (newPurchase) {
            const product = Products.findOne({ code: newPurchase.code })
            if (
              moment(session.timeIn).isBetween(
                moment(newPurchase.expiry).subtract(product.duration, 'month'),
                moment(newPurchase.expiry),
                null,
                '[]'
              )
            ) {
              debug(`push member session ${member._id} pushing session ${moment(session.timeIn).format('DD/MM/YY')}`)
              Purchases.update(newPurchase._id, {
                $push: { sessions: session }
              })
            } else {
              newPurchase = createNewPass(member, lastProduct.code, session.timeIn)
              Purchases.update(newPurchase._id, {
                $push: { sessions: session }
              })
            }
          } else {
            newPurchase = createNewPass(member, lastProduct.code, session.timeIn)
            Purchases.update(newPurchase._id, {
              $push: { sessions: session }
            })
          }
        }
        break
      }
    }
  }
}

const setPurchaseStatus = member => {
  const currentPurchases = Purchases.find({ memberId: member._id, status: 'current' }).fetch()
  if (currentPurchases.length) {
    currentPurchases.forEach(currentPurchase => {
      const product = Products.findOne({ code: currentPurchase.code })
      if (product) {
        switch (product.subsType) {
          case 'casual': {
            if (
              product.duration &&
              (currentPurchase.remaining <= 0 || (currentPurchase.expiry && moment(currentPurchase.expiry) < moment()))
            )
              Purchases.update(currentPurchase._id, { $set: { status: 'complete' } })
            break
          }
          case 'pass': {
            if (currentPurchase.remaining <= 0 || (currentPurchase.expiry && moment(currentPurchase.expiry) < moment()))
              Purchases.update(currentPurchase._id, { $set: { status: 'complete' } })
            break
          }
          case 'member': {
            if (currentPurchase.expiry && moment(currentPurchase.expiry) < moment())
              Purchases.update(currentPurchase._id, { $set: { status: 'complete' } })
            break
          }
        }
      }
    })
  }
}

const a = ({ member, session, doAutoPay, sendEmail }) => {
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
