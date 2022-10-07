import { Meteor } from 'meteor/meteor'
import PdfTemplates from '../schema'
import '../methods'
/* Commented out related publications (if any) - best to add these in manually as required
 
*/

Meteor.publish('all.pdfTemplates', () => {
  return PdfTemplates.find({})
})

Meteor.publish('id.pdfTemplates', (id) => {
  return [
    PdfTemplates.find(id),
    /* Commented out related publications (if any) - best to add these in manually as required
     
    */
  ]
})
