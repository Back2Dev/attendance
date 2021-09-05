import forms, { FormsSchema } from '/imports/api/forms/schema'
import registrations, { RegistrationsSchema } from '/imports/api/registrations/schema'
import messageTemplates, {
  MessageTemplatesSchema,
} from '/imports/api/message-templates/schema'
import events, { EventsSchema } from '/imports/api/events/schema'

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
    default:
      return null
  }
}

export default getCollection
