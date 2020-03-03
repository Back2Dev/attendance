import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Members from '/imports/api/members/schema'
import Main from './main'

const Loading = props => {
  if (props.loading) return <div>Loading...</div>
}

export default withTracker(props => {
  const id = props.match.params.id
  const membersHandle = Meteor.subscribe('member.all', id)
  const member = Members.findOne(id) || {}
  const usersSubscription = Meteor.subscribe('getAllUsers')
  const checkUser = Meteor.users.find({ username: member.email }).fetch()

  const add = form =>
    Meteor.call('addNewMemberUser', form.email, form.password, member._id, function(error, result) {
      if (result === 'success') {
        props.history.push('/login')
      } else {
        setError(result)
      }
    })

  return {
    checkUser,
    add,
    loading: usersSubscription.ready(),
    usersReady: usersSubscription.ready(),
    member
  }
})(Main)
