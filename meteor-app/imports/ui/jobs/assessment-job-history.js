import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import { ReactiveVar } from 'meteor/reactive-var'
import Assessments from '/imports/api/assessments/schema'
import Members from '/imports/api/members/schema'
import Logger from '/imports/api/assessments/logger'
import JobHistoryList from '/imports/ui/assessment/assessment-job-history-list'
import { JOB_STATUS_READABLE, JOB_STATUS_COMPLETE } from '/imports/api/constants'

const searchVar = new ReactiveVar('')
const statusVar = new ReactiveVar('')
const selectedaId = new ReactiveVar('')

export default withTracker(props => {
  const jobSub = Meteor.subscribe('assessments.archive')
  const membersSub = Meteor.subscribe('all.members')
  const logSub = Meteor.subscribe('logger.assessment', selectedaId.get())
  const loading = !jobSub.ready() && !membersSub.ready() && !logSub.ready()
  function changeAssId(aId) {
    selectedaId.set(aId)
  }
  const logs = Logger.find({ aId: selectedaId.get() }).fetch()

  const searchFind = search => {
    resetStatus()
    searchVar.set(search)
  }

  const statusFilter = status => {
    let statusValue
    if (status === 'all') {
      statusValue = JOB_STATUS_COMPLETE
    } else {
      statusValue = Object.keys(JOB_STATUS_READABLE) // [ "1","2","3","4","5" ]
        .filter(key => key === status.key) // ["1"]
        .map(value => parseInt(value)) // [1]
    }
    statusVar.set(statusValue)
  }

  const resetStatus = () => {
    statusVar.set(JOB_STATUS_COMPLETE)
  }

  const updateStatus = (jobId, updatedStatus) => {
    Meteor.call('assessment.updateJobStatus', jobId, updatedStatus)
  }

  const updatePaid = jobId => {
    Meteor.call('assessment.updatePaid', jobId)
  }

  const renderJob = () => {
    const search = searchVar.get()
    const status = statusVar.get()
    if (status == '') {
      return Assessments.find(
        { search: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' } },
        { sort: { createdAt: -1 } }
      ).fetch()
    }
    return Assessments.find(
      { search: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }, status: { $in: status } },
      { sort: { createdAt: -1 } }
    ).fetch()
  }

  return {
    loading,
    jobs: renderJob(),
    members: Members.find({}, { fields: { name: 1 }, sort: { name: 1 } }).fetch(),
    searchFind,
    statusFilter,
    updateStatus,
    updatePaid,
    resetStatus,
    logs,
    selectedaId: selectedaId.get(),
    changeAssId
  }
})(JobHistoryList)
