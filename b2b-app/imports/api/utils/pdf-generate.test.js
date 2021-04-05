import generatePDF from './pdf-generate'
import { expect } from 'chai'

const data = {
  bq: {
    buyerType: 'company',
    'individual-email': 'mickey@disney.com',
    'individual-mobile': '0400 000 000',
    'individual-name': 'Mickey Mouse',
    'individual-postal': 'Anaheim Blvd',
    'individual-residential': 'Anaheim Blvd',
    'property-address': '123 Rainbow Road',
  },
}

const fields = {
  bq: {
    primary: [
      {
        page: 0,
        x: 99,
        y: 0,
        type: 'string',
        id: 'buyerType',
        show: true,
      },
      {
        page: 0,
        x: 100,
        y: 720,
        type: 'checkbox',
        id: 'buyerType',
        value: 'company',
        show: true,
      },
      {
        page: 0,
        x: 0,
        y: 720,
        type: 'checkbox',
        id: 'buyerType',
        value: 'individual',
        show: true,
      },
      {
        type: 'checkbox',
        id: 'buyerType',
        value: 'tax-haven',
        page: 0,
        y: 720,
        x: 200,
        show: true,
      },
      {
        type: 'string',
        id: 'individual-name',
        page: 0,
        y: 750,
        x: 0,
        show: true,
      },
      {
        type: 'string',
        id: 'individual-email',
        page: 0,
        y: 690,
        x: 0,
        show: true,
      },
      {
        type: 'string',
        id: 'individual-mobile',
        page: 0,
        y: 680,
        x: 0,
        show: true,
      },
      {
        type: 'string',
        id: 'individual-residential',
        page: 0,
        y: 670,
        x: 0,
        show: true,
      },
      {
        type: 'string',
        id: 'individual-postal',
        page: 0,
        y: 660,
        x: 0,
        show: true,
      },
    ],
    secondary: [],
  },
}

describe('generates a pdf with test data', () => {
  it('Runs the function', () => {
    const result = generatePDF({ data: data.bq, fields: fields.bq })
    expect(typeof result).to.be.equal('object')
  })
})
