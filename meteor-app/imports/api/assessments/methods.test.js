import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Factory from '/imports/test/factories'
import '/imports/api/assessments/methods'
import Assessment from '/imports/api/assessments/assessment'

const goodAssessment = Factory.build('assessment')
const updatedAssessment = Factory.build('assessment', { customerDetails: { name: 'Test Name' } })
const goodLogger = Factory.build('logs')

if (Meteor.isServer) {
  describe('API methods for assessment', () => {

    it('logger.insert method will work', () => {
      
      expect(() => Meteor.call('logger.insert', goodLogger)).to.not.throw()
    })
  
    it('assessment.insert method will work', () => {
      expect(() => Meteor.call('assessment.insert', goodAssessment)).to.not.throw()
    })

    it('assessment.updateJobStatus', () => {
      const jobId = Assessment.find({}).fetch()[0]._id
      expect(() => Meteor.call('assessment.updateJobStatus', jobId, 2)).to.not.throw()
    })
  })
}