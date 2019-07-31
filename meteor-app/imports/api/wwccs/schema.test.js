import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

// Don't mention ze war! (or ze debu g g e r!)

import { randomId } from '/imports/test/util'
import Wwccs from '/imports/api/wwccs/schema'
import Factory from '/imports/test/factories'
import { RegExId } from '../schema'

const badWwccs = [
  // Missing wwcc
  {
    memberId: 'SYdWnRL5LmZXT4GxE',
    surname: 'French'
  },
  // Missing surname
  {
    memberId: 'SYdWnRL5LmZXT4GxE',
    wwcc: '00000021'
  },
  // Missing memberId
  {
    wwcc: '00000021',
    surname: 'French'
  },
  // Invalid responses
  {
    memberId: 'SYdWnRL5LmZXT4GxE',
    wwcc: '00019845',
    surname: 'King',
    responses: '[ "reason": "something wrong" ]'
  },
  // Invalid responses
  // {
  //   memberId: 'SYdWnRL5LmZXT4GxE',
  //   wwcc: '00019845',
  //   surname: 'King',
  //   responses: { reason: 'Something wrong - unexpected object' }
  // }
  // Invalid responses
  {
    memberId: 'SYdWnRL5LmZXT4GxE',
    wwcc: '00019845',
    surname: 'King',
    responses: [{ reason: 'Something wrong - unexpected element' }]
  }
]

const goodWwccs = [
  {
    wwcc: '00019845',
    surname: 'King',
    memberId: 'SYdWnRL5LmZXT4GxE',
    responses: []
  },
  {
    wwcc: '00019845-02',
    surname: 'Thomas, Geraint',
    memberId: 'SYdWnRL5LmZXT4GxE',
    responses: []
  }
]

goodWwccs.push(Factory.build('wwcc'))

describe('schema', () => {
  beforeEach(resetDatabase)

  goodWwccs.forEach((good, i) => {
    good._id = randomId()

    describe(`WwccsSchema good wwccs ${good._id}`, () => {
      it(`Succeeds on GOOD Wwccs insert ${i + 1}`, () => {
        expect(() => Wwccs.insert(good)).not.to.throw()
      })
    })
    describe('query database good wwccs', () => {
      it('success if database query matches', () => {
        const wwccId = Wwccs.insert(good)
        const wwcc = Wwccs.findOne(wwccId)

        expect(wwcc._id).to.equal(good._id)
        expect(wwcc.wwcc).to.equal(good.wwcc)
      })
    })
  })

  badWwccs.forEach((bad, i) => {
    bad._id = randomId()

    describe('WwccsSchema bad wwccs', () => {
      it(`Succeeds on BAD Wwccs insert ${i + 1}`, () => {
        expect(() => Wwccs.insert(bad)).to.throw()
      })
    })
  })
})
