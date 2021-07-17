import { expect } from 'chai'
import moment from 'moment'
import cloneDeep from 'lodash'
import {
  accessByPath,
  pruneByPath,
  populateDoc,
  cleanPhone,
  makeUserSerial,
  makeListingSerial,
  obj2Search,
} from './util'
const debug = require('debug')('app:util')

const obj = { foo: { bar: 'The answer is 42', buzz: 'Buzz Aldrin' } }
const paths = {
  'foo.bar': obj.foo.bar,
  'foo.buzz': obj.foo.buzz,
  55: '',
  'something else': '',
}
const incoming = {
  property: {
    address: 'A Street near me, suburb city, STATE of postcode, Country',
    features: ['SE_Vendor', 'SE_Buyer', 'Garage', 'Central heating'],
  },
}

describe('Utilities: accessByPath', () => {
  Object.keys(paths).forEach((key, i) => {
    it(` ${i + 1}`, () => {
      expect(paths[key]).to.equal(accessByPath(obj, key))
    })
  })
})

describe('Utilities: pruneByPath', () => {
  it('Removes features from incoming', () => {
    const pruned = pruneByPath(incoming, 'property.features')
    expect(Array.isArray(pruned)).to.equal(true)
    expect(incoming.property.features).to.equal(undefined)
  })
})

describe('Utilities: populate', () => {
  const popSpec = {
    // target: source
    'property/property-address': 'listing.address',
    'property/property-serialNo': 'listing.serialNo',
    'auth/authority': 'specific', // Literal value (has no '.')
    'convey/property-address': 'listing.address',
    'convey/transaction-transfer': true,
    // Array will be interpreted and concatenated into a single string
    'convey/land-titleref': [
      'listing.docs.type=cdc.0.formData.property.certificate-volume',
      '/',
      'listing.docs.type=cdc.0.formData.property.certificate-folio',
    ],
    'client/client-name': 'listing.persons.role=CUS.0.name',
    'client/client2-name': 'listing.persons.role=CUS.1.name',
    'client/client-address': {
      or: [
        'listing.docs.type=bnf.0.formData.clients.role=CUS.0.residential',
        'listing.docs.type=snf.0.formData.clients.role=CO.0.residential',
      ],
    },
    'client/client2-address': {
      or: [
        'listing.docs.type=xxx.0.formData.clients.role=CUS.0.residential',
        'listing.docs.type=snf.0.formData.clients.role=CO.0.residential',
      ],
    },
    'client/client3-address': {
      or: [
        'listing.docs.type=xxx.0.formData.clients.role=CUS.0.residential',
        'listing.docs.type=abc.0.formData.clients.role=CO.0.residential',
        'listing.docs.type=def.0.formData.clients.role=CO.0.residential',
        'listing.docs.type=ghi.0.formData.clients.role=CO.0.residential',
        'listing.docs.type=snf.0.formData.clients.role=CO.0.residential',
      ],
    },
    'conveyancer.name': 'practice.name',
    'conveyancer.ABN': 'practice.abn',
    'costs/invoice-cost': { removeGST: 'listing.cost' },
    'costs/invoice-gst': { GSTFrom: 'listing.cost' },
    'individuals/0/individuals-name': 'listing.persons.role=CUS.0.name',
    'individuals/0/individuals-email': 'listing.persons.role=CUS.0.email',
    'individuals/0/individuals-mobile': 'listing.persons.role=CUS.0.mobile',
  }
  const listing = {
    address: 'We are on the road to nowhere',
    serialNo: 'B1234-x09',
    persons: [
      { name: 'Cathy Customer', role: 'CUS' },
      { name: 'Charlie Customer', role: 'CUS' },
    ],
    cost: 660,
    docs: [
      {
        type: 'cdc',
        formData: {
          client: {},
          property: { 'certificate-volume': '91191', 'certificate-folio': '911' },
        },
      },
      {
        type: 'bnf',
        formData: {
          clients: [{ name: 'Charlie', residential: 'My home address', role: 'CUS' }],
        },
      },
      {
        type: 'snf',
        formData: {
          clients: [{ name: 'Company man', residential: 'My work address', role: 'CO' }],
        },
      },
    ],
  }
  const practice = {
    name: 'Settle Easy VIC',
    legalName: 'Convx Pty. Ltd.',
    license: '001632L',
    address: 'Level 6, 530 Collins St, Melbourne, VIC 3000',
    phone: '1 800 88 66 88',
    abn: '20 625 000 651',
    acn: '625 000 651',
    email: 'info@settleeasy.com.au',
    state: 'vic',
    active: true,
  }

  it('Populates a new webform with data from the listing or other webforms', () => {
    listing.docs.push(populateDoc({ listing, practice }, popSpec, 'caf'))

    const cus = listing.persons.find((doc) => doc.role === 'CUS')
    expect(cus).to.be.an('object')
    const caf = listing.docs.find((doc) => doc.type === 'caf')
    debug(caf)
    expect(caf).to.be.an('object')
    expect(caf.formData.client['client-name']).to.be.equal(cus.name)
    expect(caf.formData.client['client-address']).to.be.equal('My home address')
    expect(caf.formData.client['client2-name']).to.be.equal('Charlie Customer')
    expect(caf.formData.client['client2-address']).to.be.equal('My work address')
    expect(caf.formData.convey['transaction-transfer']).to.be.equal(true)
    expect(caf.formData.auth.authority).to.be.equal('specific')
    expect(caf.formData.convey['land-titleref']).to.be.equal('91191/911')
    expect(caf.formData.costs['invoice-cost']).to.be.equal('600')
    expect(caf.formData.costs['invoice-gst']).to.be.equal('60')
    expect(Array.isArray(caf.formData.individuals)).to.be.equal(true)
    expect(caf.formData.individuals[0]['individuals-name']).to.be.equal(cus.name)
  })
})

