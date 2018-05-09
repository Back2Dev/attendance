import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data';
import ConfirmCheckin from '../components/confirm-checkin'
import People, {insert, remove} from '/imports/collections/People'

// not sure if this is necessary if I search for person by id in confirm-checkin itself
const ConfirmContainer = createContainer((props) => {
  return {
    people: People.find({}).fetch()
  }
}, ConfirmCheckin)

export default ConfirmContainer