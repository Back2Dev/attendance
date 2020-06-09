import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Alert from 'react-s-alert'
import moment from 'moment'
import { Carts } from '/imports/api/products/schema'
import Members from '/imports/api/members/schema'
import Sessions from '/imports/api/sessions/schema'
import Purchases from '/imports/api/purchases/schema'
import Products from '/imports/api/products/schema'
import Main from './main'
import context from '/imports/ui/utils/nav'

const debug = require('debug')('b2b:visit')

export default withTracker(props => {
  const membersHandle = Meteor.subscribe('member.all.userid', Meteor.userId())
  const loading = !membersHandle.ready()
  const member = !Meteor.userId() ? {} : Members.findOne({ userId: Meteor.userId() })
  let purchases = []
  let carts = []
  let sessions = []
  if (Meteor.userId() && membersHandle.ready()) {
    purchases = Purchases.find({ memberId: member._id }, { sort: { createdAt: -1 } }).fetch()
    carts = Carts.find({ memberId: member._id }).fetch()
    sessions = Sessions.find({ memberId: member._id }).fetch()
  }
  const cart = carts.filter(cart => cart.status === 'ready')[0]

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

  function save(id, formData) {
    Meteor.call('members.update', id, formData)
  }

  return {
    save,
    loading,
    cart,
    member,
    purchases,
    sessions,
    org: Meteor.settings.public.org,
    logo: Meteor.settings.public.logo,
    addCard: Meteor.settings.public.addCard
  }
})(Main)
