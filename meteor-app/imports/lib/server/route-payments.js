import { Meteor } from 'meteor/meteor'
import express from 'express'
import bodyParser from 'body-parser'
import Purchases from '/imports/api/purchases/schema'

const debug = require('debug')('b2b:server-payments')

async function acceptPayment(req, res) {
  // We need to bind to the Meteor environment for this to work.
  Meteor.bindEnvironment(() => {
    try {
      debug('Saving')
      const txn = Purchases.update('1234', {
        status: 'Paid'
      })
    } catch (e) {
      console.error(e)
    }
  })()

  res.status(200).json({ status: 'ok' })
}

export function setupPaymentsApi() {
  debug('Setting up payments API')
  const app = express()
  app.use(bodyParser.urlencoded({ extended: false }))

  app.post('/payment', acceptPayment)
  app.get('/api', (req, res) => {
    res.status(200).json({ message: 'B2B Payments API' }) // Shouldn't call this, just for testing for now
  })

  WebApp.connectHandlers.use(app)
}
