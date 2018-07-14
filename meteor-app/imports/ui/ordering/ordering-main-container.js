import { Meteor } from 'meteor/meteor'
import { withTracker } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session'
import { debounce, escapeRegExp } from 'lodash'

import OrderingMain from '/imports/ui/ordering/ordering-main'
import Parts from '/imports/api/parts/parts';

Session.set('searchQuery', '')

export default withTracker((props) => {
  const partsHandle = Meteor.subscribe('all.parts')
  
//   prevents search filter from persisting after checkin / out
  if (!partsHandle.ready()) {
    Session.set('searchQuery', '')
  }

  const filter = (query) => {
    const searching = query != ''
    if (searching) {
      return {
        name: { $regex: new RegExp(escapeRegExp(query)), $options: 'i' },
        isHere: false
      }
    } else {
      return { isHere: false }
    }
  }

  return {
    parts: Parts.find({}).fetch(),
    loading: !partsHandle.ready(),
    searchQuery: Session.get('searchQuery'),
  }
})(OrderingMain)
