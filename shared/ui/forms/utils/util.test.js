import { expect } from 'chai'
import { doPostcalc } from '/imports/api/util'
import {
  accessByPath,
  pruneByPath,
  populateDoc,
  cleanPhone,
  obj2Search,
  slugify,
} from './util'
import CONSTANTS from '/imports/api/constants'
import dbg from 'debug'
const debug = dbg('app:util')

const NumberInt = (n) => n
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
    features: ['SE_Vendor', 'SE_Buyer', ' Garage', 'Central heating '],
  },
  people: [
    { name: 'Mike King   ', email: 'mikkel@me.com ' },
    null,
    { name: 'John King   ', email: 'john@me.com ' },
  ],
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

describe('Utilities: cleanPhone', () => {
  const cc = CONSTANTS.DEFAULT_COUNTRY_CODE
  const phones = [
    { phone: '+61438002921', expected: `+61438002921` },
    { phone: '0438002921', expected: `+${cc}438002921` },
    { phone: '0438 002 921', expected: `+${cc}438002921` },
    { phone: '0338002921', expected: `+${cc}338002921` },
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
    {
      x: 'a string',
      letters: ['a', 'b', 'c'],
      obj: { name: 'Mike', hobby: 'paddling' },
    },
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

describe('Utilities: slugify', () => {
  const rows = [
    { id: 901, name: 'Donald Duck', last: 'Duck', expected: 'donald-duck' },
    {
      id: 23,
      name: ' AGENT   ORANGE ',
      last: 'mouse',
      expected: 'agent-orange',
    },
    { id: 23, name: 'Mousekevitz9, Filly', expected: 'mousekevitz9-filly' },
    { id: 1023, name: '', expected: 'no-name' },
    { id: 1023, name: 99, expected: 'no-name' },
    { id: 1023, name: [], expected: 'no-name' },
    { id: 1023, name: {}, expected: 'no-name' },
  ]
  rows.forEach((item, i) => {
    it(` ${i + 1} [${item.name}] => [${item.expected}]`, () => {
      expect(slugify(item.name)).to.equal(item.expected)
    })
  })
})

describe('Form utilities: populate', () => {
  const popSpec = {
    // target: source
    name: 'job.name',
    literal: 'specific', // Literal value (has no '.')
    age: 'job.docs.type=q1.0.formData.client.age',
    'convey/transaction-transfer': true,
    // Array will be interpreted and concatenated into a single string
    ageYears: [
      'job.docs.type=q1.0.formData.client.age',
      ' ',
      'job.docs.type=q1.0.formData.client.units',
    ],
    'client/participant-name': 'job.persons.role=PART.0.name',
    'client/boss-name': 'job.persons.role=BOSS.0.name',
    units: {
      or: [
        'job.docs.type=q1.0.formData.client.working',
        'job.docs.type=q1.0.formData.client.status',
      ],
    },

    'workshop.name': 'workshop.name',
    'costs/invoice-cost': { func: 'removeGST', src: 'job.cost' },
    'costs/invoice-gst': { func: 'GSTFrom', src: 'job.cost' },
    bogus: { func: 'NoneSuch', src: 'job.cost' },
    startDate: { format: 'DATE_SHORT', src: 'workshop.startdate' },
    endDate: { format: 'MMMM dd, yyyy', src: 'workshop.startdate' },
    nullDate: { format: 'MMMM dd, yyyy', src: 'job.nothing' }, // Empty string - invalid date
    'participant/0/participant-name': 'job.persons.role=PART.0.name',
    'participant/0/participant-email': 'job.persons.role=PART.0.email',
    'participant/0/participant-mobile': 'job.persons.role=PART.0.mobile',
  }
  const workshop = {
    location: 'Newport Beach Marriott Bayview',
    address: '500 Bayview Circle',
    city: 'Newport Beach',
    hotel_id: 'SC19',
    state: 'CA',
    meals_charge_date: '2022-09-29T14:00:00.000Z',
    startdate: new Date('2023-12-25'),
    date: 'October 5-7, 2022',
    workshop_id: 'SC19-10052022',
    workshopId: 'FGkPDZnsJSW2SMkFq',
  }
  const job = {
    location: 'Newport Beach Marriott Bayview',
    address: '500 Bayview Circle',
    city: 'Newport Beach',
    hotel_id: 'SC19',
    state: 'CA',
    meals_charge_date: '2022-09-29T14:00:00.000Z',
    startdate: '2022-10-04T13:00:00.000Z',
    date: 'October 5-7, 2022',
    workshop_id: 'SC19-10052022',
    workshopId: 'FGkPDZnsJSW2SMkFq',
    persons: [
      {
        name: 'Paul McCartney',
        role: 'PART',
        mobile: '0400 000 111',
        email: 'paul@beatles.com',
      },
      {
        name: 'Bill Boss',
        role: 'BOSS',
        mobile: '0400 999 111',
        email: 'manager@beatles.com',
      },
    ],
    cost: '660',
    docs: [
      {
        type: 'q1',
        formData: {
          client: { age: 99, units: 'years', status: 'retired' },
          property: { 'certificate-volume': '91191', 'certificate-folio': '911' },
        },
      },
      {
        type: 'q2',
        formData: {
          clients: [
            { name: 'Charlie', residential: 'My personal home address', role: 'CUS' },
          ],
        },
      },
    ],
  }

  it('Populates a new webform with data from the job or other webforms', () => {
    job.docs.push(populateDoc({ job, workshop }, popSpec, 'mli'))

    const cus = job.persons.find((doc) => doc.role === 'PART')
    expect(cus).to.be.an('object')
    const mli = job.docs.find((doc) => doc.type === 'mli')
    // debug(mli)
    expect(mli).to.be.an('object')
    expect(mli.formData.bogus).to.be.equal('[object Object]')
  })

  const mli = populateDoc({ job, workshop }, popSpec, 'mli')
  const cus = job.persons.find((doc) => doc.role === 'PART')

  const tests = [
    { value: mli.formData.client['participant-name'], expected: cus.name },
    { value: mli.formData.client['boss-name'], expected: 'Bill Boss' },
    { value: mli.formData.convey['transaction-transfer'], expected: true },
    { value: mli.formData.costs['invoice-cost'], expected: '600' },
    { value: mli.formData.costs['invoice-gst'], expected: '60' },
    { value: mli.formData.participant[0]['participant-name'], expected: cus.name },
    { value: mli.formData.startDate, expected: '25/12/2023' },
    { value: mli.formData.endDate, expected: 'December 25, 2023' },
    { value: mli.formData.nullDate, expected: undefined },
  ]
  tests.forEach((test) => {
    it(`Checks the value = ${test.expected}`, () => {
      const cus = job.persons.find((doc) => doc.role === 'PART')
      expect(cus).to.be.an('object')
      expect(test.value).to.be.equal(test.expected)
    })
  })
})

describe('Form utilities: postcalc', () => {
  const calcSpec = {
    postcalc: {
      // target: source
      total__spent: { func: 'arraySum', src: 'time.activities.*.activities__spent' },
      total__should: { func: 'arraySum', src: 'time.activities.*.activities__should' },
      // Accessing jobn data not supported yet: TODO
      // manYears: { func: 'arraySum', src: 'job.persons.*.age' },
      // kidYears: { func: 'arraySum', src: 'job.kidsAges' },
    },
  }
  const job = {
    location: 'Newport Beach Marriott Bayview',
    address: '500 Bayview Circle',
    city: 'Newport Beach',
    hotel_id: 'SC19',
    state: 'CA',
    meals_charge_date: '2022-09-29T14:00:00.000Z',
    startdate: '2022-10-04T13:00:00.000Z',
    date: 'October 5-7, 2022',
    workshop_id: 'SC19-10052022',
    workshopId: 'FGkPDZnsJSW2SMkFq',
    kidsAges: [3, 5, 6],
    persons: [
      {
        name: 'Paul McCartney',
        role: 'PART',
        mobile: '0400 000 111',
        email: 'paul@beatles.com',
        age: '27',
      },
      {
        name: 'Bill Boss',
        role: 'BOSS',
        mobile: '0400 999 111',
        email: 'manager@beatles.com',
        age: 34,
      },
      {
        name: 'Harry Boss',
        role: 'BOSS',
        mobile: '0400 999 111',
        email: 'harry@beatles.com',
      },
    ],
    docs: [
      {
        type: 'q3',
        formData: {
          time: {
            activities: [
              {
                activities__spent: NumberInt(50),
                activities__activity: 'Working',
                activities__should: NumberInt(40),
              },
              {
                activities__spent: NumberInt(40),
                activities__activity: 'Sleeping',
                activities__should: NumberInt(10),
              },
              {
                activities__spent: NumberInt(0),
                activities__activity: 'Playing',
                activities__should: NumberInt(0),
              },
              {
                activities__activity: '',
                activities__should: NumberInt(0),
                activities__spent: NumberInt(10),
              },
              {
                activities__activity: '',
                activities__spent: NumberInt(0),
              },
              {
                activities__activity: '',
                activities__should: '0',
                activities__spent: '0',
              },
            ],
          },
        },
      },
    ],
  }

  const q3Doc = job.docs.find((doc) => doc.type === 'q3')

  doPostcalc(calcSpec, q3Doc.formData)
  // debug(q3Doc.formData)
  const tests = [
    { value: q3Doc.formData.total__spent, expected: 100 },
    { value: q3Doc.formData.total__should, expected: 50 },
    // Accessing job data not supported yet: TODO
    // { value: q3Doc.formData.manYears, expected: 61 },
    // { value: q3Doc.formData.kidYears, expected: 14 },
  ]
  tests.forEach((test) => {
    it(`Checks the calculation = ${test.expected}`, () => {
      expect(test.value).to.be.equal(test.expected)
    })
  })
})
