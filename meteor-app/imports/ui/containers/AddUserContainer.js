import { createContainer } from 'meteor/react-meteor-data';
import { insert } from '/imports/collections/People';
import AddVolunteer from '../components/add-volunteer';

function handleSubmit ({ firstname, surname, pplPhone, pplEmail, avatar }) {
  console.log("Container handleSubmit method");
  insert.call({
    // check record attendance insert for example
    firstname,
    surname,
    pplPhone,
    pplEmail,
    avatar,
  });
    // browserHistory.push('/');
    // return <Redirect push to="/" />
    // TODO: use the router instead of this brute force 'goto page'
    window.location.href = '/';
}
const AddUserContainer = createContainer(() => {
  return {
    onSubmit: handleSubmit,
  };
}, AddVolunteer);

export default AddUserContainer;
