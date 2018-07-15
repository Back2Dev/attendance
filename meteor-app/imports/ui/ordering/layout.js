import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import Ordering from '/imports/ui/ordering/ordering'
import Parts from '/imports/api/parts/schema';

Session.set('searchQuery', '')

export default withTracker((props) => {
  const partsHandle = Meteor.subscribe('all.parts')

  return {
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(Ordering)
