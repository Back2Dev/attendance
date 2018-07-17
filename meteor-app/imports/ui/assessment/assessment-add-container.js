import { withTracker } from "meteor/react-meteor-data";
import AssessmentAdd from "/imports/ui/assessment/assessment-add";
import { ReactiveVar } from "meteor/reactive-var";

// Do we need?
// import isIframe from "/imports/helpers/isIframe";
// const debug = require('debug')('att:addmember')

import Alert from 'react-s-alert';

const success = new ReactiveVar(false);
const error = new ReactiveVar(false);
const msg = new ReactiveVar("");
const newId = new ReactiveVar("");

export default withTracker(props => {
  // need to do something smarter than this... 
  function setError(e){
    newId.set(null)
    error.set(true)
    success.set(false)
    msg.set(e.reason)
    Alert.error(e.reason)
  }
  
  function setSuccess(message, id){
    newId.set(id)
    success.set(true)
    error.set(false)
    msg.set(message)
    Alert.success(message)
  }

  const setAssessment = async (formData) => {
    if (props.assessment != null) {
      // we are updating the assessment
      debug('updating assessment', formData)
      try {
        const res = await Meteor.callAsync('assessments.update', formData._id, formData)
        setSuccess('Successfully edited assessment', formData._id)
        return res
      } catch (e) {
        debug('error updating assessment', formData, e)
        setError(e)
      }
    } else {
      // we are adding a assessment
      try {
        debug('adding assessment', formData)
        const res = await Meteor.callAsync("assessments.insert", formData)
        setSuccess("Successfully added new assessment", res)
        return res
      } catch (e) {
        setError(e)
      }

    }
  }


  return {
    setAssessment,
    error: error.get(),
    success: success.get(),
    message: msg.get(),
    // isIframe: isIframe(),
    newId: newId.get(),
    resetId: () => newId.set(""),
    assessment: props.assessment ? props.assessment : null
  };
})(AssessmentAdd);