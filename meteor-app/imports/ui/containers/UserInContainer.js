import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import UserIn from '../components/user-in';
import People , {insert, remove} from '/imports/collections/People';
import * as sg from 'sugar';              // sugar utility
import { withRouter } from 'react-router-dom'

const UserInContainer = createContainer(() => {
  const peopleHandle = Meteor.subscribe('checked.in');
  const loading = ! peopleHandle.ready();
  const ppl = People.find({lastIn: {$eq: sg.Date.create('today')}}, { sort: { lastIn: 1, surname: -1} }).fetch();

  return {
    loading,
    ppl,
  };
}, UserIn);

export default withRouter(UserInContainer);
