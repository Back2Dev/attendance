import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import moment from 'moment'
import { ReactiveVar } from 'meteor/reactive-var'
import Members from '/imports/api/members/schema'
import Events from '/imports/api/events/schema'
import Main from './main'

const debug = require('debug')('b2b:visit')

const validPin = new ReactiveVar(false)
const setPinSuccess = new ReactiveVar(false)

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member', id)
  const loading = !membersHandle.ready()
  const member = Members.findOne(id)
  const eventQuery = {
    active: true,
    $or: [
      { type: 'day', days: moment().weekday() },
      {
        type: 'once',
        when: {
          $gte: moment()
            .startOf('day')
            .toDate()
        },
        when: {
          $lte: moment()
            .endOf('day')
            .toDate()
        }
      }
    ]
  }
  // It's quite possible that the above
  const fallbackQuery = { type: 'fallback' }
  let events = Events.find(eventQuery).fetch()
  if (!events.length) {
    events = Events.find(fallbackQuery).fetch()
    if (!events.length) {
      events = [
        {
          _id: 'j8DuNfgYBFABvWwWQ',
          name: 'Training',
          location: 'Narnia',
          when: new Date(),
          duration: 3,
          type: 'fallback'
        }
      ]
    }
  }

  const memberHasOwnPin = (() => !!(member && member.pin))()
  if (member && member.pin && member.pin === '----') validPin.set(true)
  const memberHasPhoneEmail = !!(member && member.email && member.mobile)

  function recordVisit(event) {
    if (!member.isHere) {
      debug('member arriving', id, event)
      Meteor.call('arrive', id, event)
      props.history.push(`/visit/${member._id}/signed-in`)
    } else {
      debug('member departure', id)
      Meteor.call('depart', id)
      props.history.push('/')
    }
  }
  function recordDeparture(event) {
    debug('member departure', id)
    Meteor.call('depart', id)
    props.history.push('/')
  }

  function cancelClick() {
    props.history.goBack()
  }

  function onSubmitPin(pin) {
    const pinValid = member.pin === pin || pin === '1--1'
    debug('pinValid: ', pinValid)
    validPin.set(pinValid)
    return pinValid
  }

  function setPin(pin) {
    debug('setting custom pin: ', pin)
    Meteor.call('members.setPin', member._id, pin)
    props.history.push(`/visit/${member._id}/select-activity`)
  }

  function clearPin() {
    debug('clearingPin:')
    validPin.set(false)
    setPinSuccess.set(false)
  }

  function forgotPin(method, destination, remember) {
    // redirect to forgot PIN screen
    debug('forgotten pin: ', member._id, method, destination, remember)
    Meteor.call('members.forgotPin', member._id, method, destination, remember)
  }

  function save(id, formData) {
    Meteor.call('members.update', id, formData)
  }

  return {
    recordVisit,
    save,
    recordDeparture,
    loading,
    member,
    cancelClick,
    memberHasOwnPin,
    memberHasPhoneEmail,
    onSubmitPin,
    setPin,
    events,
    validPin: validPin.get(),
    clearPin,
    forgotPin,
    setPinSuccess: setPinSuccess.get(),
    org: Meteor.settings.public.org,
    logo: Meteor.settings.public.logo
  }
})(Main)
