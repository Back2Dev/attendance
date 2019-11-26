import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'

import Edit from './edit'

export default withTracker(props => {
  const save = form => {
    Meteor.call('update.ServiceItems', form)
    props.history.push('/admin/serviceitems')
  }
  const cancel = () => {
    props.history.push('/admin/serviceitems')
  }

  const subsHandle = Meteor.subscribe('id.serviceItems', props.match.params.id)
  return {
    item: ServiceItems.findOne(props.match.params.id) || {},
    
    loading: !subsHandle.ready(),
    save,
    cancel
  }
})(Edit)
