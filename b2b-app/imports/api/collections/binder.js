import forms, { FormsSchema } from '/imports/api/forms/schema'
import registrations, { RegistrationsSchema } from '/imports/api/registrations/schema'
import messageTemplates, {
  MessageTemplatesSchema,
} from '/imports/api/message-templates/schema'
import serviceItems, { ServiceItemsSchema } from '/imports/api/service-items/schema'
import events, { EventsSchema } from '/imports/api/events/schema'
import Courses, { CoursesSchema } from '/imports/api/courses/schema'
import Members, { MembersSchema } from '/imports/api/members/schema'

const getCollection = (name) => {
  switch (name) {
    case 'events':
      return { collection: events, schema: EventsSchema }
    case 'forms':
      return { collection: forms, schema: FormsSchema }
    case 'registrations':
      return { collection: registrations, schema: RegistrationsSchema }
    case 'messageTemplates':
      return { collection: messageTemplates, schema: MessageTemplatesSchema }
    case 'serviceItems':
      return { collection: serviceItems, schema: ServiceItemsSchema }
    case 'courses':
      return { collection: Courses, schema: CoursesSchema }
    case 'members':
      return { collection: Members, schema: MembersSchema }
    default:
      return null
  }
}

export default getCollection
