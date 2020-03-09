import { withTracker } from 'meteor/react-meteor-data'
import { Meteor } from 'meteor/meteor'
import MemberAdd from '/imports/ui/member/member-add'
import { ReactiveVar } from 'meteor/reactive-var'
import isIframe from '/imports/helpers/isIframe'
import getSchemas from '/imports/ui/config/member-add-schemas'

const debug = require('debug')('b2b:addmember')
import Alert from 'react-s-alert'

const success = new ReactiveVar(false)
const error = new ReactiveVar(false)
const msg = new ReactiveVar('')
const newId = new ReactiveVar('')

export default withTracker(props => {
  // need to do something smarter than this...
  function setError(e) {
    newId.set(null)
    error.set(true)
    success.set(false)
    msg.set(e.message)
    Alert.error(e.message)
  }

  function setSuccess(message, id) {
    newId.set(id)
    success.set(true)
    error.set(false)
    msg.set(message)
    Alert.success(message)
  }

  const setMember = async formData => {
    if (props.member != null) {
      // we are updating the member
      debug('updating member', formData)
      try {
        const res = await Meteor.callAsync('members.update', formData._id, formData)
        setSuccess('Saved ok', formData._id)
        return res
      } catch (e) {
        debug('error updating member', formData, e)
        setError(e)
      }
    } else {
      // we are adding a member
      try {
        debug('adding member', formData)
        // creates a user and returns an id for storing in member's collection
        const response = await Meteor.callAsync('addUser', formData.email, formData.password)
        // Stores the data into member's collection
        if (response.status === 'success') {
          const res = await Meteor.callAsync('members.insert', { ...formData, userId: id })
          setSuccess('Details saved ok', res)
          return res
        } else {
          setError(response)
        }
      } catch (e) {
        setError(e)
      }
    }
  }

  document.title = `${Meteor.settings.public.org} - add ${Meteor.settings.public.member}`

  return {
    setMember,
    error: error.get(),
    success: success.get(),
    message: msg.get(),
    isIframe: isIframe(),
    newId: newId.get(),
    resetId: () => newId.set(''),
    member: props.member ? props.member : null,
    schemas: getSchemas(Meteor.settings.public.recruit)
  }
})(MemberAdd)
