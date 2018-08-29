import { Meteor } from "meteor/meteor"
import { withTracker } from "meteor/react-meteor-data"
import { ReactiveVar } from "meteor/reactive-var"
import Logger from '/imports/api/assessments/logger'
import Assessment from '/imports/api/assessments/assessment'
import Members from '/imports/api/members/members'
import JobCardList from '/imports/ui/assessment/assessment-job-card-list'

import { JOB_STATUS_ALL, JOB_STATUS_READABLE } from '/imports/api/constants'

const searchVar = new ReactiveVar('')
const statusVar = new ReactiveVar('')
// currently opened assessment Id
// so that we can dynamically subscribe to logs
const selectedaId = new ReactiveVar('')

export default withTracker(props => {
  const jobSub = Meteor.subscribe('assessments.current')
  const membersSub = Meteor.subscribe('all.members')
  const logSub = Meteor.subscribe('logger.assessment', selectedaId.get())
  const loading = !jobSub.ready() && !membersSub.ready() && !logSub.ready()
  function changeAssId(aId){
    selectedaId.set(aId)
  }
  const logs = Logger.find({aId: selectedaId.get()}).fetch()

  const searchFind = search => {
    resetStatus()
    searchVar.set(search)
  }

  const statusFilter = (status) => {
    let statusValue
    if(status === 'all'){
      statusValue = JOB_STATUS_ALL
    } else {
      statusValue = Object.keys(JOB_STATUS_READABLE) // [ "1","2","3","4","5" ]
        .filter(key => key === status.key) // ["1"]
        .map(value => parseInt(value)) // [1]
  }
  statusVar.set(statusValue)
  }

  const resetStatus = () => {
    statusVar.set(JOB_STATUS_ALL)
  }

  const updateStatus = (jobId, updatedStatus) => {
    Meteor.call('assessment.updateJobStatus', jobId, updatedStatus)
  }

  const renderJob = () => {
    const search = searchVar.get()
    const status = statusVar.get()
    if (status == '') {
      return Assessment.find({ search: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i" } }).fetch()
    }
    return Assessment.find({ search: { $regex: search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: "i"  }, status: { $in: status } }).fetch()
  }

  return {
    loading,
    jobs: renderJob(),
    members: Members.find({}, { fields: {name: 1}, sort: { name: 1 } }).fetch(),
    searchFind,
    statusFilter,
    updateStatus,
    resetStatus,
    logs,
    selectedaId: selectedaId.get(),
    changeAssId,
  }
})(JobCardList)