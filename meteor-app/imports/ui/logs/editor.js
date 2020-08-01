import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Logs from '/imports/api/logs/schema'
import Users from '/imports/api/users/schema'
import Members from '/imports/api/members/schema'
import Os from '/imports/api/os/schema'
import Edit from './edit'

export default withTracker(props => {
  const save = form => {
    Meteor.call('update.Logs', form)
    props.history.push('/admin/logs')
  }
  const cancel = () => {
    props.history.push('/admin/logs')
  }

  const subsHandle = Meteor.subscribe('id.logs', props.match.params.id)
  return {
    item: Logs.findOne(props.match.params.id) || {},
    users: Users.find({}).fetch(),
members: Members.find({}).fetch(),
os: Os.find({}).fetch(),
    loading: !subsHandle.ready(),
    save,
    cancel
  }
})(Edit)
