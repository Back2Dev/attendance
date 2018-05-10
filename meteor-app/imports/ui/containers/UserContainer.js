import { Meteor } from 'meteor/meteor'
import { createContainer } from 'meteor/react-meteor-data';
import User from '../components/user'
import People, {insert, remove} from '/imports/collections/People'

// not sure if this is necessary if I search for person by id in user itself
const UserContainer = createContainer((props) => {
  const peopleHandle = Meteor.subscribe('everyone');
  const loading = ! peopleHandle.ready();
  
  const id = props.match.params.id;
  // what has subscription got to do with this?
  const user = People.findOne({ "_id": props.match.params.id });

  return {
    user
  }
}, User)

export default UserContainer