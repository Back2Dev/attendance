import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Factory from '/imports/test/factories'

const goodAssessment = Factory.build('assessment')
const goodLogger = Factory.build('logs')

describe('API methods for assessment', () => {

  it('logger.insert method will work', () => {
    // This is not working yet
    const insertLog = Meteor.server.method_handlers['logger.insert']
    const log = insertLog.apply({}, [goodLogger])
    // const log = Meteor.call('logger.insert', goodLogger)
    expect(log).to.be.equal(goodLogger)
  })

  it('assessment.insert method will work', () => {
    // This is not working
    const insertLog = Meteor.server.method_handlers['assessment.insert']
    const assessment = insertLog.apply({}, [goodAssessment])
    // const assessment = Meteor.call('assessment.insert', goodAssessment)
    expect(assessment).to.be.equal(goodAssessment)
  })
})