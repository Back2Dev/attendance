
import { createContainer } from 'meteor/react-meteor-data';
import Search from '../components/Search';

let searchQuery = new ReactiveVar("");
let searching = new ReactiveVar(false);

export default createContainer(() => {

  const handle = Meteor.subscribe( 'volunteers', searchQuery.get(), () => {
      setTimeout( () => {
        searching.set( false );
      }, 300 );
    });

  const loading = !handle.ready()
  
  const volunteers = People.find().fetch();

  return {
    searchQuery,
    searching,
    volunteers
  };
}, Search);