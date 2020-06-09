import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import MemberEditForm from './member-edit'
import { ReactiveVar } from 'meteor/reactive-var'
import isIframe from '/imports/helpers/isIframe'
import getSchemas from '/imports/ui/config/member-add-schemas'

const debug = require('debug')('b2b:addmember')
import Alert from '/imports/ui/utils/alert'

const success = new ReactiveVar(false)
const error = new ReactiveVar(false)
const msg = new ReactiveVar('')
const newId = new ReactiveVar('')

export default withTracker((props) => {
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

  const setMember = async (formData) => {
    if (props.member != null) {
      // we are updating the member
      debug('updating member', formData)
      try {
        const res = await Meteor.callAsync(
          'members.update',
          formData._id,
          formData
        )
        setSuccess('Member Saved', formData._id)
        return res
      } catch (e) {
        debug('error updating member', formData, e)
        setError(e)
      }
    }
  }

  const updateMemberPassword = async (formData, confirmPass) => {
    if (props.member != null) {
      // debug('updating member password', formData)
      try {
        const res = await Meteor.callAsync(
          'updateMemberPassword',
          formData,
          confirmPass
        )
        setSuccess('Member password saved', formData.userId)
        return res
      } catch (e) {
        debug('error updating member password', formData, e)
        setError(e)
      }
    }
  }

  document.title = `${Meteor.settings.public.org} - add ${Meteor.settings.public.member}`

  return {
    setMember,
    updateMemberPassword,
    setMember,
    error: error.get(),
    success: success.get(),
    message: msg.get(),
    isIframe: isIframe(),
    newId: newId.get(),
    resetId: () => newId.set(''),
    member: props.member ? props.member : null,
    schemas: getSchemas(`${Meteor.settings.public.recruit}Edit`),
  }
})(MemberEditForm)
