import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'

import Add from './add'

export default withTracker(props => {
  const save = form => {
    Meteor.call('add.ServiceItems', form)
    props.history.push('/admin/serviceitems')
  }
  const cancel = () => {
    props.history.push('/admin/serviceitems')
  }

  const subsHandle = Meteor.subscribe('add.serviceItems')
  return {
    
    loading: !subsHandle.ready(),
    save,
    cancel
  }
})(Add)
