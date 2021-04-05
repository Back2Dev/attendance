import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import Settings from '/imports/api/settings/schema'

import Edit from './edit'

export default withTracker(props => {
  const save = form => {
    Meteor.call('update.Settings', form)
    props.history.push('/admin/settings')
  }
  const cancel = () => {
    props.history.push('/admin/settings')
  }

  const subsHandle = Meteor.subscribe('id.settings', props.match.params.id)
  return {
    item: Settings.findOne(props.match.params.id) || {},
    
    loading: !subsHandle.ready(),
    save,
    cancel
  }
})(Edit)
