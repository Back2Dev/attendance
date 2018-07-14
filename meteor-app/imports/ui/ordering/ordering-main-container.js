import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'

import OrderingMain from '/imports/ui/ordering/ordering-main'
import Parts from '/imports/api/parts/parts';

Session.set('searchQuery', '')

export default withTracker((props) => {
  const partsHandle = Meteor.subscribe('all.parts')

  return {
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(OrderingMain)
