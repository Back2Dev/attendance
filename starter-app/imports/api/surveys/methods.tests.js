import { Random } from 'meteor/random'
import { Meteor } from 'meteor/meteor'
import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'
const debug = require('debug')('se:surveys:tests')

import './methods'

const incompleteForm = {
  data: {
    listingId: '12345',
    type: 'cdc',
    surveyId: 'aefYmbkReGuQSPGHR',
    formData: {},
    formStatus: 'pending',
    who: 'WmH6tRCBvMycetkZg',
    status: 'pending',
  },
  fields: [],
}

const goodDocument = {
  data: {
    listingId: '12345',
    type: 'cdc',
    surveyId: 'aefYmbkReGuQSPGHR',
    formData: {
      client_name: 'John Smith',
      client_address: '33 Rose Lane, VIC Australia 3000',
      property_address: '33 Rose Lane, VIC Australia 3000',
      property_title: '123',
      property_volume: '1234',
      property_folio: '1234',
      conveyancing_description:
        'We will attend to the conveyancing of  33 Rose Lane, VIC Australia 3000, attendances and correspondence with you, real estate agents, financiers and vendor’s legal representative, prepare adjustments, attend to settlement, registration at Land Victoria, notification to relevant authorities of change of ownership and to our skill care and attention.',
      conveyancing_cost: '1000.00',
      disbursements_cost: '200.00',
      gst: '120.00',
      total: '1320.00',
    },
    formStatus: 'complete',
    who: 'WmH6tRCBvMycetkZg',
    status: 'complete',
  },
  fields: [],
}

const survey = {
  slug: 'cdc',
  name: 'Cost disclosure',
  steps: [{ name: 'Test', id: 'test', questions: [{ id: 'test' }] }],
  primary: [
    { id: 'client_name', type: 'string' },
    { id: 'client_address', type: 'string' },
    { id: 'property_address', type: 'string' },
    { id: 'property_title', type: 'string' },
    { id: 'property_volume', type: 'string' },
    { id: 'property_folio', type: 'string' },
    { id: 'conveyancing_description', type: 'string' },
    { id: 'conveyancing_cost', type: 'string' },
    { id: 'disbursements_cost', type: 'string' },
    { id: 'gst', type: 'string' },
    { id: 'total', type: 'string' },
  ],
  secondary: [],
  version: '1',
}

describe('Tests survey methods', () => {
  before(() => {
    resetDatabase()
  })

  it('successfully inserts a cdc survey into db', () => {
    const result = Meteor.call('insert.surveys', survey)
    expect(result.status).to.be.equal('success')
  })
  // it('fails generates and saves pdf to s3 because form is not yet complete', () => {
  //   const result = Meteor.call('generate.save.survey', incompleteForm)
  //   expect(result.status).to.be.equal('failed')
  // })
  // it('successfully generates and saves pdf to s3', () => {
  //   const result = Meteor.call('generate.save.survey', goodDocument)
  //   expect(result.status).to.be.equal('success')
  //   expect(result.message).to.be.equal('Generated and saved pdf to s3')
  //   expect(typeof result.url).to.be.equal('string')
  // })
  // it('successfully generates a signed pdf and saves to s3', () => {
  //   const result = Meteor.call('sign.save.survey', { user: '1234', form: goodDocument })
  // })
})
