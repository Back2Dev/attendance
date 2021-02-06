import { expect } from 'chai'
import { Meteor } from 'meteor/meteor'
import Factory from '/imports/test/factories'
import '/imports/api/jobs/methods'
import Jobs from '/imports/api/jobs/schema'

const goodJob = Factory.build('job')
const updatedJob = Factory.build('job', { customerDetails: { name: 'Test Name' } })
const goodLogger = Factory.build('logs')

if (Meteor.isServer) {
  describe('API methods for job', () => {
    it('logger.insert method will work', () => {
      expect(() => Meteor.call('logger.insert', goodLogger)).to.not.throw()
    })

    it('job.insert method will work', () => {
      expect(() => Meteor.call('job.insert', goodJob)).to.not.throw()
    })

    it('job.updateJobStatus', () => {
      const jobId = Jobs.find({}).fetch()[0]._id
      expect(() => Meteor.call('job.updateJobStatus', jobId, 2)).to.not.throw()
    })
  })
}
