// rejects.js
import { Mongo } from 'meteor/mongo'

//
// A place to put the member records we couldn't import
//

const Rejects = new Mongo.Collection('rejects')

export default Rejects;
