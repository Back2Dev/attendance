import { expect } from 'chai'
import { generateAndUpload } from './s3-utils'
import { resetDatabase } from '/imports/test/util-test'

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
  fields: [
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
}

const badDocument = {
  data: {
    type: 'fake',
  },
  fields: {},
}

describe('Test s3 utils', () => {
  before(() => {
    resetDatabase()
  })
  // it('generates a pdf and uploads it', async () => {
  //   const result = await generateAndUpload(goodDocument)
  //   expect(result.status).to.be.equal('success')
  //   expect(typeof result.message).to.be.equal('string')
  // })
  // it('returns an error because it cannot locate the template', async () => {
  //   const result = await generateAndUpload(badDocument)
  //   expect(result.status).to.be.equal('failed')
  //   expect(typeof result.message).to.be.equal('string')
  // })
})
