import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import CheckInList from '../components/checkin-list';
import People , {insert, remove} from '/imports/collections/People';
import Attendances from '/imports/collections/Attendances'
import * as sg from 'sugar';              // sugar utility
import { withRouter } from 'react-router'

function recordAttendance(person_id, hours) {

  // put attendance record
  Attendances.insert({
    atnPersonID: person_id,
    atnDate: sg.Date.create('today'),
    atnHours: hours
  });
  
  // update last attended date for the person
  let updateDoc = {}
  updateDoc._id = person_id;
  updateDoc.lastIn = sg.Date.create('today');

  People.update(
    person_id, 
    {$set: updateDoc}
  );

}

const CheckinContainer = createContainer(() => {
  const peopleHandle = Meteor.subscribe('ready.for.checkin');
  const loading = ! peopleHandle.ready();
  const ppl = People.find({lastIn: {$ne: sg.Date.create('today')}}, { sort: { lastIn: 1, surname: -1} }).fetch();

  return {
    loading,
    ppl,
    recordAttendance,
  };
}, CheckInList);

export default withRouter(CheckinContainer)
