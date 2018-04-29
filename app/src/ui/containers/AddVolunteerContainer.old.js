import { createContainer } from 'meteor/react-meteor-data';
import { insert } from '/imports/collections/mcPeople';
import AddVolunteer from '../components/add-volunteer';

function handleSubmit ({ pplName, pplSurname, pplPhone, pplEmail, pplAvatar }) {
  console.log("Container handleSubmit method");
  insert.call({
    // check record attendance insert for example
    pplName,
    pplSurname,
    pplPhone,
    pplEmail,
    pplAvatar,
  });
    // browserHistory.push('/');
    // return <Redirect push to="/" />
    // TODO: use the router instead of this brute force 'goto page'
    window.location.href = '/';
}
const AddVolunteerContainer = createContainer(() => {
  return {
    onSubmit: handleSubmit,
  };
}, AddVolunteer);

export default AddVolunteerContainer;
