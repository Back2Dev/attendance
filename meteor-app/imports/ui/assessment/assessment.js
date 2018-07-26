import { withTracker } from "meteor/react-meteor-data";
import AssessmentAdd from "/imports/ui/assessment/assessment-add";
import { ReactiveVar } from "meteor/reactive-var";
import Services from '/imports/api/assessments/services'
import ServiceItems from '/imports/api/assessments/serviceItems'
import Members from '/imports/api/members/members'
import Assessment from '/imports/api/assessments/assessment'
import Alert from 'react-s-alert'
import 'react-s-alert/dist/s-alert-default.css'
import 'react-s-alert/dist/s-alert-css-effects/slide.css'

const debug = require('debug')('b2b:addassessment')

export default withTracker(props => {
  const success = new ReactiveVar(false);
  const error = new ReactiveVar(false);
  const msg = new ReactiveVar("");
  const newId = new ReactiveVar("");
  
  Meteor.subscribe('services.all')
  Meteor.subscribe('serviceItems.all')
  Meteor.subscribe('assessments.all')
  Meteor.subscribe('all.members')

  // need to do something smarter than this... 
  function setError(e) {
    newId.set(null)
    error.set(true)
    success.set(false)
    msg.set(e.reason)
    Alert.error(e.reason)
  }

  function setSuccess(message, id) {
    newId.set(id)
    success.set(true)
    error.set(false)
    msg.set(message)
    Alert.success(message)
  }

  const setAssessment = async formData => {
    // Adding an assessment
    try {
      debug('adding assessment', formData)
      const res = await Meteor.callAsync("assessment.insert", formData)
      setSuccess("Successfully added new assessment", res)
      return res
    } catch (e) {
      setError(e)
    }
  }

  return {
    setAssessment,
    error: error.get(),
    success: success.get(),
    message: msg.get(),
    newId: newId.get(),
    resetId: () => newId.set(""),
    assessment: props.assessment ? props.assessment : null,
    services: Services.find().fetch(),
    serviceItems: ServiceItems.find().fetch(),
    members: Members.find().fetch(),
    assessmentLastSaved: Assessment.find({}, { sort: { createdAt: -1 } }).fetch()[0]
  };
})(AssessmentAdd);