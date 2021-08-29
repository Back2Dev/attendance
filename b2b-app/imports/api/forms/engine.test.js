import { Meteor } from 'meteor/meteor'
import { expect } from 'chai'
import { parse } from './engine'
import { accessByPath } from '/imports/api/util'
import Factory from '/imports/test/factories'
import { goodForms, badForms } from './engine.test.data'

const debug = require('debug')('app:forms:engine')

describe('Test forms functions', () => {
  describe('Good forms', () => {
    goodForms.map((form, ix) => {
      it(`Form ${ix + 1}: ${form.name}`, () => {
        let result
        expect(() => {
          result = parse(form.source)
          // debug(result)
        }).not.to.throw()
        // debug(JSON.stringify(result, null, 2))
        // expect(result.object.questions[0].prompt).to.be.equal('Personal  details')
        expect(result).to.have.property('message').which.equal('')
        expect(result).to.have.property('status').which.equal('success')
        form.expecting?.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const value = item[key]
            const got = accessByPath(result.survey, key)
            // debug(`Looking for ${key}, value: ${value}, got: ${got}`)
            expect(got).to.be.equal(value)
          })
        })
      })
    })
  })

  describe('Bad forms', () => {
    badForms.map((form, ix) => {
      it(`Form ${ix + 1}: ${form.name}`, () => {
        let result
        expect(() => {
          result = parse(form.source)
          // debug(result)
        }).not.to.throw()
        // debug(result)
        expect(result).to.have.property('message').which.equal('')
        expect(result).to.have.property('status').which.equal('failed')
        form.expecting?.forEach((item) => {
          Object.keys(item).forEach((key) => {
            const value = item[key]
            const got = accessByPath(result, key)
            // debug(`Looking for ${key}, value: ${value}, got: ${got}`)
            expect(got).to.be.equal(value)
          })
        })
      })
    })
  })
})
