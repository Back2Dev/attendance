import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Factory from '/imports/test/factories'
import '/imports/api/assessments/methods'
import Assessments from '/imports/api/assessments/schema'

const debug = require('debug')('b2b:assessment')

const goodAssessment = Factory.build('assessment')
const updatedAssessment = Factory.build('assessment', {
  customerDetails: { name: 'Test Name' },
})
const goodLogger = Factory.build('logs')

if (Meteor.isServer) {
  describe('API methods for assessment', () => {
    it('logger.insert method will work', () => {
      expect(() =>
        Meteor.call('logger.insert', goodLogger)
      ).to.not.throw()
    })

    it('assessment.insert method will work', () => {
      expect(() =>
        Meteor.call('assessment.insert', goodAssessment)
      ).to.not.throw()
    })

    it('assessment.updateJobStatus', () => {
      const jobId = Assessments.find({}).fetch()[0]._id
      expect(() =>
        Meteor.call('assessment.updateJobStatus', jobId, 2)
      ).to.not.throw()
    })

    it('assessment.update', () => {
      const job = Factory.build('assessment')
      // debug('Job is ', job)
      expect(() =>
        Meteor.call(
          'assessment.update',
          job,
          'SEND_SMS',
          '... Cost is $99 ...'
        )
      ).to.not.throw()
    })
  })
}
