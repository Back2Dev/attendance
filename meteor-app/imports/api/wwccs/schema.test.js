import { resetDatabase } from '/imports/test/util-test'
import { expect } from 'chai'

// Don't mention ze war! (or ze debu g g e r!)

import Wwccs from '/imports/api/wwccs/schema'
import Factory from '/imports/test/factories'
import { RegExId } from '../schema'

const badWwccs = [
  // Missing wwcc
  {
    memberId: '3DE54FGTddfhhh',
    surname: 'French'
  },
  // Missing surname
  {
    memberId: '3DE54FGTddfhhh',
    wwcc: '00000021'
  },
  // Missing memberId
  {
    wwcc: '00000021',
    surname: 'French'
  },
  // Invalid responses
  {
    memberId: '3DE54FGTddfhhh',
    wwcc: '00019845',
    surname: 'King',
    responses: '[ "reason": "something wrong" ]'
  },
  // Invalid responses
  {
    memberId: '3DE54FGTddfhhh',
    wwcc: '00019845',
    surname: 'King',
    responses: { reason: 'Something wrong - unexpected object' }
  },
  // Invalid responses
  {
    memberId: '3DE54FGTddfhhh',
    wwcc: '00019845',
    surname: 'King',
    responses: [{ reason: 'Something wrong - unexpected element' }]
  }
]

const goodWwccs = [
  {
    wwcc: '00019845',
    surname: 'King',
    memberId: 'asdf9kj98',
    responses: []
  },
  {
    wwcc: '00019845-02',
    surname: 'Thomas, Geraint',
    memberId: 'asdf9kj98e3s0',
    responses: []
  }
]

goodWwccs.push(Factory.build('wwcc'))

describe('schema', () => {
  beforeEach(resetDatabase)

  goodWwccs.forEach((good, i) => {
    describe('WwccsSchema good wwccs', () => {
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
    describe('WwccsSchema bad wwccs', () => {
      it(`Succeeds on BAD Wwccs insert ${i + 1}`, () => {
        expect(() => Wwccs.insert(bad)).to.throw()
      })
    })
  })
})
