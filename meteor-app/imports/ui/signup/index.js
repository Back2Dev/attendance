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
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.all', id)
  const member = Members.findOne(id) || {}
  console.log(member)

  return {
    member
  }
})(Main)
