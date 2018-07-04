import { withTracker } from "meteor/react-meteor-data";
import MemberAdd from "/imports/ui/member/member-add";
import { ReactiveVar } from "meteor/reactive-var";
import isIframe from "/imports/helpers/isIframe";
const debug = require('debug')('att:addmember')
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

  const setMember = async (formData) => {
    if (props.member != null) {
      // we are updating the member
      debug('updating member', formData)
      try {
        const res = await Meteor.callAsync('members.update', formData._id, formData)
        setSuccess('Successfully edited member', formData._id)
        return res
      } catch (e) {
        debug('error updating member', formData, e)
        setError(e)
      }
    } else {
      // we are adding a member
      try {
        debug('adding member', formData)
        const res = await Meteor.callAsync("members.insert", formData)
        setSuccess("Successfully added new volunteer", res)
        return res
      } catch (e) {
        setError(e)
      }

    }
  }


  return {
    setMember,
    error: error.get(),
    success: success.get(),
    message: msg.get(),
    isIframe: isIframe(),
    newId: newId.get(),
    resetId: () => newId.set(""),
    member: props.member ? props.member : null
  };
})(MemberAdd);
