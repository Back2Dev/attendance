import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data'
import ServiceItems from '/imports/api/service-items/schema'

import View from './view'

export default withTracker(props => {
  const edit = id => {
    props.history.push(`/admin/service-items/edit/${id}`)
  }

  const subsHandle = Meteor.subscribe('id.serviceItems', props.match.params.id)
  console.log('id:' + props.match.params.id)
  return {
    item: ServiceItems.findOne(props.match.params.id) || {},
    
    loading: !subsHandle.ready(),
    edit
  }
})(View)
