import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { parse } from './engine'
import { accessByPath } from '/imports/api/util'
import Factory from '/imports/test/factories'

const debug = require('debug')('app:forms:engine')

const goodForms = [
  {
    source: `# My questionnaire
Q: Personal details
  +id=personal
  +type=short
  A= Name
  A Email
    +type=email
  A Mobile
    +type=mobile
Q Emergency contact
+id=emergency
  A= Name
  A Email
    +type=email
  A Mobile
    +type=mobile
`,
    expecting: [
      {
        'questions.0.prompt': 'Personal details',
        'questions.0.answers.0.text': 'Name',
      },
    ],
  },
  Factory.create('forms.b2b.register'),
  Factory.create('forms.invoice'),
]

const data = {
  questions: [
    {
      prompt: 'Personal details',
      answers: [
        { text: 'Name' },
        { text: 'Email', type: 'email' },
        { text: 'Mobile', type: 'mobile' },
      ],
    },
  ],
}

const badForms = [{}]

describe('Test forms functions', () => {
  describe('Good forms', () => {
    it(``, () => {
      goodForms.map((form) => {
        let result
        expect(() => {
          result = parse(form.source)
          debug(result)
        }).not.to.throw()
        debug(JSON.stringify(result, null, 2))
        // expect(result.object.questions[0].prompt).to.be.equal('Personal details')
        expect(result).to.have.property('status').which.equal('success')
        form.expecting.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const value = item[key]
            const got = accessByPath(result.object, key)
            debug(`Looking for ${key}, value: ${value}, got: ${got}`)
            expect(got).to.be.equal(value)
          })
        })
      })
    })
  })
  // describe('Bad forms', () => {
  //   it(``, () => {
  //     badForms.map((form) => {
  //       let result
  //       expect(() => {
  //         result = Meteor.call('insert.messages', form)
  //       }).not.to.throw()
  //       // debug(result)
  //       expect(result).to.have.property('status').which.equal('failed')
  //     })
  //   })
  // })
})