describe('Utilities: cleanPhone', () => {
  const phones = [
    { phone: '+61438002921', expected: '+61438002921' },
    { phone: '0438002921', expected: '+61438002921' },
    { phone: '0438 002 921', expected: '+61438002921' },
    { phone: '0338002921', expected: '+61338002921' },
    { phone: '+441423872468', expected: '+441423872468' },
    { phone: '+1 (213)-627-9009', expected: '+12136279009' },
    { phone: null, expected: '' },
    { phone: [1, 2, 3], expected: '' },
    { phone: { a: 1, b: 2, c: 3 }, expected: '' },
  ]
  phones.forEach((item, i) => {
    it(` ${i + 1} ${item.phone} => [${item.expected}]`, () => {
      expect(cleanPhone(item.phone)).to.equal(item.expected)
    })
  })
})

describe('Utilities: makeUserSerial', () => {
  const rows = [
    { id: 901, first: 'Donald', last: 'Duck', expected: 'SEDD1901' },
    { id: 23, first: 'minnie', last: 'mouse', expected: 'SEMM1023' },
    { id: 23, first: '', last: 'Mousekevitz', expected: 'SEXM1023' },
    { id: 1023, first: 'MIGHTY', last: 'MOUSE', expected: 'SEMM2023' },
  ]
  rows.forEach((item, i) => {
    it(` ${i + 1} ${[item.id, item.first, item.last].join('/')} => [${
      item.expected
    }]`, () => {
      expect(makeUserSerial(item.id, item.first, item.last)).to.equal(item.expected)
    })
  })
})

describe('Utilities: makeListingSerial', () => {
  const yymm = moment().format('YYYYMM')
  const rows = [
    { id: 901, expected: `${yymm}1901` },
    { id: 23, expected: `${yymm}1023` },
    { id: 1023, expected: `${yymm}2023` },
    { id: '1023', expected: `${yymm}10001023` },
    { id: 'abcDEF123', expected: `${yymm}1000abcDEF123` },
  ]
  rows.forEach((item, i) => {
    it(` ${i + 1} ${[item.id, item.first, item.last].join('/')} => [${
      item.expected
    }]`, () => {
      expect(makeListingSerial(item.id, item.first, item.last)).to.equal(item.expected)
    })
  })
})

describe('Utilities: obj2Search', () => {
  const rows = [
    {
      id: 901,
      n: 900,
      custId: 'customer_id',
      first: 'Donald',
      last: 'Duck',
      expected: 'SEDD1901',
    },
    { id: 23, first: 'minnie', last: 'mouse', expected: 'SEMM1023' },
    { id: 23, first: '', last: 'Mousekevitz', expected: 'SEXM1023' },
    { id: 1023, first: 'MIGHTY', last: 'MOUSE', expected: 'SEMM2023' },
  ]
  it('finds things as expected', () => {
    const str = obj2Search(rows[0])
    expect(!!str.match(/SEDD1901/)).to.equal(true)
    expect(!!str.match(/Duck/)).to.equal(true)
  })
  it('Does not find what it should not', () => {
    const str = obj2Search(rows[0])
    expect(!!str.match(/SEXM1023/)).to.equal(false)
    expect(!!str.match(/mouse/i)).to.equal(false)
    expect(!!str.match(/900/i)).to.equal(false)
    expect(!!str.match(/customer_id/i)).to.equal(false) // Anything ending in id is filtered out
  })
  const things = [
    { x: 'a string', letters: ['a', 'b', 'c'], obj: { name: 'Mike', hobby: 'paddling' } },
    new Date(),
    /regex/,
    ['a', 'b', 'c'],
  ]
  it('Works with recursion', () => {
    const str = obj2Search(things, true)
    expect(!!str.match(/a string/)).to.equal(true)
    expect(!!str.match(/Mike/)).to.equal(true)
  })
  it('Flatter without recursion', () => {
    const str = obj2Search(things[0], false)
    expect(!!str.match(/a string/)).to.equal(true)
    expect(!!str.match(/Mike/)).to.equal(false)
  })
  it('Copes with bad data', () => {
    const str = obj2Search(null, false)
    expect(!!str.match('')).to.equal(true)
    expect(!!str.match(/Mike/)).to.equal(false)
  })
  // Set up self-referencing data to test max recursion
  const t = {
    x: 'a string',
    letters: ['a', 'b', 'c'],
    obj: { name: 'Mike', hobby: 'paddling' },
  }
  t.obj.trick = t
  it('Handles looped data', () => {
    expect(() => obj2Search(t, true)).to.throw()
  })
})
