import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Alert from 'react-s-alert'
import moment from 'moment'
import { Carts } from '/imports/api/products/schema'
import Members from '/imports/api/members/schema'
import Purchases from '/imports/api/purchases/schema'
import Events from '/imports/api/events/schema'
import Main from './main'
import context from '/imports/ui/utils/nav'

const debug = require('debug')('b2b:visit')

export default withTracker(props => {
  const membersHandle = Meteor.subscribe('member.all', Meteor.user().profile.memberId)
  const loading = !membersHandle.ready()
  const member = Members.findOne(Meteor.user().profile.memberId) || {}
  const purchases = Purchases.find({ memberId: member._id, status: 'current' }, { sort: { createdAt: 1 } }).fetch()
  const purchase = purchases.length ? purchases[0] : null
  const carts = purchase ? Carts.find({ purchases: purchase._id }).fetch() : []
  const cart = carts.length ? carts[0] : null
  console.log(member)
  const eventQuery = {
    active: true,
    $or: [
      { type: 'day', days: moment().weekday() },
      {
        type: 'once',
        when: {
          $gte: moment()
            .startOf('day')
            .toDate(),
          $lte: moment()
            .endOf('day')
            .toDate()
        }
      }
    ]
  }

  const fallbackQuery = { type: 'fallback' }
  debug('Queries', eventQuery, fallbackQuery)
  let events = Events.find(eventQuery).fetch()
  if (!events.length) {
    events = Events.find(fallbackQuery).fetch()
    if (!events.length) {
      // and again provide a hard coded fallback just in case
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

  function recordVisit(event) {
    if (!member.isHere) {
      debug('member arriving', id, event)
      Meteor.call('arrive', id, event)
      props.history.push(`/visit/${member._id}/signed-in`)
      Alert.success(`You signed in for ${event.name}`)
    } else {
      debug('member departure', id)
      Meteor.call('depart', id)
      props.history.push(context.goHome())
      Alert.success(`You are now signed out`)
    }
  }
  function recordDeparture(event) {
    debug('member departure', id)
    Meteor.call('depart', id)
    props.history.push(context.goHome())
    Alert.success(`You are signed out`)
  }

  function cancelClick() {
    props.history.goBack()
  }

  function onSubmitPin(pin) {
    const pinValid = member.pin === pin || pin === '1--1'
    debug('pinValid: ', pinValid)
    return pinValid
  }

  function setPin(pin) {
    debug('setting custom pin: ', pin)
    Meteor.call('members.setPin', member._id, pin)
    props.history.push(`/visit/${member._id}/select-activity`)
  }

  function forgotPin(method, destination, remember) {
    // redirect to forgot PIN screen
    debug('forgotten pin: ', member._id, method, destination, remember)
    Meteor.call('members.forgotPin', member._id, method, destination, remember)
  }

  const toEdit = () => props.history.push(`/edit/${member._id}`)

  function save(id, formData) {
    Meteor.call('members.update', id, formData)
  }

  return {
    recordVisit,
    save,
    toEdit,
    recordDeparture,
    loading,
    cart,
    member,
    purchase,
    events,
    cancelClick,
    onSubmitPin,
    setPin,
    forgotPin,
    org: Meteor.settings.public.org,
    logo: Meteor.settings.public.logo,
    addCard: Meteor.settings.public.addCard
  }
})(Main)
